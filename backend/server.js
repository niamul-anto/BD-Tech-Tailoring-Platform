require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const configureSocket = require("./socket/socket");


// ==========================
// ROUTES
// ==========================

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tailorRoutes = require("./routes/tailorRoutes");
const gigRoutes = require("./routes/gigRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const messageRoutes = require("./routes/messageRoutes");
const adminRoutes = require("./routes/adminRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const measurementRoutes = require("./routes/measurementRoutes");
const homeMeasurementRoutes = require("./routes/homeMeasurementRoutes");
const publicRoutes = require("./routes/publicRoutes");



const app = express();



// ==========================
// MIDDLEWARE
// ==========================

app.use(
    cors()
);


app.use(
    express.json()
);



// ==========================
// HTTP SERVER
// ==========================

const server = http.createServer(
    app
);



// ==========================
// SOCKET.IO
// ==========================

const io = new Server(
    server,
    {

        cors:{

            origin:"*",

            methods:[
                "GET",
                "POST"
            ]

        }

    }
);



// ==========================
// SOCKET CONFIGURATION
// ==========================

configureSocket(
    io
);



// ==========================
// MAKE SOCKET AVAILABLE
// INSIDE CONTROLLERS
// ==========================

app.set(
    "io",
    io
);



// ==========================
// AUTH ROUTES
// ==========================

app.use(
    "/api/auth",
    authRoutes
);



// ==========================
// USER ROUTES
// ==========================

app.use(
    "/api/users",
    userRoutes
);



// ==========================
// TAILOR ROUTES
// ==========================

app.use(
    "/api/tailors",
    tailorRoutes
);



// ==========================
// GIG ROUTES
// ==========================

app.use(
    "/api/gigs",
    gigRoutes
);



// ==========================
// ORDER ROUTES
// ==========================

app.use(
    "/api/orders",
    orderRoutes
);



// ==========================
// PAYMENT ROUTES
// ==========================

app.use(
    "/api/payment",
    paymentRoutes
);



// ==========================
// REVIEW ROUTES
// ==========================

app.use(
    "/api/reviews",
    reviewRoutes
);



// ==========================
// NOTIFICATION ROUTES
// ==========================

app.use(
    "/api/notifications",
    notificationRoutes
);



// ==========================
// DASHBOARD ROUTES
// ==========================

app.use(
    "/api/dashboard",
    dashboardRoutes
);



// ==========================
// FAVORITE ROUTES
// ==========================

app.use(
    "/api/favorites",
    favoriteRoutes
);



// ==========================
// MESSAGE ROUTES
// ==========================

app.use(
    "/api/messages",
    messageRoutes
);



// ==========================
// ADMIN ROUTES
// ==========================

app.use(
    "/api/admin",
    adminRoutes
);



// ==========================
// DELIVERY ROUTES
// ==========================

app.use(
    "/api/delivery",
    deliveryRoutes
);



// ==========================
// MEASUREMENT ROUTES
// ==========================

app.use(
    "/api/measurements",
    measurementRoutes
);



// ==========================
// HOME MEASUREMENT ROUTES
// ==========================

app.use(
    "/api/home-measurements",
    homeMeasurementRoutes
);



// ==========================
// PUBLIC ROUTES
// ==========================

app.use(
    "/api/public",
    publicRoutes
);



// ==========================
// TEST ROUTE
// ==========================

app.get(
    "/",
    (req,res)=>{

        res.send(
            "BD Tech Tailoring API Running"
        );

    }
);



// ==========================
// PORT
// ==========================

const PORT =
    process.env.PORT || 5000;



// ==========================
// CONNECT DATABASE
// START SERVER
// ==========================

connectDB()

.then(()=>{

    server.listen(
        PORT,
        ()=>{

            console.log(
                `Server running on ${PORT}`
            );

        }
    );

})

.catch((error)=>{

    console.log(
        "Database connection failed:",
        error.message
    );

});