const moment = require("moment");

formatMessageData = ({username, roomname}) => {
    return {
        username : username,
        roomname : roomname,
        date : moment().format('h:mm a')
    }
}