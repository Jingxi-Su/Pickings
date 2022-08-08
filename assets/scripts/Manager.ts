import Game from './Game'
import Star from './Star'
import { store } from './Store'

class Manager {
  spawnNewStar (game:Game) {
    // 使用给定的模版在场景中生成一个新节点
    const newStar = cc.instantiate(game.starPrefab)
    // 将新增的节点添加到Canvas节点下
    game.node.addChild(newStar)
    // 给星星设置随机位置
    newStar.setPosition(this.getNewStarPosition(game))
    // 在星星脚本组件上保存 Game 对象的引用(starPrefab中存在Star组件)
    newStar.getComponent('Star').game = game
    // 重置计时器，根据消失时间范围随机取值
    store.starDuration = game.minStarDuration + Math.random() * (game.maxStarDuration - game.minStarDuration)
    store.timer = 0
    return newStar
  }

  getNewStarPosition (game:Game) {
    let randX = 0
    // 根据地平面位置和主角跳跃高度，随机得到一个星星的y坐标
    const randY = game.groundY + Math.random() * game.player.jumpHeight + 50
    // 根据屏幕宽度，随机得到一个星星的x坐标
    const maxX = game.node.width
    randX = game.player.node.position.x + (Math.random() - 0.5) * 2 * maxX
    // 返回星星坐标
    return cc.v2(randX, randY)
  }

  onPicked (game:Game, star:Star) {
    star.destroyStar()
    this.spawnNewBoom(game, star)
    store.score += 1
    cc.audioEngine.playEffect(game.scoreAudio, false)
    game.currentStar = manager.spawnNewStar(game)
  }

  spawnNewBoom (game:Game, star:Star) {
    const newBoom = cc.instantiate(game.boomPrefab)
    game.node.addChild(newBoom)
    newBoom.setPosition(star.node.getPosition())
    const particleBoom = newBoom.getComponent(cc.ParticleSystem)
    return particleBoom.resetSystem()
  }
}

export const manager = new Manager()
