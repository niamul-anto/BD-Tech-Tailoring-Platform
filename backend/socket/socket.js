// ==========================
// SOCKET.IO CONFIGURATION
// ==========================

const configureSocket = (io) => {


    io.on("connection", (socket)=>{


        console.log(
            "Socket user connected:",
            socket.id
        );


        // ==========================
        // CURRENT USER ROOM
        // ==========================

        socket.currentUserRoom = null;



        // ==========================
        // JOIN USER ROOM
        // ==========================

        socket.on(
            "join_user_room",
            async(userId)=>{


                if(!userId){

                    return;

                }


                const roomName =
                    `user_${userId}`;



                // ==========================
                // LEAVE PREVIOUS USER ROOM
                // ==========================

                if(
                    socket.currentUserRoom &&
                    socket.currentUserRoom !== roomName
                ){

                    await socket.leave(
                        socket.currentUserRoom
                    );


                    console.log(

                        `Socket ${socket.id} left room ${socket.currentUserRoom}`

                    );

                }



                // ==========================
                // JOIN NEW USER ROOM
                // ==========================

                await socket.join(
                    roomName
                );


                socket.currentUserRoom =
                    roomName;


                console.log(

                    `User ${userId} joined room ${roomName}`

                );


            }
        );



        // ==========================
        // LEAVE USER ROOM
        // ==========================

        socket.on(
            "leave_user_room",
            async(userId)=>{


                if(!userId){

                    return;

                }


                const roomName =
                    `user_${userId}`;


                await socket.leave(
                    roomName
                );


                if(
                    socket.currentUserRoom ===
                    roomName
                ){

                    socket.currentUserRoom =
                        null;

                }


                console.log(

                    `User ${userId} left room ${roomName}`

                );


            }
        );



        // ==========================
        // DISCONNECT
        // ==========================

        socket.on(
            "disconnect",
            ()=>{


                console.log(
                    "Socket user disconnected:",
                    socket.id
                );


            }
        );


    });


};


module.exports = configureSocket;