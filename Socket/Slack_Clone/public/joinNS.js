const joinNS = (element, nsData) => {
  const nsEndPoint = element.getAttribute("ns");
  const clickedNs = nsData.find((ns) => ns.path === nsEndPoint);
  selectedNsId = clickedNs?.id;
  const rooms = nsData.find((ns) => ns.path === nsEndPoint).rooms;
  const roomList = document.querySelector(".room-list");
  roomList.innerHTML = "";
  let firstRoom = "";
  rooms.forEach((r, i) => {
    if (i === 0) {
      firstRoom = r.roomTitle;
    }
    roomList.innerHTML += `<li namespaceId=${
      r.namespaceId
    } class="room"><span class="glyphicon glyphicon-lock fa-${
      r.privateRoom ? "lock" : "globe"
    }"></span>${r.roomTitle} </li>`;
  });

  joinRoom(firstRoom, clickedNs.id);

  const roomNodes = document.querySelectorAll(".room");
  Array.from(roomNodes).forEach((r) => {
    r.addEventListener("click", (e) => {
      const namespaceId = r.getAttribute("namespaceId");
      console.log("Someone clicked on " + e.target.innerText);
      joinRoom(e.target.innerText, namespaceId);
    });
  });
};
