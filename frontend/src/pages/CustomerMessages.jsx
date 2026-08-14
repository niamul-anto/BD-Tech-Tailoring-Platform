import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

import { useSelector } from "react-redux";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import socket from "../socket/socket";

import "./CustomerMessages.css";


const CustomerMessages = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const { tailorId } = useParams();

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

    const [socketConnected, setSocketConnected] =
        useState(socket.connected);



    // ==========================
    // REFS
    // ==========================

    const chatBottomRef =
        useRef(null);

    const chatMessagesRef =
        useRef(null);

    const selectedUserRef =
        useRef(null);



    // ==========================
    // GET USER ID
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
    // KEEP SELECTED USER REF
    // ==========================

    useEffect(() => {

        selectedUserRef.current =
            selectedUser;

    }, [selectedUser]);



    // ==========================
    // SCROLL CHAT TO BOTTOM
    // ==========================

    const scrollToBottom = () => {

        requestAnimationFrame(() => {

            const chatContainer =
                chatMessagesRef.current;


            if(chatContainer){

                chatContainer.scrollTo({

                    top:
                        chatContainer.scrollHeight,

                    behavior:"smooth"

                });

                return;

            }


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

            const response = await api.get(
                "/messages/conversations"
            );


            const data =
                response.data.conversations || [];


            setConversations(
                data
            );


            return data;

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
            getUserId(otherUser);


        if(!otherUserId){

            return;

        }


        try {

            setSelectedUser(
                otherUser
            );


            selectedUserRef.current =
                otherUser;


            setChatLoading(true);

            setError("");


            const response = await api.get(
                `/messages/conversation/${otherUserId}`
            );


            setMessages(
                response.data.messages || []
            );


            // UI instantly ready
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

        const initializeMessages = async () => {

            try {

                setLoading(true);

                setError("");


                const conversationData =
                    await loadConversations();



                // ==========================
                // COMING FROM GIG DETAILS
                // ==========================

                if(tailorId){

                    const existingConversation =
                        conversationData.find(
                            (conversation) =>

                                getUserId(
                                    conversation.user
                                ) === tailorId
                        );


                    if(existingConversation){

                        await openConversation(
                            existingConversation.user
                        );


                        return;

                    }



                    const stateTailor =
                        location.state?.tailor;


                    const newTailor = {

                        _id:tailorId,

                        name:
                            stateTailor?.name ||
                            "Tailor",

                        email:
                            stateTailor?.email ||
                            "",

                        role:"tailor"

                    };


                    await openConversation(
                        newTailor
                    );


                    return;

                }



                // ==========================
                // NORMAL MESSAGE PAGE
                // ==========================

                if(
                    conversationData.length > 0
                ){

                    await openConversation(
                        conversationData[0].user
                    );

                }

            }
            finally{

                setLoading(false);

            }

        };


        initializeMessages();

    }, [tailorId]);



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
                                receiverId
                            ){

                                found = true;


                                return {

                                    ...conversation,

                                    lastMessage:
                                        text,

                                    lastMessageTime:
                                        createdAt

                                };

                            }


                            return conversation;

                        }
                    );


                // ==========================
                // NEW CONVERSATION
                // ==========================

                let result = updated;


                if(!found && selectedUser){

                    result = [

                        {

                            user:
                                selectedUser,

                            lastMessage:
                                text,

                            lastMessageTime:
                                createdAt,

                            unreadCount:0

                        },

                        ...updated

                    ];

                }


                // ==========================
                // MOVE ACTIVE TO TOP
                // ==========================

                const activeIndex =
                    result.findIndex(
                        (conversation) =>

                            getUserId(
                                conversation.user
                            ) === receiverId
                    );


                if(activeIndex > 0){

                    const active =
                        result[
                            activeIndex
                        ];


                    return [

                        active,

                        ...result.filter(
                            (_,index) =>
                                index !== activeIndex
                        )

                    ];

                }


                return result;

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


        const selectedUserId =
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
                                        incomingMessage.message,

                                    lastMessageTime:
                                        incomingMessage.createdAt,

                                    unreadCount:
                                        selectedUserId === senderId

                                        ? 0

                                        : (
                                            conversation.unreadCount ||
                                            0
                                        ) + 1

                                };

                            }


                            return conversation;

                        }
                    );


                // ==========================
                // EXISTING CHAT
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
                                    index !== activeIndex
                            )

                        ];

                    }


                    return updated;

                }



                // ==========================
                // NEW CHAT ONLY
                // FETCH ONCE
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

            return;

        }



        // ==========================
        // CONNECT
        // ==========================

        const handleConnect = () => {

            setSocketConnected(true);


            console.log(
                "Customer socket connected:",
                socket.id
            );


            socket.emit(
                "join_user_room",
                myUserId
            );


            console.log(
                "Customer joined room:",
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
        // CONNECT ERROR
        // ==========================

        const handleConnectError = (
            error
        ) => {

            setSocketConnected(false);


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
                "Customer received message:",
                incomingMessage
            );


            const receiverId =
                getUserId(
                    incomingMessage.receiver
                );


            // ==========================
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
            // CURRENT CHAT OPEN
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
            // UPDATE CONVERSATION LIST
            // LOCALLY
            // ==========================

            updateConversationAfterReceive(
                incomingMessage
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
            "connect_error",
            handleConnectError
        );


        socket.on(
            "receive_message",
            handleReceiveMessage
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
                "connect_error",
                handleConnectError
            );


            socket.off(
                "receive_message",
                handleReceiveMessage
            );

        };


    }, [myUserId]);



    // ==========================
    // SEND MESSAGE
    // ==========================

    const handleSendMessage = async (e) => {

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

                role:"customer"

            },

            receiver:
                selectedUser,

            message:
                trimmedMessage,

            isRead:false,

            createdAt:
                new Date().toISOString(),

            pending:true

        };



        // ==========================
        // SHOW IMMEDIATELY
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

                    role:"customer"

                },

                receiver:
                    selectedUser,

                pending:false

            };



            // ==========================
            // REPLACE TEMP MESSAGE
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


            updateConversationAfterSend(
                receiverId,
                trimmedMessage,
                sentMessage.createdAt
            );


            scrollToBottom();

        }
        catch(error){

            console.log(error);


            // REMOVE FAILED TEMP MESSAGE

            setMessages(
                (previous) =>

                    previous.filter(
                        (message) =>
                            message._id !==
                            tempId
                    )
            );


            // Put message back

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
    // TOTAL UNREAD MESSAGES
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

        <div className="customer-messages-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="customer-messages-sidebar">


                <div className="customer-messages-logo">

                    BD Tailoring

                </div>


                <nav>


                    <button
                        onClick={() =>
                            navigate("/customer")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        onClick={() =>
                            navigate("/customer/gigs")
                        }
                    >
                        Browse Gigs
                    </button>


                    <button
                        onClick={() =>
                            navigate("/customer/tailors")
                        }
                    >
                        Tailors
                    </button>


                    <button
                        onClick={() =>
                            navigate("/customer/orders")
                        }
                    >
                        My Orders
                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/customer/home-measurements"
                            )
                        }
                    >
                        Home Measurement
                    </button>


                    <button
                        onClick={() =>
                            navigate("/customer/favorites")
                        }
                    >
                        Favorites
                    </button>


                    <button
                        className="active"
                        onClick={() =>
                            navigate("/customer/messages")
                        }
                    >

                        Messages


                        {
                            totalUnread > 0
                            && (

                                <span className="customer-message-nav-badge">

                                    {totalUnread}

                                </span>

                            )
                        }

                    </button>


                    <button
                        onClick={() =>
                            navigate("/customer/notifications")
                        }
                    >

                        Notifications


                        {
                            notificationUnreadCount > 0
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
                            navigate("/customer/profile")
                        }
                    >
                        My Profile
                    </button>


                </nav>



                <div className="customer-messages-sidebar-bottom">

                    <button
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>


            </aside>





            {/* ==========================
                MAIN
            ========================== */}

            <main className="customer-messages-main">


                <div className="customer-messages-header">


                    <div>

                        <h1>
                            Messages
                        </h1>

                        <p>
                            Chat with your tailors in real time
                        </p>

                    </div>



                    <div
                        className={
                            socketConnected
                            ?
                            "customer-socket-status connected"
                            :
                            "customer-socket-status disconnected"
                        }
                    >

                        {
                            socketConnected
                            ?
                            "Live"
                            :
                            "Connecting..."
                        }

                    </div>


                </div>



                {
                    error
                    && (

                        <div className="customer-messages-error">

                            {error}

                        </div>

                    )
                }



                {
                    loading
                    ? (

                        <div className="customer-messages-state">

                            Loading messages...

                        </div>

                    )
                    : (

                        <div className="customer-messages-layout">


                            {/* ==========================
                                CONVERSATION LIST
                            ========================== */}

                            <section className="customer-conversation-panel">


                                <div className="customer-conversation-header">


                                    <div>

                                        <h2>
                                            Conversations
                                        </h2>


                                        <span>

                                            {
                                                conversations.length
                                            } chats

                                        </span>

                                    </div>


                                </div>



                                <div className="customer-conversation-list">


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


                                                const active =
                                                    conversationUserId ===
                                                    selectedUserId;


                                                return (

                                                    <button
                                                        type="button"
                                                        key={
                                                            conversationUserId
                                                        }
                                                        className={
                                                            active
                                                            ?
                                                            "customer-conversation-item active"
                                                            :
                                                            "customer-conversation-item"
                                                        }
                                                        onClick={() =>
                                                            openConversation(
                                                                conversationUser
                                                            )
                                                        }
                                                    >


                                                        <div className="customer-conversation-avatar">

                                                            {
                                                                conversationUser
                                                                    ?.name
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase()
                                                                ||
                                                                "T"
                                                            }

                                                        </div>



                                                        <div className="customer-conversation-info">


                                                            <div className="customer-conversation-name">


                                                                <strong>

                                                                    {
                                                                        conversationUser
                                                                            ?.name ||
                                                                        "Tailor"
                                                                    }

                                                                </strong>



                                                                {
                                                                    conversation.unreadCount >
                                                                    0
                                                                    && (

                                                                        <span>

                                                                            {
                                                                                conversation.unreadCount
                                                                            }

                                                                        </span>

                                                                    )
                                                                }


                                                            </div>



                                                            <p>

                                                                {
                                                                    conversation.lastMessage ||
                                                                    "No message yet"
                                                                }

                                                            </p>



                                                            <small>

                                                                {
                                                                    formatTime(
                                                                        conversation.lastMessageTime
                                                                    )
                                                                }

                                                            </small>


                                                        </div>


                                                    </button>

                                                );

                                            }
                                        )
                                    }



                                    {
                                        conversations.length ===
                                        0 &&
                                        !selectedUser
                                        && (

                                            <div className="customer-no-conversations">


                                                <h3>
                                                    No conversations yet
                                                </h3>


                                                <p>
                                                    Open a gig and message a tailor to start chatting.
                                                </p>


                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            "/customer/gigs"
                                                        )
                                                    }
                                                >
                                                    Browse Gigs
                                                </button>


                                            </div>

                                        )
                                    }


                                </div>


                            </section>





                            {/* ==========================
                                CHAT
                            ========================== */}

                            <section className="customer-chat-panel">


                                {
                                    selectedUser
                                    ? (

                                        <>


                                            <div className="customer-chat-header">


                                                <div className="customer-chat-avatar">

                                                    {
                                                        selectedUser
                                                            ?.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()
                                                        ||
                                                        "T"
                                                    }

                                                </div>


                                                <div>

                                                    <strong>

                                                        {
                                                            selectedUser
                                                                ?.name ||
                                                            "Tailor"
                                                        }

                                                    </strong>


                                                    <span>

                                                        {
                                                            selectedUser
                                                                ?.email ||
                                                            "Tailor"
                                                        }

                                                    </span>

                                                </div>


                                            </div>





                                            {/* ==========================
                                                CHAT MESSAGES
                                            ========================== */}

                                            <div
                                                className="customer-chat-messages"
                                                ref={
                                                    chatMessagesRef
                                                }
                                            >


                                                {
                                                    chatLoading
                                                    ? (

                                                        <div className="customer-chat-loading">

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
                                                                            "customer-message-row mine"
                                                                            :
                                                                            "customer-message-row theirs"
                                                                        }
                                                                    >


                                                                        <div
                                                                            className={
                                                                                isMine
                                                                                ?
                                                                                "customer-message-bubble mine"
                                                                                :
                                                                                "customer-message-bubble theirs"
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
                                                className="customer-message-input-area"
                                                onSubmit={
                                                    handleSendMessage
                                                }
                                            >


                                                <input
                                                    type="text"
                                                    value={
                                                        messageText
                                                    }
                                                    placeholder="Type your message..."
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

                                        <div className="customer-select-conversation">


                                            <h2>
                                                Select a conversation
                                            </h2>


                                            <p>
                                                Choose a tailor from the conversation list to start chatting.
                                            </p>


                                        </div>

                                    )
                                }


                            </section>


                        </div>

                    )
                }


            </main>


        </div>

    );

};


export default CustomerMessages;