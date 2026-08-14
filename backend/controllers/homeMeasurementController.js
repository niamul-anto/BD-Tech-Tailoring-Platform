const HomeMeasurementRequest =
require("../models/HomeMeasurementRequest");

const TailorProfile =
require("../models/TailorProfile");

const Notification =
require("../models/Notification");


// ==========================
// CREATE REQUEST
// CUSTOMER
// ==========================

const createHomeMeasurementRequest =
async(req,res)=>{

try{

    const {
        tailorId,
        address,
        preferredDate,
        preferredTime,
        note
    } = req.body;


    if(
        !tailorId ||
        !address ||
        !preferredDate ||
        !preferredTime
    ){

        return res.status(400).json({

            message:"Required information missing"

        });

    }


    const tailorProfile =
    await TailorProfile.findOne({

        user:tailorId,

        verificationStatus:"approved"

    });


    if(!tailorProfile){

        return res.status(404).json({

            message:"Tailor not found"

        });

    }


    if(
        tailorProfile.availabilityStatus !==
        "available"
    ){

        return res.status(400).json({

            message:
            "Tailor is currently not available for home measurement"

        });

    }


    const existingRequest =
    await HomeMeasurementRequest.findOne({

        customer:req.user._id,

        tailor:tailorId,

        status:{
            $in:[
                "pending",
                "accepted"
            ]
        }

    });


    if(existingRequest){

        return res.status(400).json({

            message:
            "You already have an active home measurement request with this tailor"

        });

    }


    const request =
    await HomeMeasurementRequest.create({

        customer:req.user._id,

        tailor:tailorId,

        address,

        preferredDate,

        preferredTime,

        note

    });


    await Notification.create({

        user:tailorId,

        message:
        "You received a home measurement request",

        type:"system"

    });


    res.status(201).json({

        message:
        "Home measurement request sent successfully",

        request

    });

}
catch(error){

    console.log(error);


    res.status(500).json({

        message:"Server error"

    });

}

};


// ==========================
// GET CUSTOMER REQUESTS
// ==========================

const getCustomerRequests =
async(req,res)=>{

try{

    const requests =
    await HomeMeasurementRequest.find({

        customer:req.user._id

    })

    .populate(
        "tailor",
        "name email phone profileImage"
    )

    .sort({
        createdAt:-1
    });


    res.status(200).json({

        requests

    });

}
catch(error){

    console.log(error);


    res.status(500).json({

        message:"Server error"

    });

}

};


// ==========================
// GET TAILOR REQUESTS
// ==========================

const getTailorRequests =
async(req,res)=>{

try{

    const requests =
    await HomeMeasurementRequest.find({

        tailor:req.user._id

    })

    .populate(
        "customer",
        "name email phone profileImage"
    )

    .sort({
        createdAt:-1
    });


    res.status(200).json({

        requests

    });

}
catch(error){

    console.log(error);


    res.status(500).json({

        message:"Server error"

    });

}

};


// ==========================
// UPDATE REQUEST STATUS
// TAILOR
// ==========================

const updateRequestStatus =
async(req,res)=>{

try{

    const {
        status
    } = req.body;


    const allowedStatus = [
        "accepted",
        "rejected",
        "completed"
    ];


    if(
        !allowedStatus.includes(status)
    ){

        return res.status(400).json({

            message:"Invalid request status"

        });

    }


    const request =
    await HomeMeasurementRequest.findOne({

        _id:req.params.id,

        tailor:req.user._id

    });


    if(!request){

        return res.status(404).json({

            message:"Request not found"

        });

    }


    if(
        request.status === "rejected" ||
        request.status === "completed" ||
        request.status === "cancelled"
    ){

        return res.status(400).json({

            message:
            "This request cannot be updated"

        });

    }


    if(
        request.status === "pending" &&
        status === "completed"
    ){

        return res.status(400).json({

            message:
            "Accept the request before marking it completed"

        });

    }


    request.status = status;


    await request.save();


    let message = "";


    if(status === "accepted"){

        message =
        "Your home measurement request was accepted";

    }
    else if(status === "rejected"){

        message =
        "Your home measurement request was rejected";

    }
    else if(status === "completed"){

        message =
        "Your home measurement visit was completed";

    }


    if(message){

        await Notification.create({

            user:request.customer,

            message,

            type:"system"

        });

    }


    res.status(200).json({

        message:
        "Request status updated successfully",

        request

    });

}
catch(error){

    console.log(error);


    res.status(500).json({

        message:"Server error"

    });

}

};


// ==========================
// CANCEL REQUEST
// CUSTOMER
// ==========================

const cancelHomeMeasurementRequest =
async(req,res)=>{

try{

    const request =
    await HomeMeasurementRequest.findOne({

        _id:req.params.id,

        customer:req.user._id

    });


    if(!request){

        return res.status(404).json({

            message:"Request not found"

        });

    }


    if(request.status !== "pending"){

        return res.status(400).json({

            message:
            "Only pending requests can be cancelled"

        });

    }


    request.status =
        "cancelled";


    await request.save();


    await Notification.create({

        user:request.tailor,

        message:
        "A home measurement request was cancelled by the customer",

        type:"system"

    });


    res.status(200).json({

        message:
        "Request cancelled successfully",

        request

    });

}
catch(error){

    console.log(error);


    res.status(500).json({

        message:"Server error"

    });

}

};


module.exports = {

    createHomeMeasurementRequest,

    getCustomerRequests,

    getTailorRequests,

    updateRequestStatus,

    cancelHomeMeasurementRequest

};