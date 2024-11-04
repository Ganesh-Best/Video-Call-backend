import express from 'express';
import {createServer} from 'http';
import {Server } from 'socket.io';

const app  = express()

const server = createServer(app)

app.get('/' ,(req,res)=>{
    res.json({message:"Server is Running :"})
})
const io = new Server(server,{cors:{
    origin:'*',
    method:['GET','POST']
}})

server.listen(3003,()=>{
    console.log(`Server is running on port `, 3003)
})

io.on('connection',(socket)=>{
 
  console.log('New client joined',socket.id);
   socket.emit('me',{id:socket.id})
0  
   socket.on('callUser',({userToCall,signalData,from,name})=>{
      
    console.log('Call user event received',userToCall ,from,name)

     io.to(userToCall).emit('callUser',{signal:signalData,from , name});

     console.log('Calluser event sent',userToCall)

   })

   socket.on('answerCall',({to,signal})=>{
        
    console.log('answer call event received:',to,signal)
      io.to(to).emit('callAccepted',{signal})

      console.log(`Call accepted event sent`,to,)

 })

    
    socket.on('disconnect',()=>{
       socket.broadcast.emit('callEnded',{id:socket.id});
    })

})
