import BodyGenUtil from "../utils/BodyGenUtil";
import CreepMemoryUtil, { HarvestMemory, TaskDetail } from "../utils/CreepMemoryUtil";
import TargetUtil from "../../../utils/TargetUtil";

let RoomCenter = new Map

const HARVEST_SIZE = 4;
const WORK_SIZE = 5;
const TRANSFER_SIZE = 2;

export interface SpawnDetail {
  body: BodyPartConstant[];
  name: string;
  memory: HarvestMemory
}

export interface RoomDetail {
  isMine: boolean;
  creepNum: {
    harvest: number;
    work: number;
    transfer: number;
  }
  spawnTasks: {
    harvest: SpawnDetail[],
    work: SpawnDetail[],
    transfer: SpawnDetail[],
    defend: [],
    attack: []
  },
  creepTasks: {
    harvest: TaskDetail[],
    harvestIdx: number,
    work: TaskDetail[],
    transfer: TaskDetail[]
  },
}




export default {
  process: function() : boolean{
    // console.log('try update room details')
    updateRoomDetail()
    updateSpawnTask()
    return true
  },
  getDetail: function(roomName: string) :RoomDetail|null {
    try {
      return Game.rooms[roomName].memory.roomDetail
    } catch (e) {
      return null
    }
    // return RoomCenter.get(roomName)
  },
  receiveTask(creep: Creep, role: string): boolean {
    // console.log(creep.memory.room)
    let room: Room = Game.rooms[creep.memory.room]
    let detail: RoomDetail = room.memory.roomDetail
    if (role === 'harvest') {
      creep.memory.taskDetail = detail.creepTasks.harvest[detail.creepTasks.harvestIdx]
      detail.creepTasks.harvestIdx = (detail.creepTasks.harvestIdx + 1) % detail.creepTasks.harvest.length
      // TODO: 其他资源？
      let dst = TargetUtil.findTarget(room, RESOURCE_ENERGY)
      if (!dst) {
        // 尝试获取transfer的任务，然后运输
        let list = Game.rooms[creep.memory.room].memory.roomDetail.creepTasks.transfer
        if (list.length > 0) {
          let res = -1
          for (let i = 0; i < list.length; i++) {
            if (list[i].targetType === creep.memory.taskDetail.targetType) {
              console.log('尝试获取运输任务成功,', list[i].dst)
              creep.memory.taskDetail.dst = list[i].dst
              res = i
              break
            }
          }
          if (res !== -1) {
            Game.rooms[creep.memory.room].memory.roomDetail.creepTasks.transfer.splice(res, 1)
            creep.memory.hasTask = true
            return true
          }
        }
        console.log('creep', creep.memory.name, '没有发现目的地')
        return false
      }
      creep.memory.taskDetail.dst = dst
      creep.memory.hasTask = true
      return true
    } else if (role === 'work') {
      let task: TaskDetail|undefined = detail.creepTasks.work.shift()
      console.log(task)
      if (task) {
        creep.memory.taskDetail = task
        creep.memory.hasTask = true
        return true
      } else {
        return false
      }
    }
    return false
  }
}



/**
 * 更新房间task信息
 */
const updateSpawnTask = function() {
  for (let roomsKey in Game.rooms) {
    let value: RoomDetail = Game.rooms[roomsKey].memory.roomDetail
    if (!value.isMine) {
      return
    }
    if (value.creepNum.harvest + value.spawnTasks.harvest.length < HARVEST_SIZE) {
      tryAddHarvestTask(value, roomsKey)
    }
    if (value.creepNum.work + value.spawnTasks.work.length < WORK_SIZE) {
      tryAddWorkTask(value, roomsKey)
    }
    if (value.creepNum.transfer + value.spawnTasks.transfer.length < TRANSFER_SIZE) {
      tryAddTransferTask(value, roomsKey)
    }

    // TODO: 其他种类的creep

  }
}

function tryAddWorkTask(roomDetail: RoomDetail, roomName: string) {
  let task : SpawnDetail = {
    memory: CreepMemoryUtil.getWorkMemory('work' + Game.time, roomName),
    name: 'work' + Game.time,
    body: BodyGenUtil.getWorkBody(250)
  }
  roomDetail.spawnTasks.work.push(task)
}

function tryAddTransferTask(roomDetail: RoomDetail, roomName: string) {
  let task : SpawnDetail = {
    memory: CreepMemoryUtil.getTransferMemory('transfer' + Game.time, roomName),
    name: 'transfer' + Game.time,
    body: BodyGenUtil.getTransferBody(200)
  }
  roomDetail.spawnTasks.transfer.push(task)
}

function tryAddHarvestTask(roomDetail: RoomDetail, roomName: string) {
  let task : SpawnDetail = {
    memory: CreepMemoryUtil.getHarvestMemory('harvest' + Game.time, roomName),
    name: 'harvest' + Game.time,
    body: BodyGenUtil.getHarvestBody(250)
  }
  roomDetail.spawnTasks.harvest.push(task)
}

function initRoomResourceTasks(room: Room, detail: RoomDetail) {
  let sources: Source[] = room.find(FIND_SOURCES)
  sources.forEach(value => {
    let task: TaskDetail = {
      dst: null,
      src: value.id,
      targetType: RESOURCE_ENERGY
    }
    detail.creepTasks.harvest.push(task)
  })
  // TODO: 其他资源的读取
}

/**
 * 更新房间信息
 */
const updateRoomDetail = function() {
  for (let roomsKey in Game.rooms) {
    let room : Room = Game.rooms[roomsKey]
    if (!room.memory.init) {
      let detail : RoomDetail = {
        creepTasks: {
          harvest: [],
          harvestIdx: 0,
          work: [],
          transfer: []
        },
        creepNum: {
          harvest: 0,
          work: 0,
          transfer: 0
        },
        isMine: false,
        spawnTasks: {
          attack: [],
          defend: [],
          harvest: [],
          work: [],
          transfer: []
        }
      }
      // TODO: 初始化地图数据
      initRoomResourceTasks(room, detail)
      // change to room.memory
      room.memory.roomDetail = detail
      // RoomCenter.set(roomsKey, detail)
      room.memory.init = true
    } else {
      room.memory.roomDetail.isMine = !!(room.controller && room.controller.my)
      if (room.memory.roomDetail.isMine) {
        let cnt = [0, 0, 0]
        for (let creepsKey in Game.creeps) {
          let creep: Creep = Game.creeps[creepsKey]
          if (creep.memory.role === 'harvest') {
            cnt[0] += 1
          } else if (creep.memory.role === 'work') {
            cnt[1] += 1
          } else if (creep.memory.role === 'transfer') {
            cnt[2] += 1
          }
          // TODO: 其他类型creep
        }
        room.memory.roomDetail.creepNum.harvest = cnt[0]
        room.memory.roomDetail.creepNum.work = cnt[1]
        room.memory.roomDetail.creepNum.transfer = cnt[2]
      }
    }
  }
}
