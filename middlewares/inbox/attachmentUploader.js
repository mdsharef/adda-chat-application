const uploader = require('../../utils/multipleUploader');

const attachmentUploader = (req, res, next) => {
    const allowed_file_types = /jpeg|jpg|png|gif|avi|webm|mp4|mov|mp3|wav|video|audio|pdf/
    const upload = uploader(
        "attachments",
        10485760,
        allowed_file_types,
        2,
        "Only image, gif, audio and video formats are allowed!"
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
            console.log(err)
        } else {
            next();
        }
    })
}

module.exports = attachmentUploader