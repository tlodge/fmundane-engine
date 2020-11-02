let socket = null;

export const init = (_socket)=>{
    socket = _socket;
}

export const send = (channel, message)=>{
    if (socket){
        socket.emit(channel, message);
    }
}