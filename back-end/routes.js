const express = require("express");
const fs = require("fs");
require("dotenv").config();
const mysql = require("mssql");
const multer = require("multer"); // for handling file uploads
const app = express();
const port = process.env.PORT || 3000;

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


