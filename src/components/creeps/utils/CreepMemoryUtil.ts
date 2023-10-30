export interface TaskDetail {
  src: Id<Source>|null,
  dst: Id<any>|null,
  targetType: ResourceConstant,
  taskType? :string;
}

export interface HarvestMemory {
  name: string;
  room: string;
  role: string;
  hasTask: boolean;
  taskDetail: TaskDetail | null;
  task: ((creep: Creep) => boolean) | null;
}

export interface WorkMemory {
  name: string;
  room: string;
  role: string;
  hasTask: boolean;
  taskDetail: TaskDetail | null;
  taskType: string;
  task: ((creep: Creep) => boolean) | null;
}

export interface TransferMemory {
  name: string;
  room: string;
  role: string;
  hasTask: boolean;
  taskDetail: TaskDetail | null;
  task: ((creep: Creep) => boolean) | null;
}


export default {
  getHarvestMemory: function(name: string, room: string): HarvestMemory {
    return {
      name: name,
      room: room,
      role: 'harvest',
      task: null,
      hasTask: false,
      taskDetail: null
    }
  },
  getWorkMemory: function(name: string, room: string): WorkMemory {
    return {
      name: name,
      room: room,
      role: 'work',
      task: null,
      hasTask: false,
      taskDetail: null,
      taskType: ''
    }
  },
  getTransferMemory: function(name: string, room: string): TransferMemory {
    return {
      name: name,
      room: room,
      role: 'transfer',
      task: null,
      hasTask: false,
      taskDetail: null
    }
  },
}
