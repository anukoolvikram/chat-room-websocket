import { WebSocketServer, WebSocket } from "ws";

// const app=express()
const wss=new WebSocketServer({port:8080})

// app.post('/', ()=>{
// })

// let userCount=0

interface User{
    socket: WebSocket;
    room: String;
}

let allSockets: User[]=[];

wss.on('connection', (socket)=>{
    // allSockets.push(socket)
    // userCount++;
    // console.log('user connected'+ userCount);

    socket.on("message", (message)=>{
        // console.log("message from user " + message.toString())
        // for(let s of allSockets){
        //     s.send(message.toString()+" message from server")
        // }
        const parsedMessage=JSON.parse(message as unknown as string);

        if(parsedMessage.type=='join'){
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type=='chat'){

            // finding room
            let currRoom:String;
            allSockets.forEach((s)=>{
                if(s.socket==socket){
                    currRoom=s.room;
                }
            })

            // sending message to all in same room
            allSockets.forEach(s=>{
                if(s.room==currRoom){
                    s.socket.send(parsedMessage.payload.message)
                }
            })
        }
    })

    // socket.on('disconnect', ()=>{
    //     allSockets.filter((s)=>{s!=socket});
    // })
})