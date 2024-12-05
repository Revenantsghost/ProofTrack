require('dotenv').config();
const express = require('express');

const cors = require('cors');
const { connectToDB, closeDB } = require('./db');

const fs = require("fs");

const multer = require("multer"); // for handling file uploads

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);  // Log the incoming request method and URL
    next();
});

 const upload = multer({ dest: "uploads/" }); // temp upload location

 const { submitProof } = require("./mediaInteraction.js");


//TESTING ONLY
 app.get('/ping', (req, res) => {
    console.log("Ping route hit");
    res.status(200).send('pong');
});

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

// Create new user with {user_name: STRING, password: STRING}
// Returns 201 User Created
// Returns 400 Bad Request for invalid username/password
// Return 409 Conflict if user_name is already taken
// Returns 500 Server Error on server failure
app.post('/register', async (req, res) => {
    try {
        const user_name = req.body.user_name;
        const password = req.body.password;
        if (user_name && password) {
            const pool = await connectToDB();

            // Check if username is taken
            const result = await pool.request().input('user_name', user_name).query('SELECT num_of_projects FROM users WHERE user_name=@user_name');
            if (result.recordset.length > 0) {
                res.status(409).send('Username already taken');
                return;
            }
            await pool.request()
                .input('password', password)
                .input('user_name', user_name)
                .query(`INSERT INTO users (user_name, password) VALUES (@user_name, @password)`);
            res.status(201).send('User Created');
            //res.status(201).json({"user_id": user_id})
        } else {
            res.status(400).send('Bad Request');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Attempts to login with {username: STRING, password: STRING}
// Returns 200 {login_success: true, num_of_projects: INT} if username and password are found in database
// Returns 404 Incorrect Username or Password
// Returns 500 Server Error on server failure
app.post('/login', async (req, res) => {
    console.log('POST /login hit');
    try {
        const { username, password } = req.body; // Extract username and password from the request body
        if (username && password) {
            const pool = await connectToDB();
            const result = await pool.request().input('user_name', username).query('SELECT password, num_of_projects FROM users WHERE user_name=@user_name');
            
            if (result.recordset.length <= 0 || result.recordset[0].password !== password) {
                res.status(404).send('Incorrect Username or Password, please try again');
                return;
            }
            res.status(200).json({ login_success: true, num_of_projects: result.recordset[0].num_of_projects});
        } else {
            res.status(400).send('Bad Request');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Updates the password with {user_name: STRING, new_password: STRING, old_password: STRING}
// Returns 200 Password updated successfully upon success
// Returns 400 Bad Request if Username and/or password(s) missing
// Returns 401 unauthorized if old_password is not the same as the password in the file
// Returns 404 User not found if user_name is not found in the database
// Returns 500 Server Error on server failure
app.put('/changePassword', async (req, res) => {
    try {
        const user_name = req.body.user_name;
        const new_password = req.body.new_password
        const old_password = req.body.old_password
        if (!user_name || !new_password || !old_password) {
            res.status(400).send('Bad Request');
            return;
        }
        const pool = await connectToDB();
        const result = await pool.request().input('user_name', user_name).query('SELECT password FROM users WHERE user_name=@user_name');
        if (result.recordset.length <= 0) {
            res.status(404).send('User not found');
            return
        }
        if (result.recordset[0].password !== old_password) {
            res.status(401).send('Incorrect Username or Password');
            return
        }
        await pool.request().input('password', new_password).input('user_name', user_name)
            .query('UPDATE users SET password=@password WHERE user_name=@user_name');
        res.status(200).send("Password updated successfully")
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Retrieve profile with query params user_name
// Inputs: {user_name: STRING}
// Returns 200 {num_of_projects: INT}
// Returns 404 User not found if user_name is not found in the database
// Returns 500 Server Error on server failure
app.get('/fetchProfile', async (req, res) => {
    try {
        const user_name = req.query.user_name;
        const pool = await connectToDB();
        const result = await pool.request().input('user_name', user_name).query('SELECT num_of_projects FROM users WHERE user_name=@user_name');
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Create new project with
// {proj_name: STRING, user_name: INT, checkpointFrequency: STRING, duration: STRING, startDate: STRING}
// Returns {proj_id: INT} 201
// Returns 400 Bad Request for invalid proj_name, checkpointFrequency, duration, or startDate
// Returns 404 User Not Found if user_name is not found in the database
// Returns 500 Server Error on server failure
app.post('/uploadProject', async (req, res) => {
    try {
        const user_name = req.body.user_name;
        const proj_name = req.body.proj_name;
        const checkpointFrequency = req.body.checkpointFrequency;
        const duration = req.body.duration;
        const startDate = req.body.startDate;
        if (!proj_name || !checkpointFrequency || !duration || !startDate) {
            res.status(400).send('Bad Request');
            return;
        }
        const pool = await connectToDB();
        let result = await pool.request().input('user_name', user_name).query('SELECT user_name FROM users WHERE user_name=@user_name');
        if (result.recordset.length <= 0) {
            res.status(404).send('User not found');
        } else {
            await pool.request().input('user_name', user_name)
                .query('UPDATE users SET num_of_projects=num_of_projects+1 WHERE user_name=@user_name');
            result = await pool.request()
                            .input('user_name', user_name).query(`SELECT COUNT(*) AS count FROM projects WHERE user_name=@user_name`);
            const proj_id = result.recordset[0].count + 1;
            await pool.request()
                .input('user_name', user_name)
                .input('proj_id', proj_id)
                .input('proj_name', proj_name)
                .input('checkpointFrequency', checkpointFrequency)
                .input('duration', duration)
                .input('startDate', startDate)
                .query(`INSERT INTO projects (proj_id, proj_name, user_name, checkpointFrequency, duration, startDate) VALUES (@proj_id, @proj_name, @user_name, @checkpointFrequency, @duration, @startDate)`);
            res.status(201).json({"proj_id": proj_id})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Find the project from certain user with query params user_name and proj_id
// Returns {proj_name: STRING, checkpointFrequency: STRING, duration: STRING, startDate: STRING} 200
// Returns 404 User Not Found if user_name is not found in the database
// Returns 404 Project not found if proj_id is not found in the database
// Returns 500 Server Error on server failure
app.get('/fetchProject', async (req, res) => {
    try {
        const user_name = req.query.user_name;
        const proj_id = req.query.proj_id;

        const pool = await connectToDB();
        let result = await pool.request()
                    .input('user_name', user_name)
                    .query('SELECT user_name FROM users WHERE user_name=@user_name');
        if (result.recordset.length <= 0) {
            res.status(404).send('User not found');
            return
        }
        result = await pool.request().input('user_name', user_name).input('proj_id', proj_id)
                .query('SELECT proj_name, checkpointFrequency, duration, startDate FROM projects WHERE user_name=@user_name AND proj_id=@proj_id');
        if (result.recordset.length <= 0) {
            res.status(404).send('Project not found');
            return
        }
        res.status(200).json(result.recordset[0])
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Find all projects from certain user with query params user_name
// Returns [{proj_id: STRING, proj_name: STRING}, {proj_id: STRING, proj_name: STRING}, ...] 200
// Returns 404 User Not Found if user_name is not found in the database
// Returns 500 Server Error on server failure
app.get('/fetchProjects', async (req, res) => {
    try {
        const user_name = req.query.user_name;
        const pool = await connectToDB();
        let result = await pool.request().input('user_name', user_name).query('SELECT user_name FROM users WHERE user_name=@user_name');
        if (result.recordset.length <= 0) {
            res.status(404).send('User not found');
        } else {
            result = await pool.request().input('user_name', user_name)
                .query('SELECT proj_id, proj_name FROM projects WHERE user_name=@user_name');
            res.status(200).json(result.recordset)
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Updates a specific project with {proj_id: INT, user_name: STRING, proj_name: STRING}
// Returns 200 project udpated successfully upon success
// Returns 404 User not found if user_name is not found in the database
// Returns 404 Project not found if proj_id is not found in the database
// Returns 500 Server Error on server failure
app.put('/updateProject', async (req, res) => {
    try {
        const user_name = req.body.user_name;
        const proj_id = req.body.proj_id;
        const proj_name = req.body.proj_name;
        const pool = await connectToDB();
        let result = await pool.request().input('user_name', user_name).query('SELECT user_name FROM users WHERE user_name=@user_name');
        if (result.recordset.length <= 0) {
            res.status(404).send('User not found');
            return
        }
        result = await pool.request()
            .input('proj_id', proj_id)
            .input('user_name', user_name)
            .query('SELECT proj_name FROM projects WHERE user_name=@user_name AND proj_id=@proj_id');
        if (result.recordset.length <= 0) {
            res.status(404).send('Project not found');
            return
        }
        await pool.request().input('user_name', user_name)
            .input('proj_id', proj_id)
            .input('proj_name', proj_name)
            .query('UPDATE projects SET proj_name=@proj_name WHERE user_name=@user_name AND proj_id=@proj_id');
        res.status(200).send("Project updated successfully")
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// TESTING PURPOSES ONLY
// Deletes a user and all associated projects (users table and projects table) given {user_name: STRING}
// Returns 200 user deleted upon success
// Returns 404 User not found if user_name is not found in the database
// Returns 500 Server Error on server failure
app.delete('/hardDELETEUSER', async (req, res) => {
    try {
        const user_name = req.body.user_name;
        const pool = await connectToDB();
        let result = await pool.request().input('user_name', user_name).query('SELECT user_name FROM users WHERE user_name=@user_name');
        if (result.recordset.length <= 0) {
            res.status(404).send('User not found');
            return
        }
        await pool.request()
            .input('user_name', user_name)
            .query('DELETE FROM projects WHERE user_name=@user_name');
        await pool.request()
            .input('user_name', user_name)
            .query('DELETE FROM users WHERE user_name=@user_name');
        res.status(200).send("USER DELETED successfully")
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
    closeDB();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`!!Server is running on http://localhost:${PORT}`);
});

// Shuts down server
process.on('SIGTERM', async () => {
    closeDB();
    process.exit(0);
});

process.on('SIGINT', async () => {
    closeDB();
    process.exit(0);
});



module.exports = app;

