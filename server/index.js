require("dotenv").config();
const express = require("express");
const sequilize = require("./db");
const models = require("./models/models");
const PORT = +process.env.PORT || 5050;
const cors = require("cors");
const router = require("./routes/index");
const errorHandler = require("./middlewares/ErrorHandlingMiddleware");
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use("/api", router);
// middleware с ошибками должен обязательно ргеитсрироваться в самом конце
app.use(errorHandler);
//fjfjfjf
app.get("/", (req, res) => {
    res.status(200).json({ message: "ДЖИГУРДАААААА" });
});

const start = async () => {
    try {
        await sequilize.authenticate();
        await sequilize.sync(); //сверает базу данных со схемой
        app.listen(PORT, () =>
            console.log("server started on portoslav portoslavovich")
        );
    } catch (e) {
        console.log(e);
    }
};

start();
