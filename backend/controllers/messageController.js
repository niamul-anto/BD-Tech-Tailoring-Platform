const Message = require("../models/Message");
const User = require("../models/User");
const Notification = require("../models/Notification");



// ==========================
// SEND MESSAGE
// ==========================

const sendMessage = async(req,res)=>{

try{


    const {

        receiverId,

        message

    } = req.body;



    // ==========================
    // VALIDATION
    // ==========================

    if(!receiverId || !message){

        return res.status(400).json({

            message:"Receiver and message are required"

        });

    }



    // Prevent sending message to yourself

    if(receiverId === req.user._id.toString()){

        return res.status(400).json({

            message:"You cannot send message to yourself"

        });

    }



    // Check receiver exists

    const receiver = await User.findById(
        receiverId
    );



    if(!receiver){

        return res.status(404).json({

            message:"Receiver not found"

        });

    }



    // ==========================
    // CUSTOMER <-> TAILOR ONLY
    // ==========================

    const validChat =

        (
            req.user.role === "customer"
            &&
            receiver.role === "tailor"
        )

        ||

        (
            req.user.role === "tailor"
            &&
            receiver.role === "customer"
        );



    if(!validChat){

        return res.status(403).json({

            message:"Chat allowed only between customer and tailor"

        });

    }



    // ==========================
    // SAVE MESSAGE
    // ==========================

    const newMessage = await Message.create({

        sender:req.user._id,

        receiver:receiverId,

        message

    });


    // ==========================
    // CREATE MESSAGE NOTIFICATION
    // ==========================

    const notification = await Notification.create({

        user:receiverId,

        message:`New message from ${req.user.name}`,

        type:"message"

    });

    // ==========================
    // REAL-TIME SOCKET DELIVERY
    // ==========================

    const io = req.app.get("io");


    if(io){

        io.to(
            `user_${receiverId}`
        ).emit(

            "receive_message",

            {

                _id:newMessage._id,

                sender:req.user._id,

                receiver:receiverId,

                message:newMessage.message,

                isRead:newMessage.isRead,

                createdAt:newMessage.createdAt

            }

        );


        io.to(
            `user_${receiverId}`
        ).emit(

            "receive_notification",

            {

                _id:notification._id,

                message:notification.message,

                type:notification.type,

                isRead:notification.isRead,

                createdAt:notification.createdAt

            }

        );

    }


    res.status(201).json({

        message:"Message sent successfully",

        data:newMessage

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
// GET CONVERSATION
// ==========================

const getConversation = async(req,res)=>{

try{


    const otherUserId = req.params.userId;



    const messages = await Message.find({

        $or:[

            {
                sender:req.user._id,
                receiver:otherUserId
            },

            {
                sender:otherUserId,
                receiver:req.user._id
            }

        ]

    })

    .populate(
        "sender",
        "name email role profileImage"
    )
    .populate(
        "receiver",
        "name email role profileImage"
    )
    
    .populate(
        "receiver",
        "name email role"
    )

    .sort({

        createdAt:1

    });



    res.status(200).json({

        messages

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
// MARK MESSAGES AS READ
// ==========================

const markMessagesAsRead = async(req,res)=>{

try{


    const otherUserId = req.params.userId;



    const result = await Message.updateMany(

        {

            sender:otherUserId,

            receiver:req.user._id,

            isRead:false

        },

        {

            $set:{

                isRead:true

            }

        }

    );



    res.status(200).json({

        message:"Messages marked as read",

        updatedCount:result.modifiedCount

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
// GET MY CONVERSATIONS
// ==========================

const getMyConversations = async(req,res)=>{

try{


    const myId = req.user._id;



    const messages = await Message.find({

        $or:[

            {
                sender:myId
            },

            {
                receiver:myId
            }

        ]

    })

    .populate(
        "sender",
        "name email role"
    )

    .populate(
        "receiver",
        "name email role"
    )

    .sort({

        createdAt:-1

    });



    const conversationMap = new Map();



    for(const msg of messages){


        // Find the other user

        const otherUser =

            msg.sender._id.toString() === myId.toString()

            ? msg.receiver

            : msg.sender;



        const otherUserId =
            otherUser._id.toString();



        // First message is latest because sorted newest first

        if(!conversationMap.has(otherUserId)){


            conversationMap.set(

                otherUserId,

                {

                    user:otherUser,

                    lastMessage:msg.message,

                    lastMessageTime:msg.createdAt,

                    unreadCount:0

                }

            );

        }



        // Count unread messages received by current user

        if(

            msg.receiver._id.toString() === myId.toString()

            &&

            msg.isRead === false

        ){


            const conversation =
                conversationMap.get(otherUserId);


            conversation.unreadCount += 1;

        }

    }



    const conversations =
        Array.from(
            conversationMap.values()
        );



    res.status(200).json({

        conversations

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

    sendMessage,

    getConversation,

    markMessagesAsRead,

    getMyConversations

};