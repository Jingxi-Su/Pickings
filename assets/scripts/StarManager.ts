import Game from './Game'
import Star from './Star'
import { store } from './Store'

/** 星星管理类，包括星星的生成、收集以及收集完成后的爆炸效果等 */
class StarManager {
  /**
   * 生成新的星星
   * @param game 当前Game实例
   * @returns
   */
  public spawnNewStar (game: Game):cc.Node {
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
  private getNewStarPosition (game: Game):cc.Vec2 {
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
  public onPicked (game: Game, star: Star) {
    star.node.destroy()
    this.spawnNewBoom(game, star)
    store.score += 1
    cc.audioEngine.playEffect(game.scoreAudio, false)
    game.currentStar = this.spawnNewStar(game)
  }

  /**
   * 摘除成功后播放爆炸粒子效果
   * @param game 当前Game实例
   * @param star 当前Star实例
   */
  private spawnNewBoom (game: Game, star: Star) {
    const newBoom = cc.instantiate(game.boomPrefab)
    game.node.addChild(newBoom)
    newBoom.setPosition(star.node.getPosition())
    const particleBoom = newBoom.getComponent(cc.ParticleSystem)
    return particleBoom.resetSystem()
  }
}

export const starManager = new StarManager()
