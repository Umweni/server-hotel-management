import multer from 'multer';
import path from 'path';

// Uses the operating system's default temporary folder to store files
export default multer({
    storage: multer.diskStorage({}), //Take the file and put it in the computer's temporary storage folder for now.
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname).toLowerCase();
        
        // List of allowed image extensions
        const allowedExtensions = [
            ".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"
        ];


        if (!allowedExtensions.includes(ext)) {
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    }
});
