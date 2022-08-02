import { store } from "./Store";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

  @property
  // 星星和主角之间的距离小于这个数值时，就会完成收集
  pickRadius: number = 0

  game = null

  getPlayerDistance() {
    // 根据Player节点位置判断距离
    const playerPos = this.game.player.getPosition()
    // 根据两点位置计算两点之间的距离
    const dist = this.node.position.sub(playerPos).mag()
    return dist
  }

  onPicked() {
    // 当星星被收集时，调用Game脚本中的接口，生成一个新的星星
    this.game.spawnNewStar()
    // 调用Game脚本的得分方法
    this.game.gainScore()
    // 销毁当前星星，通过 node.destroy() 函数，可以销毁节点
    this.node.destroy()
  }

  start() {

  }

  update(dt: number) {
    // 每帧判断星星和主角之间的距离是否小于收集距离
    if (this.getPlayerDistance() < this.pickRadius) {
      this.onPicked()
      return
    }

    // 根据Game脚本中的计时器更新星星的透明度
    const opacityRatio = 1 - store.timer / store.starDuration
    const minOpacity = 50
    this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity))
  }
}
