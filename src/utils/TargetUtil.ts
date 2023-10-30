export default {
  findTarget(room: Room, resourceType: ResourceConstant): Id<Source|StructureSpawn|StructureExtension|StructureStorage>|null {
    let list = room.find(FIND_STRUCTURES)
    // console.log(list)
    for (let i = 0; i < list.length; i++) {
      let obj: AnyStructure = list[i]
      let store_ = null
      if ("store" in obj) {
        store_ = obj.store;
      }
      // console.log(obj)
      // console.log(obj.structureType === STRUCTURE_SPAWN)

      if ((obj.structureType === STRUCTURE_SPAWN ||
          obj.structureType === STRUCTURE_EXTENSION ||
          obj.structureType === STRUCTURE_STORAGE) &&
          (store_ && store_.getFreeCapacity(resourceType) > 0)) {
        return obj.id
      }
    }
    return null
  },
  findStorageTarget(room: Room, resourceType: ResourceConstant): Id<any>|null {
    let list = room.find(FIND_STRUCTURES)
    // console.log(list)
    for (let i = 0; i < list.length; i++) {
      let obj: AnyStructure = list[i]
      let store_ = null
      if ("store" in obj) {
        store_ = obj.store;
      }
      // console.log(obj)
      // console.log(obj.structureType === STRUCTURE_SPAWN)

      if ((obj.structureType === STRUCTURE_CONTAINER ||
        obj.structureType === STRUCTURE_STORAGE) &&
        (store_ && store_.getFreeCapacity(resourceType) > 0)) {
        return obj.id
      }
    }
    return null
  }
}
