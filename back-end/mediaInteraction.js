//TODO: will eventually be in an api endpoint
//NOTE: project ids should be ints 
//TODO: need to change db it points to after we decide what each db is for
const { BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential } = require("@azure/storage-blob");
const fs = require("fs");
require('dotenv').config();
const mysql = require('mssql');
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;


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


async function uploadMediaToBlob(filePath, projectId) {
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

    const metadata = {
        project_id: projectId,
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
        console.log(`File '${blobName}' uploaded successfully with project_id '${projectId}'.`);
    } catch (error) {
        console.error("Error uploading file:", error.message);
    }
}

// testing
// const filePath = "back-end\\assets\\images\\dog.jpeg";
// const pId = "-1";
// uploadMediaToBlob(filePath, pId);



async function getSasUrls(projectId) {
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


            if (metadata.project_id && metadata.project_id === projectId) {

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
async function insertSasUrl(projectId, sasUrl) {
    try {
      await mysql.connect(config);
       console.log("Connected to the database!");

      const query = `
            INSERT INTO proofTrackDemo (file_url, project_id) 
            VALUES (@sasUrl, @projectId)`;

        const values = {
            sasUrl: sasUrl,
            projectId: parseInt(projectId)
        };

        const request = new mysql.Request();
        request.input('sasUrl', mysql.NVarChar, sasUrl);
        request.input('projectId', mysql.Int, parseInt(projectId));

        await request.query(query);
    
    } catch (err) {
      console.error("Error connecting to the database:", err);
    } finally {
   
      await mysql.close();
    }
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
