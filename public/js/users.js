const users=[]

//Join user to the chat

function userJoin(id,username,room){
    const user={id,username,room}

    users.push(user)

    return user
}

//Getting current user

function currentUser(id){
    return users.find(user=>user.id === id)//Finds the specific user by id
}

function LeaveUser(id){
    const index=users.findIndex(user=>user.id===id)

    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

function getRoomUsers(room){
    return users.filter(user=>user.room===room)
}

module.exports={userJoin,currentUser,LeaveUser,getRoomUsers}