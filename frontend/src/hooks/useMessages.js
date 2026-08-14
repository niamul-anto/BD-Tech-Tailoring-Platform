import {
    useEffect,
    useState
} from "react";

import { useSelector } from "react-redux";

import api from "../api/axios";

import socket from "../socket/socket";


const useMessages = () => {

    const user = useSelector(
        (state) => state.auth.user
    );


    const [conversations, setConversations] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    const currentUserId =
        user?.id ||
        user?._id;



    // ==========================
    // LOAD CONVERSATIONS
    // ==========================

    const loadConversations = async () => {

        try {

            const response = await api.get(
                "/messages/conversations"
            );


            setConversations(
                response.data.conversations || []
            );

        }
        catch(error){

            console.log(
                "Message conversations load error:",
                error
            );

        }
        finally{

            setLoading(false);

        }

    };



    // ==========================
    // INITIAL LOAD
    // ==========================

    useEffect(() => {

        if(!currentUserId){

            setConversations([]);

            setLoading(false);

            return;

        }


        loadConversations();

    }, [currentUserId]);



    // ==========================
    // SOCKET MESSAGE
    // ==========================

    useEffect(() => {

        if(!currentUserId){

            return;

        }


        const handleConnect = () => {

            socket.emit(
                "join_user_room",
                currentUserId
            );

        };


        const handleReceiveMessage = (
            incomingMessage
        ) => {

            const receiverId =
                incomingMessage?.receiver?._id ||
                incomingMessage?.receiver?.id ||
                incomingMessage?.receiver;


            if(
                receiverId &&
                String(receiverId) !==
                String(currentUserId)
            ){

                return;

            }


            // Reload only when new message arrives
            loadConversations();

        };


        socket.on(
            "connect",
            handleConnect
        );


        socket.on(
            "receive_message",
            handleReceiveMessage
        );


        if(socket.connected){

            handleConnect();

        }
        else{

            socket.connect();

        }


        return () => {

            socket.off(
                "connect",
                handleConnect
            );


            socket.off(
                "receive_message",
                handleReceiveMessage
            );

        };


    }, [currentUserId]);



    // ==========================
    // TOTAL UNREAD
    // ==========================

    const unreadCount =
        conversations.reduce(
            (
                total,
                conversation
            ) =>

                total +
                (
                    conversation.unreadCount ||
                    0
                ),

            0
        );



    return {

        conversations,

        unreadCount,

        loading,

        loadConversations

    };

};


export default useMessages;