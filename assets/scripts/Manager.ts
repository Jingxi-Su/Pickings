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
    // 根据屏幕宽度，随机得到一个星星的x坐标（原点在屏幕中心，所以需要/2）
    // const maxX = game.node.width / 2
    const maxX = game.node.width
    randX = (Math.random() - 0.5) * 2 * maxX
    // 返回星星坐标，setPosition可以-1.传入两个数值 x 和 y；2.传入 cc.v2(x, y) 或 cc.v3(x, y, z)（类型为 cc.Vec2 或 cc.Vec3 的对象）
    return cc.v2(randX, randY)
  }

  onPicked (game:Game, star:Star) {
    game.currentStar = manager.spawnNewStar(game)
    store.score += 1
    cc.audioEngine.playEffect(game.scoreAudio, false)
    // 销毁当前星星，通过 node.destroy() 函数，可以销毁节点
    star.destroyStar()
  }
}

export const manager = new Manager()
