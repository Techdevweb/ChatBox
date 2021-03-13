const moment=require('moment')

function userInfo(username,text){
    return {
        username,
        text,
        time:moment().format('h:mm a')
    }
}//User info is returned in the form of an object

module.exports =userInfo