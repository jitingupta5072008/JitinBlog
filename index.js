require("dotenv").config();

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const Blog = require("./models/blog");

const userRoute = require("./routes/user")
const blogRoute = require("./routes/blog")

const { checkForAuthenticationCookie } = require('./middlewares/authentication')

const app = express();
const PORT = process.env.PORT || 9090;

mongoose.connect(process.env.MONGO_URL).then(e => console.log('Mongodb Connected..'))

const templatePath = path.join(__dirname, "./views")

app.set("view engine", "ejs")
app.use(express.static(templatePath))

app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))

app.use(express.static(path.resolve("./public")));


app.get("/",async(req,res) => {
     const allBlogs = await Blog.find({});
     res.render("home", {
       user: req.user,
       blogs: allBlogs,
     });
})

app.use("/user",userRoute)
app.use("/blog",blogRoute)




app.listen(PORT, ()=> console.log(`Server Started at PORT: http://localhost:${PORT}`))