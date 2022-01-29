var gIo = null

function connectSockets(http, session) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        console.log('New socket', socket.id)
        socket.on('disconnect', socket => {
            console.log('Someone disconnected')
        })

        socket.on('join board-room', boardId => {
            console.log('joining room!', boardId)
            if (socket.boardRoom === boardId) return;
            if (socket.boardRoom) {
                socket.leave(socket.boardRoom)
                console.log('I already have a room.')
            }
            socket.join(boardId)
            socket.boardRoom = boardId
        })
        socket.on('member updated board', boardId => {
            // console.log('Emitting board update', boardId);
            // emits to all sockets:
            // gIo.emit('chat addMsg', msg)
            // emits only to sockets in the same room
            // console.log('socket room', socket.boardRoom);
            socket.to(socket.boardRoom).emit('board was updated', boardId)
            // gIo.to(socket.boardRoom).emit('chat addMsg', msg)
        })
        socket.on('member updated board-list', () => {
            // emits to all sockets:
            // gIo.emit('chat addMsg', msg)
            // emits only to sockets in the same room
            console.log('socketID',socket.id);
            console.log('updating board list!!!')
            socket.broadcast.emit('board-list was updated')
            // gIo.to(socket.boardRoom).emit('chat addMsg', msg)
        })
    })
}


// Send to all sockets BUT not the current socket 
async function broadcast({ type, data, room = null, userId }) {
    console.log('BROADCASTING', JSON.stringify(arguments));
    const excludedSocket = await _getUserSocket(userId)
    if (!excludedSocket) {
        // logger.debug('Shouldnt happen, socket not found')
        // _printSockets();
        console.log('not excluded');
        return;
    }
    if (room) {
        excludedSocket.broadcast.to(room).emit(type, data)
    } else {
        excludedSocket.broadcast.emit(type, data)
    }
}

async function _getUserSocket(userId) {
    const sockets = await _getAllSockets();
    const socket = sockets.find(s => s.userId == userId)
    return socket;
}

async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets();
    return sockets;
}



module.exports = {
    connectSockets,
    broadcast
}