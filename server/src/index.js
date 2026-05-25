const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const seedData = require("./seed/seedData");
const leadRoutes = require("./routes/leadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const testRoutes = require("./routes/testRoutes");

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
    },
});

global.io = io;

app.set("io", io);
app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/test", testRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB Connected");

        await seedData();
    })
    .catch((err) => {
        console.log("MongoDB Error:", err);
    });

io.on("connection", (socket) => {
    console.log("Client Connected");

    socket.on("disconnect", () => {
        console.log("Client Disconnected");
    });
});

app.get("/", (req, res) => {
    res.send("API Running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});