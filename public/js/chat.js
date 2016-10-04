$(document).ready(function() {
    var socket = io.connect();
    var username, message;

    $('#setUserName').submit(function(e) {
        e.preventDefault();
        username = $('#username').val();
        socket.emit('new-user', username, function(isUsernameExist) {
            if (isUsernameExist) {
                $('#setUserName').hide();
                $('#chatWindow').show();
            } else {
                $('#error').html("Sorry, that nickname is already taken , try something else");
            }
        })
        $('#username').val("");
    })

    socket.on('user-updated', function(usernames) {
        var markup = '<ul>'
        usernames.forEach(function(user) {
            markup += '<li>' + user + '</li>'
        })
        markup += '</ul>'
        $('#users').html(markup);
    })

    $('#chatMessage').keydown(function(e) {
        if (e.keyCode == 13) {
            $(this.form).submit()
            return false;
        }
    });

    $('#chatBox').submit(function(e) {
        e.preventDefault();
        message = $('#chatMessage').val();
        socket.emit('message-sent', message, function(status) {
            console.log(status);
        });
        $('#chatMessage').val("");
    });

    socket.on('new-message', function(messageData) {
        if (messageData.username === username) {
            $('#chatHistory').append("<p align='right'><b>" + messageData.username + " : </b>" + messageData.message + "</p>");
        } else {
            $('#chatHistory').append("<p align='left'><b>" + messageData.username + " : </b>" + messageData.message + "</p>");
        }
    })

});
