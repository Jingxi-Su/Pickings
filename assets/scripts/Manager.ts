import Game from './Game'
import Star from './Star'
import { store } from './Store'

class Manager {
  /**
   * 生成新的星星
   * @param game 当前Game实例
   * @returns
   */
  spawnNewStar (game:Game) {
    const newStar = cc.instantiate(game.starPrefab)
    game.node.addChild(newStar)
    newStar.setPosition(this.getNewStarPosition(game))
    // 在星星脚本组件上保存 Game 对象的引用
    newStar.getComponent('Star').game = game
    store.starDuration = game.minStarDuration + Math.random() * (game.maxStarDuration - game.minStarDuration)
    store.timer = 0
    return newStar
  }

  /**
   * 给星星设置随机位置
   * @param game 当前Game实例
   * @returns
   */
  getNewStarPosition (game:Game) {
    let randX = 0
    const randY = game.groundY + Math.random() * game.player.jumpHeight + 50
    const maxX = game.node.width
    randX = game.player.node.position.x + (Math.random() - 0.5) * 2 * maxX
    return cc.v2(randX, randY)
  }

  /**
   * 摘除成功
   * @param game 当前Game实例
   * @param star 当前Star实例
   */
  onPicked (game:Game, star:Star) {
    star.destroyStar()
    this.spawnNewBoom(game, star)
    store.score += 1
    cc.audioEngine.playEffect(game.scoreAudio, false)
    game.currentStar = manager.spawnNewStar(game)
  }

  /**
   * 摘除成功后播放爆炸粒子效果
   * @param game 当前Game实例
   * @param star 当前Star实例
   */
  spawnNewBoom (game:Game, star:Star) {
    const newBoom = cc.instantiate(game.boomPrefab)
    game.node.addChild(newBoom)
    newBoom.setPosition(star.node.getPosition())
    const particleBoom = newBoom.getComponent(cc.ParticleSystem)
    return particleBoom.resetSystem()
  }
}

export const manager = new Manager()
