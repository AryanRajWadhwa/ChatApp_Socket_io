
// Your code here
const socket = io();

let textarea = document.querySelector("#messageInp")
let name;
let messageArea = document.querySelector(".container")
var audio = new Audio('/ting.mp3');

do {
    name = prompt('Please enter your name:');
} while (!name)

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
})

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }

    //Append
    appendMessage(msg, 'right')

    //Send to server
    socket.emit('message', msg)
    textarea.value = ''
    scrollToBottom()
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
      <h4>${msg.user}</h4>
      <p>${msg.message}</p>`

    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
    if(type == 'left')
    {
        audio.play();
    }

}

//Recieving

socket.on('message', (msg) => {
    appendMessage(msg, 'left');
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}


socket.emit('new-user-joined', name)

socket.on('user-joined', nam => {
    let msg = {
        user: "admin",
        message: `${nam} joined the chat`
    }

    appendMessage(msg, 'right')
})

socket.on('left',nam => {
    let msg = {
        user: "admin",
        message: `${nam} left the chat`
    }
    appendMessage(msg,'left');
})


