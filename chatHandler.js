var chatHandler = function(io,users) {
    io.sockets.on('connection', function(socket) {
        console.log("New connection established")

        socket.on('new-user', function(username, callback) {
            if (username in users) {
                console.log(username + " username already exists");
                callback(false);
            } else {
                console.log(username + " username added");
                callback(true);
                socket.username = username;
                users[username] = socket;
                console.log("current users:");
                console.log(Object.keys(users));
                updateUsers();
            }
        })

        socket.on('message-sent', function(message, callback) {
            var message = message.trim();
            io.sockets.emit('new-message', {
                message: message,
                username: socket.username
            });
            callback("message sent")
        })

        function updateUsers() {
            io.sockets.emit('user-updated', Object.keys(users))
        }
    })
}
module.exports = chatHandler;
