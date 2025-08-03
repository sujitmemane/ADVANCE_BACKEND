const username = "Sujit";
const password = "X";

const clientOptions = {
  query: {
    username,
    password,
  },
  auth: {
    username,
    password,
  },
};

const socket = io("http://localhost:4000", clientOptions);

socket.on("connect", () => {
  console.log("Connected");
  socket.emit("clientConnected");
});

socket.on("welcome", (data) => {
  console.log(data);
});

socket.on("welcomeToChatRoom", (data) => {
  console.log(data, "Connected to chat room");
});

const nameSpacesSockets = [];
const listeners = {
  nsChange: [],
  messageToRoom: [],
};

let selectedNsId = 0;

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const newMessage = document.querySelector("#user-message").value;

  nameSpacesSockets[selectedNsId].emit("newMessageToRoom", {
    newMessage,
    data: Date.now(),
    username: "sujitmemane",
    avatar: "https://avatar.iran.liara.run/public/1",
    selectedNsId,
  });

  console.log(newMessage, selectedNsId);
});

const addListener = (nsId) => {
  if (!listeners.nsChange[nsId]) {
    nameSpacesSockets[nsId].on("nsChange", (data) => {
      console.log("Namespace changed");
      console.log(data);
    });
    listeners.nsChange[nsId] = true;
  }

  if (!listeners.messageToRoom[nsId]) {
    nameSpacesSockets[nsId].on("messageToRoom", (data) => {
      console.log(data);
      const htmlBuild = buildMessageHTML(data);

      document.querySelector("#messages").innerHTML += htmlBuild;

      listeners.messageToRoom[nsId] = true;
    });
  }
};
socket.on("nsList", (nsData) => {
  console.log(nsData);
  const namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";

  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.path}">${ns.name}</div>`;

    let thisNs = nameSpacesSockets[ns.id];
    if (!nameSpacesSockets[ns.id]) {
      thisNs = io(`http://localhost:4000${ns.path}`);
    }
    nameSpacesSockets[ns.id] = thisNs;

    addListener(ns?.id);

    thisNs.on("welcomeToChatRoom", (data) => {
      console.log(data, "Connected to chat room");
    });

    ns.socket = thisNs;
  });

  Array.from(document.getElementsByClassName("namespace")).forEach(
    (element) => {
      element.addEventListener("click", () => {
        joinNS(element, nsData);
      });
    }
  );

  joinNS(document.getElementsByClassName("namespace")[0], nsData);
});

const buildMessageHTML = (data) => {
  return ` <li>
                    <div class="user-image">
                        <img width="50px" src=${data?.avatar}/>
                    </div>
                    <div class="user-message">
                        <div class="user-name-time">${data?.username}<span>
  ${
    data?.data
      ? new Date(Number(data.data)).toLocaleDateString("en-IN", {})
      : "Invalid date"
  }
</span>
</div>
                        <div class="message-text">${data?.newMessage}</div>
                    </div>
                </li>`;
};
