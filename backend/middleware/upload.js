const multer = require("multer");


const storage = multer.memoryStorage();



// ==========================
// FILE FILTER
// IMAGE FILES ONLY
// ==========================

const fileFilter = (
    req,
    file,
    cb
) => {


    const allowedTypes = [

        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"

    ];


    if(
        allowedTypes.includes(
            file.mimetype
        )
    ){

        cb(
            null,
            true
        );

    }
    else{

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            ),
            false
        );

    }


};



// ==========================
// MULTER CONFIGURATION
// ==========================

const upload = multer({

    storage:storage,


    fileFilter:fileFilter,


    limits:{

        // Maximum 5 MB per image
        fileSize:
            5 * 1024 * 1024

    }

});


module.exports = upload;