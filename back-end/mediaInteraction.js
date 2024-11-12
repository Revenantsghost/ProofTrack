const { BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential } = require("@azure/storage-blob");
const fs = require("fs");
require('dotenv').config();
const mysql = require('mssql');
const { use } = require(".");
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

module.exports = { submitProof };
module.exports = { getMediaFiles };


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

function hash(filePath) {
    hashed = 0
    for(let i = 0; i<filePath.length(); i++) {
        hashed +=  Math.pow(filePath.charAt(i), i) * Math.pow(31, i)
    }
    return hashed

}


async function uploadMediaToBlob(filePath, projectId, userId) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    

    const blobName = filePath.split("/").pop(); // Extract the file name
    const blobClient = containerClient.getBlockBlobClient(blobName);

    // Determine content type
    let contentType = "";
    if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
        contentType = "image/jpeg";
    } else if (filePath.endsWith(".png")) {
        contentType = "image/png";
    } else if (filePath.endsWith(".mp4")) {
        contentType = "video/mp4";
    } else {
        console.error("Unsupported file type.");
        return;
    }
    hashedVal = hash(filePath)
    const metadata = {
        project_id: projectId,
        user_id: userId,
        hash: hashedVal
    };

    // Upload blob
    const options = {
        blobHTTPHeaders: {
            blobContentType: contentType,
        },
        metadata: metadata,
    };

    const stream = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);

    try {
        await blobClient.uploadStream(stream, stat.size, undefined, options);
        console.log(`File '${blobName}' uploaded successfully with project_id '${projectId} and user_id '${userId}'.`);
    } catch (error) {
        console.error("Error uploading file:", error.message);
    }
}

// testing
// const filePath = "back-end\\assets\\images\\dog.jpeg";
// const pId = "-1";
// uploadMediaToBlob(filePath, pId);



async function getSasUrls(projectId, userId, hashed) {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

    // Create a BlobServiceClient
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const sasUrls = [];

     try {
        // List blobs in the container
        for await (const blob of containerClient.listBlobsFlat()) {
            // Fetch blob client for each blob
            const blobClient = containerClient.getBlobClient(blob.name);

            // Check metadata for project ID
            const blobProperties = await blobClient.getProperties();
            const metadata = blobProperties.metadata;
            console.log(metadata);


            if (metadata.user_id && metadata.project_id && hashed && hashed === metadata.hashed && metadata.user_id === userId && metadata.project_id === projectId) {

                const expiryDate = new Date(new Date().valueOf() + 3600 * 1000); // 1 hour expiry so sas urls should go to db and then to users within an hr
               
                // Generate the SAS token
                const sasOptions = {
                    expiresOn: expiryDate,
                    permissions: 'r' 
                };

                const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
                const sasUrl = `${blobClient.url}?${sasToken}`;

                sasUrls.push(sasUrl);
            }
         }

         return sasUrls;

    } catch (error) {
        console.error("Error retrieving SAS URLs:", error);
        throw error; 
    }
}

// test
// const projectId = "-1"; 
// getSasUrls(projectId).then(sasUrls => {
//     console.log("SAS URLs for project ID:", projectId);
//     console.log(sasUrls);
// }).catch(err => {
//     console.error("Error:", err);
// });

//add sas url to db
async function insertSasUrl(userId, projectId, sasUrl) {
    try {
      await mysql.connect(config);
       console.log("Connected to the database!");

      const query = `
            INSERT INTO submissions (user_id, proj_id, url_of_submission) 
            VALUES (@userId, @sasUrl, @projectId)`;

        const values = {
            userId: userId,
            sasUrl: sasUrl,
            projectId: parseInt(projectId)
        };

        const request = new mysql.Request();
        request.input('user_id', mysql.NVarChar, userId);
        request.input('projId', mysql.Int, parseInt(projectId));
        request.input('url_of_submission', mysql.NVarChar, sasUrl);

        await request.query(query);
    
    } catch (err) {
      console.error("Error connecting to the database:", err);
    } finally {
   
      await mysql.close();
    }
}

//add all sas urls for a project into 
// async function insertAllSasUrls(userId, projectId) {
//     getSasUrls(projectId, userId)
//         .then(sasUrls => {
//             sasUrls.forEach(url => {
//                 insertSasUrl(userId, projectId, url); // Process each SAS URL as needed
//             });
            
//         })
//         .catch(error => {
//             console.error('Error retrieving SAS URLs:', error);
//             req.end()
//         });
// }

//FINAL METHOD TO SUBMIT PROOF
async function submitProof(filePath, projectId, userId) {
    uploadMediaToBlob(filePath, projectId, userId);
    hashed = hash(filePath);
    sasUrl = getSasUrls(projectId, userId, hashed);
    insertSasUrl(userId, projectId, sasUrl);
}


async function getUserProjectImages(userId, projectId) {
    try {
        await mysql.connect(config);

        // SQL query to retrieve URLs
        const query = `
            SELECT url_of_submission
            FROM submissions
            WHERE user_id = @userId AND proj_id = @projectId
        `;

        // Prepare and execute the query
        const request = new mysql.Request();
        request.input('userId', mysql.NVarChar, userId);
        request.input('projectId', mysql.Int, parseInt(projectId));
        const result = await request.query(query);

        const urls = result.recordset.map(row => row.url_of_submission);
        return urls; // Return array of URLs
        
    } catch (err) {
        console.error("Error retrieving user project images:", err);
        throw err;
    } finally {
        await mysql.close();
    }
}

async function getMediaFiles(userId, projectId) {
    try {
        // Get fresh SAS URLs for the files
        const freshUrls = await getUserProjectImages(userId, projectId);

        // Fetch each file using its SAS URL
        const filePromises = freshUrls.map(async (url) => {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            return {
                fileName: extractFileName(url), // Extract file name from URL for reference
                data: response.data // Binary data of the file
            };
        });

        const files = await Promise.all(filePromises);
        return files;

    } catch (error) {
        console.error("Error fetching media files:", error);
        throw error;
    }
}

function extractFileName(url) {
    const parts = url.split("/");
    return parts[parts.length - 1].split("?")[0];
}









// testing
// getSasUrls(projectId)
//     .then(sasUrls => {
//         sasUrls.forEach(url => {
//             insertSasUrl("-1", url); // Process each SAS URL as needed
//         });
        
//     })
//     .catch(error => {
//         console.error('Error retrieving SAS URLs:', error);
//         req.end()
//     });
