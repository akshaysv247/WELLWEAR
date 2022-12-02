const dotenv = require('dotenv').config()
const express = require("express");
const app = express();

const session=require('express-session')
const cookieParser=require('cookie-parser')
const path=require('path')
const logger=require('morgan')
const mongoConnector = require('./Database/connection')


const usersRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const errorpage = require("./routes/error");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(express.json())
app.use(express.urlencoded());
app.use(cookieParser());
app.use(
  session({
    secret: "key",
    cookie: { maxAge: 6000000 * 5 },
    // saveUninitialized:false
  })
);




app.use(logger("dev"));
app.use(express.static(path.join(__dirname,'public')))

mongoConnector;

app.use('/admin',adminRouter)
app.use('/',usersRouter)
app.use(errorpage)



const PORT = process.env.PORT || 3005;
app.listen(PORT, console.log("SERVER CHARGED AT PORT: " + PORT));

