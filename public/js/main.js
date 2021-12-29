function sendMessage(){
    const msg = document.querySelector("#input-text").value;
    const baloon = document.createElement("div");
    baloon.setAttribute("class","baloon sent d-flex flex-column");
    const name = document.createElement('span');
    name.classList.add("name");
    name.innerText="Sender";
    const message = document.createElement("span");
    message.classList.add("message");
    message.innerText=msg;
    baloon.appendChild(name);
    baloon.appendChild(message);
    document.querySelector("#message-box").appendChild(baloon);
}