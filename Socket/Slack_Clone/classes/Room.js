class Room {
  constructor(roomId, roomTitle, namespaceId, privateRoom = false) {
    this.roomId = roomId;
    this.roomTitle = roomTitle;
    this.namespaceId = namespaceId;
    this.privateRoom = privateRoom;
    this.history = [];
  }

  addMessage(mss) {
    this.history.push(mss);
  }
  clearHistory(mss) {
    this.history = [];
  }
}

export default Room;
