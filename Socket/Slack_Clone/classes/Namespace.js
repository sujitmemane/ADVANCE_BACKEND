class Namespace {
  constructor(id, name, image, path) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.path = path;
    this.rooms = [];
  }

  addRoom(roomObj) {
    this.rooms.push(roomObj);
  }
}

export default Namespace;
