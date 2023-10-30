export default {
  /**
   * 计算总能量
   * @param body body模块
   */
  calculateEnergy(body: BodyPartConstant[]): number {
    let sum = 0
    body.forEach(value => {
      sum += value == MOVE ? 50 :
        value == WORK ? 100 :
          value == CARRY ? 50 :
            value == ATTACK ? 80 :
              value == RANGED_ATTACK ? 150 :
                value == HEAL ? 250 :
                  value == CLAIM ? 600 :
                    value == TOUGH ? 10 : 0;
    })
    return sum
  },
  /**
   * 获取收获者的能量对应的身体结构
   * @param energy 能量数量
   */
  getHarvestBody: function(energy: number) : BodyPartConstant[] {
    if (energy > 100 && energy < 200){
      return [WORK, MOVE, CARRY]
    } else {
      return [WORK, MOVE, CARRY, CARRY]
    }
  },
  /**
   * 获取工作者的能量对应的身体结构
   * @param energy 能量数量
   */
  getWorkBody: function(energy: number) : BodyPartConstant[] {
    if (energy > 100 && energy < 200){
      return [WORK, MOVE, CARRY]
    } else {
      return [WORK, MOVE, CARRY, CARRY]
    }
  },
  /**
   * 获取运输者的能量对应的身体结构
   * @param energy 能量数量
   */
  getTransferBody: function(energy: number) : BodyPartConstant[] {
    if (energy > 100 && energy < 200){
      return [MOVE, CARRY]
    } else {
      return [MOVE, MOVE, CARRY, CARRY]
    }
  }
}
