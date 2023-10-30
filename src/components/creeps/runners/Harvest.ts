import TaskService, { RoomDetail } from "../tasks/TaskService";
import { TaskDetail } from "../utils/CreepMemoryUtil";


export default {
  run: function(creep: Creep): boolean {
    if (!creep.memory.hasTask) {
      let res = TaskService.receiveTask(creep, creep.memory.role)
      return res
    } else {
      if (!creep.memory.task) {
        creep.memory.task = harvestTask
      }
      let res = creep.memory.task(creep)
      // 已经完成任务
      if (res) {
        creep.memory.hasTask = false
      }
      return true
    }
  }
}

const harvestTask = function(creep: Creep): boolean {
  let detail: TaskDetail|null|undefined = creep.memory.taskDetail;
  if (!detail) {
    return false
  }
  if (creep.store.getFreeCapacity() > 0) {
    let src = detail.src
    if (!src) return false
    let srcObj = Game.getObjectById(src)
    if (!srcObj) return false
    if (creep.harvest(srcObj) === OK) {
      return false
    } else {
      let srcPos = getObjPos(src)
      if (!srcPos) return false
      creep.moveTo(srcPos)
    }
  } else {
    let dst = detail.dst
    if (!dst) return false
    let dstObj = Game.getObjectById(dst)
    if (!dstObj) return false

    let transferNum = creep.store[detail.targetType]
    try {
      if ("store" in dstObj) {
        transferNum = Math.min(transferNum, <number>dstObj.store.getFreeCapacity(detail.targetType));
        if (<number>dstObj.store.getFreeCapacity(detail.targetType) === 0) {
          return true
        }
      }
    } catch (e) {
      console.log('dstObj比较大小错误', e)
    }
    // @ts-ignore
    if (creep.transfer(dstObj, detail.targetType, transferNum) === OK) {
      return true
    } else {
      let dstPos = getObjPos(dst)
      if (!dstPos) return false
      creep.moveTo(dstPos)
    }
  }
  return false
}

const getObjPos = function(id: string & Tag.OpaqueTag<Source | StructureSpawn | StructureExtension | StructureStorage>): RoomPosition | null {
  let obj = Game.getObjectById(id)
  if (!obj) {
    return null
  }
  let pos = obj.pos
  return pos
}
