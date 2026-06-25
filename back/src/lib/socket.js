import {Server} from "socket.io"
import http from "http"
import express from "express"

const app=express()
const server=http.createServer(app)

const io=new Server(server,{
    cors:{origin:["http://localhost:5173", "http://localhost:5174"]}
})

export function getRecieversocketid(id){
    return userSocket[id];
}

const userSocket={};  //{userid:socketid}


io.on("connection",(socket)=>{
    console.log("A user connected",socket.id);
    const userid=socket.handshake.query.userId  //taking userid which is passed through socket
    if (userid) userSocket[userid]=socket.id;

    io.emit("Online users",Object.keys(userSocket))       //passing the userid as an event to client side

    
    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id)
        delete userSocket[userid]
        io.emit("Online users",Object.keys(userSocket))
    })

})
export {io,app,server}