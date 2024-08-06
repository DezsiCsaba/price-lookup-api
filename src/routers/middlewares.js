const multer = require("multer");
const upload = multer();

const middlewares = {
    uploadSingle(){
        return ()=>{
            upload.single('file')
        }
    }
}

module.exports = middlewares
