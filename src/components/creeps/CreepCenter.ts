import Harvest from "./runners/Harvest";
import Work from "./runners/Work";

export default {
  process: function(): boolean {
    for (let creepsKey in Game.creeps) {
      let creep: Creep = Game.creeps[creepsKey]
      if (creep.memory.role === 'harvest') {
        Harvest.run(creep)
      } else if (creep.memory.role === 'work') {
        Work.run(creep)
      }
    }
    return true
  }
}
