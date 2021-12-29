const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/",(req,res,next)=>{
    return res.render("chatPage")
})








server.listen(3000,()=>{
    console.log('Server Started');
})