const sockets = [];

export const init = (_socket)=>{
 sockets.push(_socket);
 _socket.on("disconnect", ()=>{
    let i = sockets.indexOf(_socket);
    sockets.splice(i, 1);
 });
}

export const send = (channel, message)=>{
    for (const s of sockets){
        try{
            s.emit(channel, message);
        }catch(err){
            console.log(err);
        }
    }
}