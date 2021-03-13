const path=require('path')
const http=require('http')
const express=require('express')
//Handling socket.io
const socketio=require('socket.io')

const app=express()
const server=http.createServer(app)
//initialize variable for socketio
const io=socketio(server)
const userInfo=require('./public/js/user')
const {userJoin,currentUser,LeaveUser,getRoomUsers}=require('./public/js/users')

//Setting static folder of html,css and js files
app.use(express.static(path.join(__dirname, 'public')))

//Run's when user joins
io.on('connection',socket=>{

    socket.on('joinroom',({username,room})=>{

        const user=userJoin(socket.id,username,room)

        socket.join(user.room)

        socket.emit('message',userInfo('Server','Welcome to the chat'))//server emmits message with message event to the client

        //Broadcast when new user joins
        socket.broadcast.to(user.room).emit('message',userInfo('Server',`${user.username} has joined the chat`))//Sends msg to every user except the client when he is connected

        io.to(user.room).emit('userList',{room:user.room,users:getRoomUsers(user.room)})//List of users
    
    })

    //If user disconnects
    socket.on('disconnect',()=>{

        const user=LeaveUser(socket.id)

        if(user){
            io.to(user.room).emit('message',userInfo('Server',`${user.username} has left the chat`))//Sends msg to every user who is left

            io.to(user.room).emit('userList',{room:user.room,users:getRoomUsers(user.room)})//List of users
        }
    })

    //Listening for the event from clinet, msg is received in msg
    socket.on('chatMsg',msg=>{
        const getUser=currentUser(socket.id)//Returns the user object

        io.to(getUser.room).emit('message',userInfo(getUser.username,msg))//Emmits the message to all the users connected so use io
    })
})

server.listen(process.env.PORT || 3000,()=>console.log('Server started at port 3000',__dirname))