const { BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential } = require("@azure/storage-blob");
const fs = require("fs");
require('dotenv').config();
const mysql = require('mssql');

const multer = require("multer");
const path = require("path");


const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
const ACCOUNTNAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);



const config = {
    user: process.env.AZURE_SQL_USERNAME,
    password: process.env.AZURE_SQL_PASSWORD,
    server: process.env.AZURE_SQL_SERVER,
    database: process.env.AZURE_SQL_DATABASE,
    options: {
      encrypt: true, // required for Azure
      trustServerCertificate: false
    },
    port: parseInt(process.env.AZURE_SQL_PORT, 10)
};

async function uploadMediaToBlob(filePath, mimeType, projectId, username) {

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const extension = mimeType.split('/')[1]; // Extract extension from mimeType
    const blobName = `${projectId}/${username}/${Date.now()}.${extension}`;
    const blobClient = containerClient.getBlockBlobClient(blobName);

    const metadata = { project_id: projectId, user_name: username };
    console.log(metadata);

    try {
        const buffer = fs.readFileSync(filePath);
        const options = {
            blobHTTPHeaders: { blobContentType: mimeType }, // Set the correct Content-Type
            metadata,
        };

        await blobClient.uploadData(buffer, options);
        console.log(`File uploaded: ${blobName}`);
        return blobName;
    } catch (error) {
        console.error('Error uploading blob:', error.message);
        throw error;
    }


   // const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    // const containerClient = blobServiceClient.getContainerClient(containerName);
    // const blobName = `${projectId}/${username}/${Date.now()}_${filePath.split("/").pop()}`;
    // const blobClient = containerClient.getBlockBlobClient(blobName);

    // // Determine content type
    // let contentType = filePath.endsWith(".png")
    //     ? "image/png"
    //     : filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")
    //     ? "image/jpeg"
    //     : filePath.endsWith(".mp4")
    //     ? "video/mp4"
    //     : null;

    // if (!contentType) {
    //     console.error("Unsupported file type.");
    //     return;
    // }

    // const metadata = { project_id: projectId, user_name: username };

    // try {
    //     const options = {
    //         blobHTTPHeaders: { blobContentType: contentType },
    //         metadata,
    //     };

    //     const stream = fs.createReadStream(filePath);
    //     const stat = fs.statSync(filePath);

    //     await blobClient.uploadStream(stream, stat.size, undefined, options);
    //     await insertBlobMetadata(username, projectId, blobName);

    //     console.log(`File uploaded: ${blobName}`);
    //     return blobName;
    // } catch (error) {
    //     console.error("Error uploading blob:", error.message);
    // }
}

// testing
// const filePath = "back-end\\assets\\images\\dog.jpeg";
// const pId = "-1";
// uploadMediaToBlob(filePath, pId, "2");


async function insertBlobMetadata(userId, projectId, blobName) {
    try {
        await mysql.connect(config);
        const query = `
            INSERT INTO submissions (user_name, proj_id, url_of_submission)
            VALUES (@userId, @projectId, @blobName)
        `;
        const request = new mysql.Request();
        request.input('userId', mysql.NVarChar, userId);
        request.input('projectId', mysql.Int, parseInt(projectId));
        request.input('blobName', mysql.NVarChar, blobName);
        await request.query(query);
        console.log("Metadata inserted successfully.");
    } catch (err) {
        console.error("Error inserting blob metadata:", err);
    } finally {
        await mysql.close();
    }
}

//test



// //FINAL METHOD TO SUBMIT PROOF
// async function submitProof(filePath, mimeType, projectId, username) {

//     blobName = uploadMediaToBlob(filePath, mimeType, projectId, username);

//     insertBlobMetadata(username, projectId, blobName.toString()) 
// }
async function submitProof(filePath, mimeType, projectId, username) {
    try {
        const blobName = await uploadMediaToBlob(filePath, mimeType, projectId, username);
        await insertBlobMetadata(username, projectId, blobName.toString());
        console.log('Proof submitted successfully.');
    } catch (error) {
        console.error('Error in submitProof:', error.message);
        throw error;
    }
}

module.exports = { submitProof, getMediaDetails};

//test
// const filePath = "assets\\images\\flowers.jpeg";
// const pId = "1";
// submitProof(filePath, pId, "T");


async function generateSasUrls(username, projectId) {
    try {
        await mysql.connect(config);
        const query = `
            SELECT blob_name
            FROM submissions
            WHERE user_name = @username AND proj_id = @projectId
        `;
        const request = new mysql.Request();
        request.input("username", mysql.NVarChar, username);
        request.input("projectId", mysql.Int, parseInt(projectId));

        const result = await request.query(query);
        const blobNames = result.recordset.map(row => row.blob_name);

        
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const sasUrls = [];

        for (const blobName of blobNames) {
            const blobClient = containerClient.getBlobClient(blobName);

            const expiryDate = new Date(new Date().valueOf() + 3600 * 1000); // 1 hour expiry
            const sasToken = generateBlobSASQueryParameters({
                containerName,
                blobName,
                expiresOn: expiryDate,
                permissions: "r",
            }, sharedKeyCredential).toString();

            sasUrls.push({
                blobName,
                sasUrl: `${blobClient.url}?${sasToken}`,
            });
        }

        return sasUrls;
    } catch (err) {
        console.error("Error generating SAS URLs:", err);
        throw err;
    } finally {
        await mysql.close();
    }
}



// Create a blob service client using your connection string
//const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

// Function to generate a SAS token for a specific blob
async function generateBlobSasToken(containerName, blobName) {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Set the permissions for the SAS token (read permission in this case)
    const blobClient = containerClient.getBlobClient(blobName);

    // Create the SAS token for the blob
    const expiresOn = new Date();
    expiresOn.setMinutes(expiresOn.getMinutes() + 60); // Set expiration time (1 hour in this example)

    const sasToken = blobClient.generateSasUrl({
        expiresOn,
        permissions: "r",  // 'r' = read permission
    });

    return sasToken;
}

async function getBlobStream(username, projID, fileUrl) {
    try {
       
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobName = `${projID}/${username}/${fileUrl}`;
        console.log("Blob Name:", blobName);
        
        const blobClient = containerClient.getBlobClient(blobName);
        const downloadResponse = await blobClient.download();
        
        // Return the content type and stream
        return {
            contentType: downloadResponse.contentType || 'application/octet-stream',
            readableStream: downloadResponse.readableStreamBody,
        };
    } catch (error) {
        console.error(`Error retrieving blob ${fileUrl}:`, error);
        throw new Error("Failed to retrieve blob");
    }
}

async function fetchBlobNameFromDB(username, projID) {
    try {
        await mysql.connect(config);
        const query = `
            SELECT url_of_submission
            FROM submissions
            WHERE user_name = @username AND proj_id = @projID
        `;
        const request = new mysql.Request();
        request.input("username", mysql.NVarChar, username);
        request.input("projID", mysql.Int, parseInt(projID));

        const result = await request.query(query);
        
        if (result.recordset.length === 0) {
            throw new Error("No media files found for the given user and project.");
        }

        // Return just the file URL
        const urlOfSubmission = result.recordset[0].url_of_submission;
        return urlOfSubmission.split('/').pop().replace(/\\/g, '/');
    } catch (error) {
        console.error("Error querying database:", error);
        throw new Error("Failed to retrieve blob name from database.");
    } finally {
        await mysql.close();
    }
}


// async function getMediaDetails(username, projID) {
//     try {
//         // Fetch the blob name from the database
//         const fileUrl = await fetchBlobNameFromDB(username, projID);

//         // Retrieve the blob data as a buffer and content type
//         const { contentType, buffer } = await getBlobDataAsBuffer(username, projID, fileUrl);

//         // If buffer or contentType is not found, return null to indicate failure
//         if (!buffer || !contentType) {
//             return { success: false, message: "Media not found." };
//         }

//         // Return the media details for further handling
//         return {
//             success: true,
//             contentType,
//             buffer,
//             fileUrl
//         };
//     } catch (error) {
//         console.error("Error processing media request:", error.message);
//         return { success: false, message: error.message };
//     }
// }

async function getMediaDetails(username, projID) {
    try {
        // Fetch the blob name from the database
        const fileUrl = await fetchBlobNameFromDB(username, projID);

        // Construct the blob name (path to blob in Azure)
        const blobName = `${projID}/${username}/${fileUrl}`;

        // Generate SAS token for the specific blob
        const sasToken = await generateBlobSasToken(containerName, blobName);

        // Construct the URL with SAS token
        const mediaUrl = `https://${ACCOUNTNAME}.blob.core.windows.net/${containerName}/${blobName}`;

        return {
            success: true,
            mediaUrl,
            contentType: 'image/png',  // You can modify this dynamically based on the file type
        };
    } catch (error) {
        console.error("Error processing media request:", error.message);
        return { success: false, message: error.message };
    }
}

async function getBlobDataAsBuffer(username, projID, fileUrl) {
    try {
        
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobName = `${projID}/${username}/${fileUrl}`;
        console.log("Blob Name:", blobName);

        const blobClient = containerClient.getBlobClient(blobName);
        const downloadResponse = await blobClient.download();
        
        // Convert the stream to a buffer
        const chunks = [];
        for await (const chunk of downloadResponse.readableStreamBody) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        
        // Return the buffer and content type
        return {
            contentType: downloadResponse.contentType || 'application/octet-stream',
            buffer: buffer,
        };
    } catch (error) {
        console.error(`Error retrieving blob ${fileUrl}:`, error);
        throw new Error("Failed to retrieve blob");
    }
}




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // Folder to save uploaded files
    },
    filename: (req, file, cb) => {
        // Use only the original extension, not the original filename
        const extension = path.extname(file.originalname);  // Get the extension (e.g., ".jpeg")
        const timestamp = Date.now();  // Add a timestamp to avoid filename conflicts

        // Generate a new filename using the timestamp and the original extension
        cb(null, `${timestamp}${extension}`);  // Filename will be like "1679900000000.jpeg"
    },
});

const upload = multer({ storage: storage });




