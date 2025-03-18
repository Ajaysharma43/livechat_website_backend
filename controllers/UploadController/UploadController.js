import multer from 'multer';
import path from 'path';
import bucket from '../../firebaseconfig/firebaseconfig.js'; // Adjust as needed

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const Uploadfile = (req, res, next) => {
    upload.array('files', 10)(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        try {
            const uploadPromises = files.map(file => {
                const folderName = 'Images'; 
                const fileName = `${folderName}/${Date.now()}_${file.originalname}`;
                const blob = bucket.file(fileName);
                const blobStream = blob.createWriteStream({
                    metadata: { contentType: file.mimetype },
                });

                return new Promise((resolve, reject) => {
                    blobStream.on('error', (error) => reject(error));
                    blobStream.on('finish', async () => {
                        try {
                            await blob.makePublic(); // Ensure file is publicly accessible
                            resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
                        } catch (error) {
                            reject(`Failed to make file public: ${error.message}`);
                        }
                    });
                    blobStream.end(file.buffer);
                });
            });

            const fileUrls = await Promise.all(uploadPromises);
            res.json({ message: "File(s) uploaded successfully", files: fileUrls });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};

export const CheckUpload = async(req, res, next) => {
    try {
        const folderName = req.query.folderName;
        const [files] = await bucket.getFiles({ prefix: `${folderName}/` });

        if (!files.length) {
            return res.status(404).json({ message: "No files found in this folder" });
        }

        const fileUrls = await Promise.all(
            files.map(async (file) => {
                try {
                    await file.makePublic(); // Ensure file is publicly accessible
                    return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                } catch (error) {
                    return `Error making file public: ${error.message}`;
                }
            })
        );

        res.json({ message: "Files retrieved successfully", files: fileUrls });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
