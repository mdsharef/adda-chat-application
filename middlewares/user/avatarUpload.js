// internal imports
const uploader = require('../../utils/singleUploader')

const avatarUpload = (req, res, next) => {
    const allowed_file_types = /jpeg|jpg|png|gif|/
    const upload = uploader(
        "avatars",
        10485760,
        allowed_file_types,
        "Only image formats are allowed!"
    );

    // call the middleware function
    upload.any()(req, res, (err) => {
        if(err) {
            res.status(500).json({
                errors: {
                    avatar: {
                        msg: err.message,
                    }
                }
            })
        } else {
            next();
        }
    })
}

module.exports = avatarUpload