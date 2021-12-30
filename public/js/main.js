const socket = io.connect();

socket.on('message-to-client',(message)=>{
    receiveMessage(message);
})

socket.on('connected-to-room',(room)=>{
   const notification=`
        <div class="line"></div>
        <div class="info">${room}</div>
        <div class="line"></div>`
    const notifi=document.createElement('div');
    notifi.setAttribute('class','notification connect d-flex flex-row align-items-center');
    notifi.innerHTML=notification;
    document.querySelector("#message-box").appendChild(notifi);
})

socket.on('disconnected-from-room',(room)=>{
    const notification=`
         <div class="line"></div>
         <div class="info">${room}</div>
         <div class="line"></div>`
     const notifi=document.createElement('div');
     notifi.setAttribute('class','notification disconnect d-flex flex-row align-items-center');
     notifi.innerHTML=notification;
     document.querySelector("#message-box").appendChild(notifi);
 })

window.onload = ()=>{
    document.querySelector("#input-text").addEventListener('keyup',(event)=>{
        if(event.keyCode==13){
            sendMessage();
        }
        event.preventDefault();
    })
    document.querySelector("#input-text2").addEventListener('keyup',(event)=>{
        if(event.keyCode==13){
            joinRoom();
        }
        event.preventDefault();
    })
}

function joinRoom(){
    const room = document.querySelector("#input-text2").value;
    socket.emit('connect-to-room',room)
}

function leaveRoom(){
    const room = document.querySelector("#input-text2").value;
    if(room){
        socket.emit('leave-room',room);
    }
    document.querySelector("#input-text2").value="";
}



function receiveMessage(data){
    const baloon = document.createElement("div");
    baloon.setAttribute("class", "baloon receive d-flex flex-column");
    const name = document.createElement('span');
    name.classList.add("name");
    name.innerText = data.name;
    const message = document.createElement("span");
    message.classList.add("message");
    message.innerText = data.msg;
    baloon.appendChild(name);
    baloon.appendChild(message);
    document.querySelector("#message-box").appendChild(baloon);
}



function sendMessage() {
    const msg = document.querySelector("#input-text").value;
    const baloon = document.createElement("div");
    baloon.setAttribute("class", "baloon sent d-flex flex-column");
    const name = document.createElement('span');
    name.classList.add("name");
    name.innerText = socket.id;
    const message = document.createElement("span");
    message.classList.add("message");
    message.innerText = msg;
    baloon.appendChild(name);
    baloon.appendChild(message);
    document.querySelector("#message-box").appendChild(baloon);
    const room = document.querySelector("#input-text2").value;
    socket.emit("message-to-server",{msg:msg,room:room});
    document.querySelector("#input-text").value="";
}

