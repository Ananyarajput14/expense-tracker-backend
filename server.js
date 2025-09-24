require("dotenv").config();
const express= require("express");
const cors= require("cors");
const path= require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app= express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/",authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/",incomeRoutes);
app.use("/",expenseRoutes);
app.use("/",dashboardRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    });
});
