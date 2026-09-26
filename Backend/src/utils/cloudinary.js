import { configDotenv } from 'dotenv'
configDotenv({path: "./.env"})
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


import path from 'path';

const uploadOnCloudinary = async(localPath) => {
    try {
        if(!localPath) return null;

        const isDoc = localPath.match(/\.(pdf|doc|docx|txt)$/i);
        const fileName = path.basename(localPath);
        const uploadDir = './public/uploads';

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Keep local static copy so it always opens reliably
        const localDest = path.join(uploadDir, fileName);
        if (fs.existsSync(localPath)) {
            fs.copyFileSync(localPath, localDest);
        }

        let response = null;
        try {
            response = await cloudinary.uploader.upload(localPath, {
                resource_type: isDoc ? 'raw' : 'auto',
                access_mode: 'public',
            });
        } catch (cErr) {
            console.warn('Cloudinary upload warning (using local fallback):', cErr.message);
        }

        if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
        }

        const localUrl = `http://localhost:8000/uploads/${fileName}`;

        if (response && (response.secure_url || response.url)) {
            return {
                ...response,
                secure_url: isDoc ? (response.secure_url || response.url) : (response.secure_url || response.url),
                url: response.secure_url || response.url,
                localUrl
            };
        }

        return {
            secure_url: localUrl,
            url: localUrl,
            localUrl
        };

    } catch (error) {
        console.error('File upload error:', error);
        if (localPath && fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
        }
        return null;
    }
}

export { uploadOnCloudinary }