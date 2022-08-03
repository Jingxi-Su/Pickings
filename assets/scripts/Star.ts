import Game from './Game'
import { manager } from './Manager'
import { store } from './Store'

const { ccclass, property } = cc._decorator

@ccclass
export default class Star extends cc.Component {
  @property
  // 星星和主角之间的距离小于这个数值时，就会完成收集
    pickRadius = 0

  game:Game = null

  getPlayerDistance () {
    // 根据Player节点位置判断距离
    const playerPos = this.game.player.node.position
    // 根据两点位置计算两点之间的距离
    const dist = this.node.position.sub(playerPos).mag()
    return dist
  }

  destroyStar () {
    this.node.destroy()
  }

  update (dt: number) {
    // 每帧判断星星和主角之间的距离是否小于收集距离
    if (this.getPlayerDistance() < this.pickRadius) {
      manager.onPicked(this.game, this)
      return
    }
    // 根据Game脚本中的计时器更新星星的透明度
    const opacityRatio = 1 - store.timer / store.starDuration
    const minOpacity = 50
    this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity))
    if (this.node.opacity === minOpacity) {
      this.node.destroy()
    }
  }
}
