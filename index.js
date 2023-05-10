// const express = require("express")
// const PORT = process.env.PORT || 8013
// const app = express()
// app.use(express.json())
// const cors = require("cors")
// app.use(cors({origin:"*"}));

// require("dotenv").config()
// const cookieParser = require("cookie-parser")
// app.use(cookieParser())
// const connection = require("./connection/db")
// const urlRouter = require("./routes/url.route")
// const url = require("./models/urlmodel")
// const userRouter = require("./routes/user.route")

// const { googlerouter } = require("./login-routes/g-oauthroute")
// const { githubRouter } = require("./login-routes/github.route")

// app.use("/url", urlRouter)
// app.use("/google", googlerouter)
// app.use("/", githubRouter)
// app.use("/user", userRouter)

// app.get("/", (req, res)=>{

//     res.send(`<h1>Welcome</h1>`)
// })

// const socket = require("socket.io");
// const server = app.listen(PORT, async ()=>{
//     try {
//         await connection
//         console.log("Server is Running at "+PORT)
//     } catch (error) {
//         console.log(error)
//     }
// })
// const io = socket(server);

// // app.get("/:shortID", async (req, res)=>{
// //     try {
// //         let fetchedURL = await url.findOne({shorturl: req.params.shortID})
// //         if (!fetchedURL) return res.status(404).json({msg: "URL does not exist"})
// //         let visits = Number(fetchedURL.visited)
// //         fetchedURL.visited = visits+1;
// //         await fetchedURL.save()
// //         res.redirect(fetchedURL.longurl)

// //     } catch (error) {
// //         console.log(error)
// //     }
// // })

// urlRouter.post("/assign", async(req, res)=>{
//     try {
//         const {longurl, id} = req.body;
//         if (!longurl) return res.json({msg: "Please Provide URL"})
        
//         const newurl = new url({longurl, author: id})
        
//         await newurl.save();
//         io.emit("newUrl", newurl); // emit event to all connected clients
//         res.send(newurl);
//     } catch (error) {
//         console.log(error)
//         res.send(error)
//     }
// })

// app.get("/:shortID", async (req, res)=>{
//     try {
//         let fetchedURL = await url.findOne({shorturl: req.params.shortID})
//         if (!fetchedURL) return res.status(404).json({msg: "URL does not exist"})
//         let visits = Number(fetchedURL.visited)
//         fetchedURL.visited = visits+1;
//         await fetchedURL.save();
//         io.emit("urlVisited", fetchedURL); // emit event to all connected clients
//         res.redirect(fetchedURL.longurl)

//     } catch (error) {
//         console.log(error)
//     }
// })


// app.listen(PORT, async ()=>{
//     try {
//         await connection
//         console.log("Server is Running at "+PORT)
//     } catch (error) {
//         console.log(error)
//     }
// })
const express = require("express")
const app = express()
const server = require("http").createServer(app) // create server instance
const socket = require("socket.io")
const io = socket(server) // pass server instance to socket.io

const PORT = process.env.PORT || 8013
const connection = require("./connection/db")
const urlRouter = require("./routes/url.route")
const url = require("./models/urlmodel")
const userRouter = require("./routes/user.route")
const { googlerouter } = require("./login-routes/g-oauthroute")
const { githubRouter } = require("./login-routes/github.route")

app.use(express.json())
const cors = require("cors")
app.use(cors({origin:"*"}))

require("dotenv").config()
const cookieParser = require("cookie-parser")
app.use(cookieParser())

app.use("/url", urlRouter)
app.use("/google", googlerouter)
app.use("/", githubRouter)
app.use("/user", userRouter)

app.get("/", (req, res)=>{
    res.send(`<h1>Welcome</h1>`)
})

app.get("/:shortID", async (req, res)=>{
    try {
        let fetchedURL = await url.findOne({shorturl: req.params.shortID})
        if (!fetchedURL) return res.status(404).json({msg: "URL does not exist"})
        let visits = Number(fetchedURL.visited)
        fetchedURL.visited = visits+1;
        await fetchedURL.save()
        io.emit("urlVisited", fetchedURL); // emit event to all connected clients
        res.redirect(fetchedURL.longurl)

    } catch (error) {
        console.log(error)
    }
})

urlRouter.post("/assign", async(req, res)=>{
    try {
        const {longurl, id} = req.body;
        if (!longurl) return res.json({msg: "Please Provide URL"})
        
        const newurl = new url({longurl, author: id})
        
        await newurl.save();
        io.emit("newUrl", newurl); // emit event to all connected clients
        res.send(newurl);
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

server.listen(PORT, async ()=>{
    try {
        await connection
        console.log("Server is Running at "+PORT)
    } catch (error) {
        console.log(error)
    }
})
