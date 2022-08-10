import Game from './Game'
import { starManager } from './StarManager'
import { store } from './Store'

const { ccclass, property } = cc._decorator

/** 星星类，包括判定星星是否被收集 */
@ccclass
export default class Star extends cc.Component {
  /** 星星和主角之间的距离小于这个数值时，就会完成收集 */
  @property
    pickRadius = 0

  game: Game = null
  /** 根据Player节点位置判断距离 */
  private getPlayerDistance ():number {
    const playerPos = this.game.player.node.position
    const dist = this.node.position.sub(playerPos).mag()
    return dist
  }

  /** 每帧判断星星和主角之间的距离是否小于收集距离并且更新透明度和进度条 */
  update () {
    if (this.getPlayerDistance() < this.pickRadius) {
      starManager.onPicked(this.game, this)
      return
    }

    const opacityRatio = 1 - store.timer / store.starDuration
    const minOpacity = 50
    this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity))

    const progressBar = this.node.getComponent(cc.ProgressBar)
    progressBar.progress = opacityRatio
  }
}
