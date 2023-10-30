export default {
  process: function(): boolean{
    if (Game.time % 10 !== 0) return false
    for (let roomsKey in Game.rooms) {
      let room: Room = Game.rooms[roomsKey]
      let list = room.find(FIND_CONSTRUCTION_SITES)
      // console.log('建筑list', list)
      list.forEach(value => {
        room.memory.roomDetail.creepTasks.work.push({
          dst: value.id,
          src: null,
          targetType: RESOURCE_ENERGY,
          taskType: "build"
        })
      })
    }
    return true
  }
}
