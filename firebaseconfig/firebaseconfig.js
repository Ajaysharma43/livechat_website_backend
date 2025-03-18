// filepath: c:\Users\ACER\Desktop\ChatBackend\firebaseconfig\firebaseconfig.js
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const serviceAccount = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_BUCKET_NAME // Ensure the environment variable is set correctly
});

const bucket = admin.storage().bucket();

export default bucket;