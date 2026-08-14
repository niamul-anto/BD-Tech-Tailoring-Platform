import {
    useEffect,
    useState
} from "react";

import { useSelector } from "react-redux";

import api from "../api/axios";

import socket from "../socket/socket";


const useNotifications = () => {

    const user = useSelector(
        (state) => state.auth.user
    );


    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [socketConnected, setSocketConnected] =
        useState(socket.connected);



    // ==========================
    // CURRENT USER ID
    // ==========================

    const currentUserId =
        user?.id ||
        user?._id;



    // ==========================
    // LOAD NOTIFICATIONS
    // ==========================

    const loadNotifications = async () => {

        try {

            const response = await api.get(
                "/notifications"
            );


            setNotifications(
                response.data.notifications || []
            );

        }
        catch(error){

            console.log(
                "Notification load error:",
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

            setNotifications([]);

            setLoading(false);

            return;

        }


        loadNotifications();

    }, [currentUserId]);



    // ==========================
    // SOCKET NOTIFICATIONS
    // ==========================

    useEffect(() => {

        const myUserId =
            user?.id ||
            user?._id;


        if(!myUserId){

            return;

        }



        // ==========================
        // CONNECT
        // ==========================

        const handleConnect = () => {

            setSocketConnected(true);


            socket.emit(
                "join_user_room",
                myUserId
            );


            console.log(
                "Notification room joined:",
                `user_${myUserId}`
            );

        };



        // ==========================
        // DISCONNECT
        // ==========================

        const handleDisconnect = () => {

            setSocketConnected(false);

        };



        // ==========================
        // RECEIVE NOTIFICATION
        // ==========================

        const handleReceiveNotification = (
            notification
        ) => {

            console.log(
                "Global notification received:",
                notification
            );


            // ==========================
            // FIND NOTIFICATION OWNER
            // ==========================

            const notificationUserId =

                notification?.user?._id ||

                notification?.user?.id ||

                notification?.user ||

                notification?.receiver?._id ||

                notification?.receiver?.id ||

                notification?.receiver ||

                notification?.recipient?._id ||

                notification?.recipient?.id ||

                notification?.recipient;



            // ==========================
            // IGNORE OTHER USER'S
            // NOTIFICATIONS
            // ==========================

            if(
                notificationUserId &&
                String(notificationUserId) !==
                String(myUserId)
            ){

                console.log(
                    "Ignored notification for another user:",
                    notificationUserId
                );


                return;

            }



            // ==========================
            // EXTRA SENDER PROTECTION
            // ==========================

            const senderId =

                notification?.sender?._id ||

                notification?.sender?.id ||

                notification?.sender;



            if(
                senderId &&
                String(senderId) ===
                String(myUserId)
            ){

                console.log(
                    "Ignored own sent notification"
                );


                return;

            }



            // ==========================
            // ADD NOTIFICATION
            // ==========================

            setNotifications(
                (previous) => {

                    const alreadyExists =
                        previous.some(
                            (item) =>
                                String(item._id) ===
                                String(notification._id)
                        );


                    if(alreadyExists){

                        return previous;

                    }


                    return [

                        notification,

                        ...previous

                    ];

                }
            );

        };



        socket.on(
            "connect",
            handleConnect
        );


        socket.on(
            "disconnect",
            handleDisconnect
        );


        socket.on(
            "receive_notification",
            handleReceiveNotification
        );



        if(!socket.connected){

            socket.connect();

        }
        else{

            handleConnect();

        }



        return () => {

            socket.off(
                "connect",
                handleConnect
            );


            socket.off(
                "disconnect",
                handleDisconnect
            );


            socket.off(
                "receive_notification",
                handleReceiveNotification
            );

        };


    }, [
        user?.id,
        user?._id
    ]);



    // ==========================
    // MARK AS READ
    // ==========================

    const markNotificationAsRead = async (
        notificationId
    ) => {

        try {

            const response = await api.put(
                `/notifications/${notificationId}/read`
            );


            setNotifications(
                (previous) =>

                    previous.map(
                        (notification) =>

                            notification._id ===
                            notificationId

                            ? response.data.notification

                            : notification

                    )
            );


            return response.data.notification;

        }
        catch(error){

            console.log(
                "Mark notification read error:",
                error
            );


            throw error;

        }

    };



    // ==========================
    // UNREAD COUNT
    // ==========================

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.isRead
        ).length;



    return {

        notifications,

        setNotifications,

        unreadCount,

        loading,

        socketConnected,

        loadNotifications,

        markNotificationAsRead

    };

};


export default useNotifications;