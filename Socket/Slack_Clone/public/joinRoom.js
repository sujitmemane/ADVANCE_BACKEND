const joinRoom = async (roomName, namespaceId) => {
  try {
    const ackRes = await nameSpacesSockets[namespaceId].emitWithAck(
      "joinRoom",
      { roomName, namespaceId }
    );

    document.querySelector(
      ".curr-room-text"
    ).innerHTML = `<span>${roomName}</span>`;
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${ackRes?.numUsers}-Users <span class="fa-solid fa-user"></span>`;

    const messages = document.querySelector("#messages");
    ackRes.thisRoomHistory.forEach((element) => {
      const htmlBuild = buildMessageHTML(element);
      messages.innerHTML += htmlBuild;
    });
  } catch (err) {
    console.error("Join room failed:", err);
  }
};
