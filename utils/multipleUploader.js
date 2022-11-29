// external imports
const multer = require('multer');
const path = require('path');
const createError = require('http-errors');

// creating uploader function
const uploader = (subfolder_path, max_file_size, allowed_file_types, max_files_num, error_msg) => {
    const Upload_Folder = `${__dirname}/../public/uploads/${subfolder_path}`;

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, Upload_Folder)
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
        }
    });

    const upload = multer({
        storage: storage,
        limits: {
            fileSize: max_file_size
        },
        fileFilter: (req, file, cb) => {
            if(req.files.length > max_files_num) {
                cb(createError(`Maximum ${max_files_num} files are allowed to upload!`));
            } else {
                const types = allowed_file_types;
                const extName = types.test(path.extname(file.originalname).toLocaleLowerCase());
                const mimeType = types.test(file.mimetype);
                
                if (extName && mimeType) {
                    cb(null, true);
                } else{
                    cb(createError(error_msg));
                }
            }
        }
    });

    return upload;
}

module.exports = uploader;