import Game from './Game'
import Player from './Player'

const { ccclass, property } = cc._decorator

@ccclass
export default class NewClass extends cc.Component {
  @property(Player)
    player:Player = null

  // 按钮节点
  @property(cc.Node)
    uiContainer:cc.Node

  update (dt) {
    const playerPos = this.player.node.position
    const cameraPos = this.node.position
    const distance = cc.winSize.width / 2 - this.player.node.width
    if (playerPos.x - cameraPos.x > distance) {
      cameraPos.x = playerPos.x - distance
    } else if (cameraPos.x - playerPos.x > distance) {
      cameraPos.x = playerPos.x + distance
    }
    this.node.setPosition(cameraPos)
    this.uiContainer.setPosition(cameraPos.x, this.uiContainer.position.y, this.uiContainer.position.z)
  }
}
