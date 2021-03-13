const chatForm=document.getElementById('chat-form')//Obtain the msg form
const roomname=document.getElementById('room-name')//Obtain the msg form
const list=document.getElementById('users')//Obtain the msg form


const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})//Getting user name and room from qs library

const socket=io()

socket.emit('joinroom',{username,room})


socket.on('message',msg=>{
    console.log(msg);//Message emmitted from the server is catched by the same message event and it is stored in msg var

    outputMsg(msg)
    //To scroll down
    document.querySelector('.chat-messages').scrollTop=document.querySelector('.chat-messages').scrollHeight
})
socket.on('userList',({room,users})=>{
    roomName(room)
    userList(users)
})

chatForm.addEventListener('submit',e => {
    e.preventDefault()//Prevents the data to got to the files

    const msg=e.target.elements.msg.value//Targets the value inside the input

    socket.emit('chatMsg',msg)//Sends the msg to server with  chatMsg event
    e.target.elements.msg.value=' '//Clears the input
    e.target.elements.msg.focus()
})

//Sending msg to the chat window or DOM
function outputMsg(msg) {

    const div=document.createElement('div')
    // div.classList.add('message')
    if(username===msg.username){
        div.classList.add('message2')
        msg.username='You'
    }
    else{
        div.classList.add('message')
    }
    div.innerHTML=`
    <p class="meta">${msg.username}<span>${msg.time}</span></p>
        <p class="text">
            ${msg.text}
        </p>
    `
    
    document.querySelector('.chat-messages').appendChild(div)
}

function userList(users){
    list.innerHTML=`
        ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `
}

function roomName(room){
    roomname.innerText=room
}



