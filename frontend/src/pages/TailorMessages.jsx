import {
    useEffect,
    useRef,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import api from "../api/axios";

import useLogout from "../hooks/useLogout";

import useNotifications from "../hooks/useNotifications";

import socket from "../socket/socket";



import "./TailorMessages.css";


const TailorMessages = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();


    const user = useSelector(
        (state) => state.auth.user
    );


    // ==========================
    // GLOBAL NOTIFICATIONS
    // ==========================

    const {
        unreadCount: notificationUnreadCount
    } = useNotifications();


    // ==========================
    // STATE
    // ==========================

    const [conversations, setConversations] =
        useState([]);

    const [selectedUser, setSelectedUser] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const [messageText, setMessageText] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [chatLoading, setChatLoading] =
        useState(false);

    const [sending, setSending] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================
    // REFS
    // ==========================

    const chatBottomRef =
        useRef(null);


    const selectedUserRef =
        useRef(null);



    // ==========================
    // KEEP SELECTED USER REF
    // UPDATED
    // ==========================

    useEffect(() => {

        selectedUserRef.current =
            selectedUser;

    }, [selectedUser]);



    // ==========================
    // HELPER
    // ==========================

    const getUserId = (value) => {

        if(!value){

            return "";

        }


        if(typeof value === "string"){

            return value;

        }


        return (
            value._id ||
            value.id ||
            ""
        );

    };



    // ==========================
    // CURRENT USER ID
    // ==========================

    const myUserId =
        user?.id ||
        user?._id;



    // ==========================
    // SCROLL TO BOTTOM
    // ==========================

    const scrollToBottom = () => {

        requestAnimationFrame(() => {

            chatBottomRef.current
                ?.scrollIntoView({

                    behavior:"smooth"

                });

        });

    };



    // ==========================
    // LOAD CONVERSATIONS
    // ==========================

    const loadConversations = async () => {

        try {

            setError("");


            const response =
                await api.get(
                    "/messages/conversations"
                );


            const conversationData =
                response.data.conversations ||
                [];


            setConversations(
                conversationData
            );


            return conversationData;

        }
        catch(error){

            console.log(error);


            setError(
                error.response?.data?.message ||
                "Failed to load conversations"
            );


            return [];

        }

    };



    // ==========================
    // MARK CONVERSATION
    // LOCALLY AS READ
    // ==========================

    const markConversationLocalRead = (
        otherUserId
    ) => {

        setConversations(
            (previous) =>

                previous.map(
                    (conversation) =>

                        getUserId(
                            conversation.user
                        ) === otherUserId

                        ? {

                            ...conversation,

                            unreadCount:0

                        }

                        : conversation

                )
        );

    };



    // ==========================
    // OPEN CONVERSATION
    // ==========================

    const openConversation = async (
        otherUser
    ) => {

        const otherUserId =
            getUserId(
                otherUser
            );


        if(!otherUserId){

            return;

        }


        try {

            // Immediately change selected user
            // so UI reacts without waiting

            setSelectedUser(
                otherUser
            );


            selectedUserRef.current =
                otherUser;


            setChatLoading(true);

            setError("");


            // ==========================
            // LOAD MESSAGES
            // ==========================

            const response =
                await api.get(
                    `/messages/conversation/${otherUserId}`
                );


            setMessages(
                response.data.messages ||
                []
            );


            // ==========================
            // STOP CHAT LOADING NOW
            // DO NOT WAIT FOR MARK READ
            // ==========================

            setChatLoading(false);


            markConversationLocalRead(
                otherUserId
            );


            scrollToBottom();



            // ==========================
            // MARK READ IN BACKGROUND
            // ==========================

            api.put(
                `/messages/conversation/${otherUserId}/read`
            )
            .catch(
                (error) => {

                    console.log(
                        "Mark read error:",
                        error
                    );

                }
            );

        }
        catch(error){

            console.log(error);


            setError(
                error.response?.data?.message ||
                "Failed to load conversation"
            );


            setChatLoading(false);

        }

    };



    // ==========================
    // INITIAL LOAD
    // ==========================

    useEffect(() => {

        const initializeMessages =
            async () => {

                try {

                    setLoading(true);


                    const conversationData =
                        await loadConversations();


                    // ==========================
                    // OPEN FIRST CONVERSATION
                    // ==========================

                    if(
                        conversationData.length >
                        0
                    ){

                        await openConversation(
                            conversationData[0]
                                .user
                        );

                    }

                }
                finally{

                    setLoading(false);

                }

            };


        initializeMessages();

    }, []);



    // ==========================
    // UPDATE CONVERSATION
    // AFTER SENT MESSAGE
    // ==========================

    const updateConversationAfterSend = (
        receiverId,
        text,
        createdAt
    ) => {

        setConversations(
            (previous) => {

                const updated =
                    previous.map(
                        (conversation) => {

                            const conversationUserId =
                                getUserId(
                                    conversation.user
                                );


                            if(
                                conversationUserId ===
                                receiverId
                            ){

                                return {

                                    ...conversation,

                                    lastMessage:
                                        text,

                                    lastMessageTime:
                                        createdAt,

                                    unreadCount:
                                        conversation
                                            .unreadCount ||
                                        0

                                };

                            }


                            return conversation;

                        }
                    );


                // ==========================
                // MOVE ACTIVE CONVERSATION
                // TO TOP
                // ==========================

                const activeIndex =
                    updated.findIndex(
                        (conversation) =>
                            getUserId(
                                conversation.user
                            ) === receiverId
                    );


                if(activeIndex > 0){

                    const activeConversation =
                        updated[
                            activeIndex
                        ];


                    return [

                        activeConversation,

                        ...updated.filter(
                            (_,index) =>
                                index !==
                                activeIndex
                        )

                    ];

                }


                return updated;

            }
        );

    };



    // ==========================
    // UPDATE CONVERSATION
    // AFTER RECEIVED MESSAGE
    // ==========================

    const updateConversationAfterReceive = (
        incomingMessage
    ) => {

        const senderId =
            getUserId(
                incomingMessage.sender
            );


        const currentSelectedUserId =
            getUserId(
                selectedUserRef.current
            );


        setConversations(
            (previous) => {

                let found = false;


                const updated =
                    previous.map(
                        (conversation) => {

                            const conversationUserId =
                                getUserId(
                                    conversation.user
                                );


                            if(
                                conversationUserId ===
                                senderId
                            ){

                                found = true;


                                return {

                                    ...conversation,

                                    lastMessage:
                                        incomingMessage
                                            .message,

                                    lastMessageTime:
                                        incomingMessage
                                            .createdAt,

                                    unreadCount:
                                        currentSelectedUserId ===
                                        senderId

                                        ? 0

                                        : (
                                            conversation
                                                .unreadCount ||
                                            0
                                        ) + 1

                                };

                            }


                            return conversation;

                        }
                    );


                // ==========================
                // EXISTING CONVERSATION
                // MOVE TO TOP
                // ==========================

                if(found){

                    const activeIndex =
                        updated.findIndex(
                            (conversation) =>
                                getUserId(
                                    conversation.user
                                ) === senderId
                        );


                    if(activeIndex > 0){

                        const active =
                            updated[
                                activeIndex
                            ];


                        return [

                            active,

                            ...updated.filter(
                                (_,index) =>
                                    index !==
                                    activeIndex
                            )

                        ];

                    }


                    return updated;

                }


                // ==========================
                // IF NEW CHAT APPEARS
                // FETCH CONVERSATION LIST
                // ONLY THEN
                // ==========================

                loadConversations();


                return previous;

            }
        );

    };



    // ==========================
    // SOCKET CONNECTION
    // ==========================

    useEffect(() => {

        if(!myUserId){

            console.log(
                "Socket: User ID not found"
            );

            return;

        }



        // ==========================
        // ON CONNECT
        // ==========================

        const handleConnect = () => {

            console.log(
                "Socket connected:",
                socket.id
            );


            socket.emit(
                "join_user_room",
                myUserId
            );


            console.log(
                "Joining room:",
                `user_${myUserId}`
            );

        };



        // ==========================
        // CONNECTION ERROR
        // ==========================

        const handleConnectError = (
            error
        ) => {

            console.log(
                "Socket connection error:",
                error.message
            );

        };



        // ==========================
        // RECEIVE MESSAGE
        // ==========================

        const handleReceiveMessage = (
            incomingMessage
        ) => {

            console.log(
                "Real-time message received:",
                incomingMessage
            );


            const receiverId =
                getUserId(
                    incomingMessage.receiver
                );


            // ==========================
            // EXTRA PROTECTION
            // ONLY CURRENT USER
            // ==========================

            if(
                receiverId &&
                String(receiverId) !==
                String(myUserId)
            ){

                return;

            }


            const senderId =
                getUserId(
                    incomingMessage.sender
                );


            const selectedUserId =
                getUserId(
                    selectedUserRef.current
                );



            // ==========================
            // CURRENT CHAT IS OPEN
            // ==========================

            if(
                selectedUserId &&
                senderId ===
                selectedUserId
            ){

                setMessages(
                    (previous) => {

                        const alreadyExists =
                            previous.some(
                                (message) =>
                                    String(
                                        message._id
                                    ) ===
                                    String(
                                        incomingMessage._id
                                    )
                            );


                        if(alreadyExists){

                            return previous;

                        }


                        return [

                            ...previous,

                            incomingMessage

                        ];

                    }
                );


                // ==========================
                // MARK READ IN BACKGROUND
                // ==========================

                api.put(
                    `/messages/conversation/${senderId}/read`
                )
                .catch(
                    (error) => {

                        console.log(
                            "Mark read error:",
                            error
                        );

                    }
                );


                scrollToBottom();

            }



            // ==========================
            // UPDATE LEFT CONVERSATION
            // WITHOUT API RELOAD
            // ==========================

            updateConversationAfterReceive(
                incomingMessage
            );

        };



        // ==========================
        // SOCKET EVENTS
        // ==========================

        socket.on(
            "connect",
            handleConnect
        );


        socket.on(
            "connect_error",
            handleConnectError
        );


        socket.on(
            "receive_message",
            handleReceiveMessage
        );



        // ==========================
        // CONNECT
        // ==========================

        if(!socket.connected){

            socket.connect();

        }
        else{

            handleConnect();

        }



        // ==========================
        // CLEANUP
        // ==========================

        return () => {

            socket.off(
                "connect",
                handleConnect
            );


            socket.off(
                "connect_error",
                handleConnectError
            );


            socket.off(
                "receive_message",
                handleReceiveMessage
            );

        };


    }, [
        myUserId
    ]);



    // ==========================
    // SEND MESSAGE
    // ==========================

    const handleSendMessage = async (
        e
    ) => {

        e.preventDefault();


        const receiverId =
            getUserId(
                selectedUser
            );


        const trimmedMessage =
            messageText.trim();


        if(
            !receiverId ||
            !trimmedMessage ||
            sending
        ){

            return;

        }



        // ==========================
        // OPTIMISTIC MESSAGE
        // ==========================

        const tempId =
            `temp-${Date.now()}-${Math.random()}`;


        const optimisticMessage = {

            _id:tempId,

            sender:{

                _id:
                    myUserId,

                name:
                    user?.name,

                email:
                    user?.email,

                role:
                    user?.role

            },

            receiver:
                selectedUser,

            message:
                trimmedMessage,

            isRead:false,

            createdAt:
                new Date()
                    .toISOString(),

            pending:true

        };



        // ==========================
        // SHOW MESSAGE IMMEDIATELY
        // ==========================

        setMessages(
            (previous) => [

                ...previous,

                optimisticMessage

            ]
        );


        setMessageText("");


        updateConversationAfterSend(
            receiverId,
            trimmedMessage,
            optimisticMessage.createdAt
        );


        scrollToBottom();


        try {

            setSending(true);


            const response =
                await api.post(
                    "/messages/send",
                    {

                        receiverId,

                        message:
                            trimmedMessage

                    }
                );


            const sentMessage = {

                ...response.data.data,

                sender:{

                    _id:
                        myUserId,

                    name:
                        user?.name,

                    email:
                        user?.email,

                    role:
                        user?.role

                },

                receiver:
                    selectedUser,

                pending:false

            };



            // ==========================
            // REPLACE TEMP MESSAGE
            // WITH DATABASE MESSAGE
            // ==========================

            setMessages(
                (previous) =>

                    previous.map(
                        (message) =>

                            message._id ===
                            tempId

                            ? sentMessage

                            : message

                    )
            );


            // Update exact server timestamp

            updateConversationAfterSend(
                receiverId,
                trimmedMessage,
                sentMessage.createdAt
            );


            scrollToBottom();

        }
        catch(error){

            console.log(error);


            // ==========================
            // REMOVE FAILED TEMP MESSAGE
            // ==========================

            setMessages(
                (previous) =>

                    previous.filter(
                        (message) =>
                            message._id !==
                            tempId
                    )
            );


            // Put text back into input

            setMessageText(
                trimmedMessage
            );


            alert(
                error.response?.data?.message ||
                "Failed to send message"
            );

        }
        finally{

            setSending(false);

        }

    };



    // ==========================
    // FORMAT TIME
    // ==========================

    const formatTime = (date) => {

        if(!date){

            return "";

        }


        return new Date(
            date
        ).toLocaleString();

    };



    // ==========================
    // TOTAL UNREAD
    // ==========================

    const totalUnread =
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



    return (

        <div className="tailor-messages-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="tailor-messages-sidebar">


                <div className="tailor-messages-logo">

                    BD Tailoring

                </div>


                <nav>


                    <button
                        onClick={() =>
                            navigate("/tailor")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/tailor/profile"
                            )
                        }
                    >
                        My Profile
                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/tailor/gigs"
                            )
                        }
                    >
                        My Gigs
                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/tailor/orders"
                            )
                        }
                    >
                        Orders
                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/tailor/home-measurements"
                            )
                        }
                    >
                        Home Measurement
                    </button>


                    <button
                        className="active"
                        onClick={() =>
                            navigate(
                                "/tailor/messages"
                            )
                        }
                    >

                        Messages


                        {
                            totalUnread > 0
                            && (

                                <span className="message-nav-badge">

                                    {totalUnread}

                                </span>

                            )
                        }

                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/tailor/reviews"
                            )
                        }
                    >
                        Reviews
                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/tailor/notifications"
                            )
                        }
                    >

                        Notifications


                        {
                            notificationUnreadCount >
                            0
                            && (

                                <span className="notification-nav-badge">

                                    {
                                        notificationUnreadCount
                                    }

                                </span>

                            )
                        }

                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/tailor/measurement"
                            )
                        }
                    >
                        AI Measurement
                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/tailor/delivery"
                            )
                        }
                    >
                        Delivery
                    </button>


                </nav>



                <div className="tailor-messages-sidebar-bottom">

                    <button
                        onClick={
                            handleLogout
                        }
                    >
                        Logout
                    </button>

                </div>


            </aside>





            {/* ==========================
                MAIN
            ========================== */}

            <main className="tailor-messages-main">


                {/* ==========================
                    HEADER
                ========================== */}

                <div className="tailor-messages-header">


                    <div>

                        <h1>
                            Messages
                        </h1>

                        <p>
                            Real-time customer communication
                        </p>

                    </div>


                    <div
                        className={
                            socket.connected
                            ?
                            "socket-status connected"
                            :
                            "socket-status disconnected"
                        }
                    >

                        {
                            socket.connected
                            ?
                            "Live"
                            :
                            "Connecting..."
                        }

                    </div>


                </div>



                {/* ==========================
                    ERROR
                ========================== */}

                {
                    error
                    && (

                        <div className="tailor-messages-error">

                            {error}

                        </div>

                    )
                }



                {/* ==========================
                    LOADING
                ========================== */}

                {
                    loading
                    ? (

                        <div className="tailor-messages-state">

                            Loading messages...

                        </div>

                    )
                    : (

                        <div className="messages-layout">


                            {/* ==========================
                                CONVERSATIONS
                            ========================== */}

                            <div className="conversation-panel">


                                <div className="conversation-panel-header">


                                    <div>

                                        <h2>
                                            Conversations
                                        </h2>

                                        <span>
                                            {conversations.length} chats
                                        </span>

                                    </div>


                                </div>



                                <div className="conversation-list">


                                    {
                                        conversations.map(
                                            (
                                                conversation
                                            ) => {

                                                const conversationUser =
                                                    conversation.user;


                                                const conversationUserId =
                                                    getUserId(
                                                        conversationUser
                                                    );


                                                const selectedUserId =
                                                    getUserId(
                                                        selectedUser
                                                    );


                                                const isSelected =
                                                    conversationUserId ===
                                                    selectedUserId;


                                                return (

                                                    <button
                                                        key={
                                                            conversationUserId
                                                        }
                                                        className={
                                                            isSelected
                                                            ?
                                                            "conversation-item active"
                                                            :
                                                            "conversation-item"
                                                        }
                                                        onClick={() =>
                                                            openConversation(
                                                                conversationUser
                                                            )
                                                        }
                                                    >


                                                        <div className="conversation-avatar">

                                                            {
                                                                conversationUser
                                                                    ?.name
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase()
                                                                ||
                                                                "C"
                                                            }

                                                        </div>



                                                        <div className="conversation-info">


                                                            <div className="conversation-name-row">


                                                                <strong>

                                                                    {
                                                                        conversationUser
                                                                            ?.name ||
                                                                        "Customer"
                                                                    }

                                                                </strong>


                                                                {
                                                                    conversation.unreadCount >
                                                                    0
                                                                    && (

                                                                        <span className="conversation-unread">

                                                                            {
                                                                                conversation.unreadCount
                                                                            }

                                                                        </span>

                                                                    )
                                                                }


                                                            </div>


                                                            <p>

                                                                {
                                                                    conversation.lastMessage
                                                                }

                                                            </p>


                                                            <span>

                                                                {
                                                                    formatTime(
                                                                        conversation.lastMessageTime
                                                                    )
                                                                }

                                                            </span>


                                                        </div>


                                                    </button>

                                                );

                                            }
                                        )
                                    }



                                    {
                                        conversations.length ===
                                        0
                                        && (

                                            <div className="no-conversations">

                                                <h3>
                                                    No conversations
                                                </h3>

                                                <p>
                                                    Customer messages will appear here automatically.
                                                </p>

                                            </div>

                                        )
                                    }


                                </div>


                            </div>





                            {/* ==========================
                                CHAT PANEL
                            ========================== */}

                            <div className="chat-panel">


                                {
                                    selectedUser
                                    ? (

                                        <>


                                            {/* ==========================
                                                CHAT HEADER
                                            ========================== */}

                                            <div className="chat-header">


                                                <div className="chat-user">


                                                    <div className="chat-user-avatar">

                                                        {
                                                            selectedUser
                                                                ?.name
                                                                ?.charAt(0)
                                                                ?.toUpperCase()
                                                            ||
                                                            "C"
                                                        }

                                                    </div>


                                                    <div>

                                                        <strong>

                                                            {
                                                                selectedUser
                                                                    ?.name ||
                                                                "Customer"
                                                            }

                                                        </strong>


                                                        <span>

                                                            {
                                                                selectedUser
                                                                    ?.email ||
                                                                "Customer"
                                                            }

                                                        </span>

                                                    </div>


                                                </div>


                                            </div>





                                            {/* ==========================
                                                CHAT MESSAGES
                                            ========================== */}

                                            <div className="chat-messages">


                                                {
                                                    chatLoading
                                                    ? (

                                                        <div className="chat-loading">

                                                            Loading conversation...

                                                        </div>

                                                    )
                                                    : (

                                                        messages.map(
                                                            (
                                                                message
                                                            ) => {

                                                                const senderId =
                                                                    getUserId(
                                                                        message.sender
                                                                    );


                                                                const isMine =
                                                                    String(
                                                                        senderId
                                                                    ) ===
                                                                    String(
                                                                        myUserId
                                                                    );


                                                                return (

                                                                    <div
                                                                        key={
                                                                            message._id
                                                                        }
                                                                        className={
                                                                            isMine
                                                                            ?
                                                                            "message-row mine"
                                                                            :
                                                                            "message-row theirs"
                                                                        }
                                                                    >


                                                                        <div
                                                                            className={
                                                                                isMine
                                                                                ?
                                                                                "message-bubble mine"
                                                                                :
                                                                                "message-bubble theirs"
                                                                            }
                                                                            style={
                                                                                message.pending
                                                                                ? {
                                                                                    opacity:0.75
                                                                                }
                                                                                : undefined
                                                                            }
                                                                        >

                                                                            <p>

                                                                                {
                                                                                    message.message
                                                                                }

                                                                            </p>


                                                                            <span>

                                                                                {
                                                                                    message.pending
                                                                                    ?
                                                                                    "Sending..."
                                                                                    :
                                                                                    formatTime(
                                                                                        message.createdAt
                                                                                    )
                                                                                }

                                                                            </span>


                                                                        </div>


                                                                    </div>

                                                                );

                                                            }
                                                        )

                                                    )
                                                }


                                                <div
                                                    ref={
                                                        chatBottomRef
                                                    }
                                                />


                                            </div>





                                            {/* ==========================
                                                MESSAGE INPUT
                                            ========================== */}

                                            <form
                                                className="message-input-area"
                                                onSubmit={
                                                    handleSendMessage
                                                }
                                            >


                                                <input
                                                    type="text"
                                                    placeholder="Type your message..."
                                                    value={
                                                        messageText
                                                    }
                                                    onChange={(e) =>
                                                        setMessageText(
                                                            e.target.value
                                                        )
                                                    }
                                                />


                                                <button
                                                    type="submit"
                                                    disabled={
                                                        sending ||
                                                        !messageText.trim()
                                                    }
                                                >

                                                    {
                                                        sending
                                                        ?
                                                        "Sending..."
                                                        :
                                                        "Send"
                                                    }

                                                </button>


                                            </form>


                                        </>

                                    )
                                    : (

                                        <div className="select-conversation">


                                            <div>

                                                <h2>
                                                    Select a conversation
                                                </h2>

                                                <p>
                                                    Customer chats will appear on the left.
                                                </p>

                                            </div>


                                        </div>

                                    )
                                }


                            </div>


                        </div>

                    )
                }


            </main>


        </div>

    );

};


export default TailorMessages;