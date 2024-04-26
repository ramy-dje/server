import { Server } from "socket.io";
import { server } from "./server";



const io = new Server(server);
io.on('connection',(socket)=>{
  console.log('user connected ')
  socket.on('message',(msg)=>{
    console.log('message')
  })
})