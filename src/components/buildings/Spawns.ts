import BodyGenUtil from "../creeps/utils/BodyGenUtil";
import CreepMemoryUtil, { TaskDetail } from "../creeps/utils/CreepMemoryUtil";
import TaskService, { RoomDetail, SpawnDetail } from "../creeps/tasks/TaskService";

const Version = '1.0.1'

interface SpawnMemory {
  uuid: string;
  maxEnergy: number;
  curEnergy: number;
}

let SpawnMap = new Map


/**
 * 生成生产者
 * @param spawn
 * @param task
 */
const genCreep = function(spawn: StructureSpawn, task: SpawnDetail): boolean  {
  let needEnergy = BodyGenUtil.calculateEnergy(task.body)
  // TODO: spawn可用的energy可能不止这个store
  // console.log(needEnergy, spawn.room.energyAvailable)
  if (needEnergy > spawn.room.energyAvailable) {
    // 优先等到harvest全部创建完毕
    return true
  }

  let res = spawn.spawnCreep(task.body, task.name, {
    memory: task.memory
  })

  if (res == OK) {
    return true
  } else {
    console.log('spawn', spawn.name, '生产意外：', res)
    return false
  }
}


export default {
  /**
   * 添加Spawn
   * @param spawn
   */
  addSpawn: function(spawn: StructureSpawn): boolean {
    let idx = spawn.room.name
    let room = SpawnMap.get(idx)
    if (!room) {
      room = new Map
    }
    if (room.has(spawn.id)) {
      return false
    }
    room.set(spawn.id, spawn)
    SpawnMap.set(idx, spawn)
    return true
  },
  doProcess: function(spawns: { [p: string]: StructureSpawn }):boolean {
    // updateSpawnList
    for (let spawnsKey in spawns) {
      let detail: RoomDetail|null = TaskService.getDetail(spawns[spawnsKey].room.name)
      if (!detail) {
        console.log('没有detail:', spawnsKey)
        continue
      }

      if (detail.spawnTasks.harvest.length > 0 &&
        genCreep(spawns[spawnsKey], detail.spawnTasks.harvest[0])) {
        detail.spawnTasks.harvest.shift()
      } else if (detail.spawnTasks.work.length > 0 &&
        genCreep(spawns[spawnsKey], detail.spawnTasks.work[0])) {
        detail.spawnTasks.work.shift()
      } else if (detail.spawnTasks.transfer.length > 0 &&
        genCreep(spawns[spawnsKey], detail.spawnTasks.transfer[0])) {
        detail.spawnTasks.transfer.shift()
      }
      // TODO: 其他任务的创建
    }
    return true
  }
}
