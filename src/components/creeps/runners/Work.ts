import TaskService from "../tasks/TaskService";
import TargetUtil from "../../../utils/TargetUtil";



export default {
  run: function(creep: Creep): boolean {
    if (!creep.memory.hasTask) {
      let res = TaskService.receiveTask(creep, creep.memory.role)
      return res
    } else {
      if (!creep.memory.task) {
        creep.memory.task = workTask
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

function workTask(creep: Creep): boolean {
  // 先获取资源
  // @ts-ignore
  if (!creep.memory.hasPower) {
    // @ts-ignore
    if (creep.store[creep.memory.taskDetail?.targetType] > creep.store.getFreeCapacity(creep.memory.taskDetail?.targetType)) {
      // @ts-ignore
      creep.memory.hasPower = true
    }
    // @ts-ignore
    if (!creep.memory.taskDetail.src) {
      // @ts-ignore
      let id = TargetUtil.findStorageTarget(Game.rooms[creep.memory.room], creep.memory.taskDetail.targetType)
      if (id) {
        // @ts-ignore
        creep.memory.taskDetail.src = id
      } else {
        // @ts-ignore
        if (!creep.memory.submitRequest) {
          Memory.rooms[creep.memory.room].roomDetail.creepTasks.transfer.push({
                  dst: creep.id,
                  src: null,
                  // @ts-ignore
                  targetType: creep.memory.taskDetail.targetType
                })
          // @ts-ignore
          creep.memory.submitRequest = true
        }
      }
    }
    try {
      // @ts-ignore
      let obj = Game.getObjectById(creep.memory.taskDetail.src)
      // @ts-ignore
      let num = Math.min(creep.store.getFreeCapacity(creep.memory.taskDetail.targetType, obj.store[creep.memory.taskDetail.targetType]))
      // @ts-ignore
      if (creep.withdraw(obj, creep.memory.taskDetail.targetType, num) !== OK) {
        // @ts-ignore
        creep.moveTo(obj.pos)
      } else {
        // @ts-ignore
        creep.memory.hasPower = true
      }
    } catch (e) {
      console.log('work任务错误:', e)
    }
    return false
  } else {
    if (creep.memory.taskDetail?.taskType === 'build') {
      // @ts-ignore
      let obj = Game.getObjectById(creep.memory.taskDetail?.dst)
      if (!obj) {
        console.log('建造完成:', creep.memory.taskDetail?.dst)
        return true
      }
      // @ts-ignore
      if (creep.build(obj) !== OK) {
        // @ts-ignore
        creep.moveTo(obj.pos)
      }
      if (creep.store[creep.memory.taskDetail.targetType] === 0) {
        // @ts-ignore
        creep.memory.hasPower = false
        // @ts-ignore
        creep.memory.submitRequest = false
      }
    }
  }
  return false
}
