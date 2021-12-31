const socket = io.connect();
const peer = new Peer();
let myVideoStream;
let myId;
var videoGrid;
var myvideo;

const peerConnections = {};

socket.on("message-to-client", (message) => {
  receiveMessage(message);
});


socket.on("connected-to-room", (room) => {
  const notification = `
        <div class="line"></div>
        <div class="info">${room}</div>
        <div class="line"></div>`;
  const notifi = document.createElement("div");
  notifi.setAttribute(
    "class",
    "notification connect d-flex flex-row align-items-center"
  );
  notifi.innerHTML = notification;
  document.querySelector("#message-box").appendChild(notifi);
});

socket.on("disconnected-from-room", (room) => {
  const notification = `
         <div class="line"></div>
         <div class="info">${room}</div>
         <div class="line"></div>`;
  const notifi = document.createElement("div");
  notifi.setAttribute(
    "class",
    "notification disconnect d-flex flex-row align-items-center"
  );
  notifi.innerHTML = notification;
  document.querySelector("#message-box").appendChild(notifi);
});

window.onload = () => {
  document.querySelector("#input-text").addEventListener("keyup", (event) => {
    if (event.keyCode == 13) {
      sendMessage();
    }
    event.preventDefault();
  });
  document.querySelector("#input-text2").addEventListener("keyup", (event) => {
    if (event.keyCode == 13) {
      joinRoom();
    }
    event.preventDefault();
  });
  videoGrid = document.getElementById("videoDiv");
  myvideo = document.createElement("video");
  myvideo.muted = true;
};



function joinRoom() {
  const room = document.querySelector("#input-text2").value;
  socket.emit("connect-to-room", room);
}

function leaveRoom() {
  const room = document.querySelector("#input-text2").value;
  if (room) {
    socket.emit("leave-room", room);
  }
  document.querySelector("#input-text2").value = "";
}

function receiveMessage(data) {
  const baloon = document.createElement("div");
  baloon.setAttribute("class", "baloon receive d-flex flex-column");
  const name = document.createElement("span");
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
  const name = document.createElement("span");
  name.classList.add("name");
  name.innerText = socket.id;
  const message = document.createElement("span");
  message.classList.add("message");
  message.innerText = msg;
  baloon.appendChild(name);
  baloon.appendChild(message);
  document.querySelector("#message-box").appendChild(baloon);
  const room = document.querySelector("#input-text2").value;
  socket.emit("message-to-server", { msg: msg, room: room });
  document.querySelector("#input-text").value = "";
}


function addVideo(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGrid.append(video);
  }

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideo(myvideo, stream);
    peer.on("call", (call) => {
      call.answer(stream);
      const vid = document.createElement("video");
      call.on("stream", (userStream) => {
        addVideo(vid, userStream);
      });
      call.on("error", (err) => {
        alert(err);
      });
      call.on("close", () => {
        console.log(vid);
        vid.remove();
      });
      peerConnections[call.peer] = call;
      console.log(peerConnections)
    });
  })
  .catch((err) => {
    alert(err.message);
  });
  peer.on("open", (id) => {
    
    myId = id;
    
  });
function sendCall() {
    const room = document.querySelector("#input-text2").value;
    socket.emit("newUser", myId, room);
}

peer.on("error", (err) => {
  alert(err.type);
});

socket.on("userJoined", (id) => {
  console.log("new user joined");
  const call = peer.call(id, myVideoStream);
  const vid = document.createElement("video");
  call.on("error", (err) => {
    alert(err);
  });
  call.on("stream", (userStream) => {
    addVideo(vid, userStream);
  });
  call.on("close", () => {
    vid.remove();
    console.log("user disconect");
  });
  peerConnections[id] = call;
});

socket.on("userDisconnect", (id) => {
  if (peerConnections[id]) {
    peerConnections[id].close();
  }
});
