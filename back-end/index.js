require('dotenv').config();
const express = require('express');

const cors = require('cors');
const { connectToDB, closeDB } = require('./db');

const fs = require("fs");

const multer = require("multer"); // for handling file uploads

const app = express();
app.use(cors());
app.use(express.json());

 const upload = multer({ dest: "uploads/" }); // temp upload location

 const { submitProof } = require("./mediaInteraction.js");

// Endpoint to submit proof
app.post("/submit-proof", upload.single("file"), async (req, res) => {
    const filePath = req.file.path;  
    const projectId = req.body.projectId;
    const userId = req.body.userId;

    if (!filePath || !projectId || !userId) {
        return res.status(400).send({ message: "file, projectId, and userId are required." });
    }

    try {
        await submitProof(filePath, projectId, userId);
        fs.unlinkSync(filePath);  // Delete temporary file
        res.status(200).send({ message: "Proof submitted successfully." });
    } catch (error) {
        console.error("Error submitting proof:", error);
        res.status(500).send({ message: "An error occurred while submitting proof." });
    }
});

/**
 * Endpoint to retrieve all media files for a specific project and user
 */
app.get('/media/:userId/:projectId', async (req, res) => {
    const { userId, projectId } = req.params;

    try {
        // Retrieve the media files
        const mediaFiles = await getMediaFiles(userId, projectId);

        res.status(200).json({
            success: true,
            message: "Media files retrieved successfully",
            files: mediaFiles.map(file => ({
                fileName: file.fileName,
                fileData: file.data.toString('base64') // Convert binary data to base64 for JSON transport
            }))
        });
    } catch (error) {
        console.error("Error retrieving media files:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve media files" });
    }
});

// Retrieve profile with query params user_id
// Inputs: {user_id: INT}
// Returns 200 {user_name: STRING, num_of_projects: INT}
// Returns 404 User not found if userID is not found in the database
// Returns 500 Server Error on server failure
app.get('/fetchProfile', async (req, res) => {
    try {
        const user_id = req.query.user_id;
        const pool = await connectToDB();
        const result = await pool.request().input('user_id', user_id).query('SELECT user_name, num_of_projects FROM users WHERE user_id=@user_id');
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    } finally {
        await closeDB();
    }
});

// Create new user with {user_name: STRING}
// Returns {user_id: INT} 201
// Returns 400 Bad Request for invalid username
// Returns 500 Server Error on server failure
app.post('/register', async (req, res) => {
    try {
        const user_name = req.body.user_name;
        if (user_name) {
            const pool = await connectToDB();
            const result = await pool.request().query(`SELECT ISNULL(MAX(user_id), 0) AS count FROM users`);
            const user_id = result.recordset[0].count + 1;
            await pool.request()
                .input('user_id', user_id)
                .input('user_name', user_name)
                .input('num_of_projects', 0)
                .query(`INSERT INTO users (user_id, user_name, num_of_projects) VALUES (@user_id, @user_name, @num_of_projects)`);
            //res.status(201).send('User Created');
            res.status(201).json({"user_id": user_id})
        } else {
            res.status(400).send('Bad Request');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    } finally {
        await closeDB();
    }
});

// Updates the username with {user_name: STRING, user_id: INT}
// Returns 200 Profile udpated successfully upon success
// Returns 404 User not found if userID is not found in the database
// Returns 500 Server Error on server failure
app.put('/updateProfile', async (req, res) => {
    try {
        const user_name = req.body.user_name;
        if (!user_name) {
            res.status(400).send('Bad Request');
            return;
        }
        const user_id = req.body.user_id;
        const pool = await connectToDB();
        const result = await pool.request().input('user_id', user_id).query('SELECT user_name FROM users WHERE user_id=@user_id');
        if (result.recordset.length <= 0) {
            res.status(404).send('User not found');
            return
        }
        await pool.request().input('user_id', user_id).input('user_name', user_name)
            .query('UPDATE users SET user_name=@user_name WHERE user_id=@user_id');
        res.status(200).send("Profile updated successfully")
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    } finally {
        await closeDB();
    }
});

// Create new project with {project_name: STRING, user_id: INT}
// Returns {proj_id: INT} 201
// Returns 400 Bad Request for invalid project name
// Returns 404 User Not Found if userID is not found in the database
// Returns 500 Server Error on server failure
app.post('/uploadProject', async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const project_name = req.body.project_name
        if (!project_name) {
            res.status(400).send('Bad Request');
            return;
        }
        const pool = await connectToDB();
        let result = await pool.request().input('user_id', user_id).query('SELECT user_name FROM users WHERE user_id=@user_id');
        if (result.recordset.length <= 0) {
            res.status(404).send('User not found');
        } else {
            await pool.request().input('user_id', user_id)
                .query('UPDATE users SET num_of_projects=num_of_projects+1 WHERE user_id=@user_id');
            result = await pool.request()
                            .input('user_id', user_id).query(`SELECT COUNT(*) AS count FROM projects WHERE user_id=@user_id`);
            const proj_id = result.recordset[0].count + 1;
            await pool.request()
                .input('user_id', user_id)
                .input('proj_id', proj_id)
                .input('project_name', project_name)
                .query(`INSERT INTO projects (proj_id, project_name, user_id) VALUES (@proj_id, @project_name, @user_id)`);
            //res.status(201).send('User Created');
            res.status(201).json({"proj_id": proj_id})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    } finally {
        await closeDB();
    }
});


// Find all projects from certain user with query params user_id
// Returns [{project_name: STRING}, {project_name: STRING}, ...] 200
// Returns 404 User Not Found if userID is not found in the database
// Returns 500 Server Error on server failure
app.get('/fetchProjects', async (req, res) => {
    try {
        const user_id = req.query.user_id;
        const pool = await connectToDB();
        let result = await pool.request().input('user_id', user_id).query('SELECT user_name FROM users WHERE user_id=@user_id');
        if (result.recordset.length <= 0) {
            res.status(404).send('User not found');
        } else {
            result = await pool.request().input('user_id', user_id)
                .query('SELECT proj_id, project_name FROM projects WHERE user_id=@user_id');
            res.status(200).json(result.recordset)
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    } finally {
        await closeDB();
    }
});

// Find the project from certain user with query params user_id and proj_id
// Returns {project_name: STRING} 200
// Returns 404 User Not Found if userID is not found in the database
// Returns 404 Project not found if projectID is not found in the database
// Returns 500 Server Error on server failure
app.get('/fetchProject', async (req, res) => {
    try {
        const user_id = req.query.user_id;
        const proj_id = req.query.proj_id;

        const pool = await connectToDB();
        let result = await pool.request()
                    .input('user_id', user_id)
                    .query('SELECT user_name FROM users WHERE user_id=@user_id');
        if (result.recordset.length <= 0) {
            res.status(404).send('User not found');
            return
        }
        result = await pool.request().input('user_id', user_id).input('proj_id', proj_id)
                .query('SELECT project_name FROM projects WHERE user_id=@user_id AND proj_id=@proj_id');
        if (result.recordset.length <= 0) {
            res.status(404).send('Project not found');
            return
        }
        res.status(200).json(result.recordset[0])
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    } finally {
        await closeDB();
    }
});

// Updates a specific project with {proj_id: INT, user_id: INT, project_name: STRING}
// Returns 200 project udpated successfully upon success
// Returns 404 User not found if userID is not found in the database
// Returns 404 Project not found if projectID is not found in the database
// Returns 500 Server Error on server failure
app.put('/updateProject', async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const proj_id = req.body.proj_id;
        const project_name = req.body.project_name;
        const pool = await connectToDB();
        let result = await pool.request().input('user_id', user_id).query('SELECT user_name FROM users WHERE user_id=@user_id');
        if (result.recordset.length <= 0) {
            res.status(404).send('User not found');
            return
        }
        result = await pool.request()
            .input('proj_id', proj_id)
            .input('user_id', user_id)
            .query('SELECT project_name FROM projects WHERE user_id=@user_id AND proj_id=@proj_id');
        if (result.recordset.length <= 0) {
            res.status(404).send('Project not found');
            return
        }
        await pool.request().input('user_id', user_id)
            .input('proj_id', proj_id)
            .input('project_name', project_name)
            .query('UPDATE projects SET project_name=@project_name WHERE user_id=@user_id AND proj_id=@proj_id');
        res.status(200).send("Project updated successfully")
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    } finally {
        await closeDB();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


module.exports = app;
