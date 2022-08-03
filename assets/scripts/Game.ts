import { observable } from 'mobx'
import Player from './Player'
import { store } from './Store'

const { ccclass, property } = cc._decorator

@observable
@ccclass
export default class Game extends cc.Component {
  // 此属性引用了星星的预制资源
  @property(cc.Prefab)
    starPrefab: cc.Prefab = null

  // 地面节点，确定星星生成的高度
  @property(cc.Node)
    ground: cc.Node = null

  // Player节点，获取主角弹跳的高度+控制主角行动开关
  @property(Player)
    player: Player = null

  // score label的引用
  @property(cc.Label)
    scoreDisplay: cc.Label = null

  // 得分音效资源
  @property(cc.AudioClip)
    scoreAudio: cc.AudioClip = null

  // 星星产生后消失时间的随机范围
  @property
    maxStarDuration = 0

  @property
    minStarDuration = 0

  // 按钮节点
  @property(cc.Node)
    btnStart: cc.Node = null

  // gameOver的引用
  @property(cc.Node)
    gameOverNode: cc.Node = null

  // 状态参数
  readonly NONE: number = 0 // 游戏未开始
  readonly PLAYING: number = 1 // 游戏进行中
  readonly OVER: number = 2 // 游戏结束

  groundY = 0

  onLoad () {
    // 初始化状态
    this.renderState(this.NONE)
    // 获取地平面的y轴坐标
    this.groundY = this.ground.y + this.ground.height / 2
    // 初始化计时器
    store.timer = 0
    store.starDuration = 0
  }

  // 根据游戏阶段修改按钮的显示隐藏 以及 enabled
  renderState (state:number) {
    switch (state) {
      case this.NONE:
        this.btnStart.active = true
        this.gameOverNode.active = false
        this.scoreDisplay.enabled = false
        this.enabled = false
        break
      case this.PLAYING:
        this.btnStart.active = false
        this.gameOverNode.active = false
        this.scoreDisplay.enabled = true
        this.enabled = true
        break
      case this.OVER:
        this.btnStart.active = true
        this.gameOverNode.active = true
        this.scoreDisplay.enabled = true
        this.enabled = false
        break
    }
  }

  gameStart () {
    // 初始化记分
    store.score = 0
    this.scoreDisplay.string = 'Score:' + store.score
    if (!this.player.enabled) {
      this.player.enabled = true
      this.player.startMoveAt(cc.v2(0, this.groundY))
    }
    // 生成新的star
    this.spawnNewStar()
    this.renderState(this.PLAYING)
  }

  spawnNewStar () {
    // 使用给定的模版在场景中生成一个新节点。instantiate() 用于克隆指定的任意类型的对象，或者从 Prefab 实例化出新节点，返回值为 Node 或者 Object
    const newStar = cc.instantiate(this.starPrefab)
    // 将新增的节点添加到Canvas节点下。addChild() 用于在节点下添加一个新的子节点，所以新节点在场景中的显示效果在该节点之上
    this.node.addChild(newStar)
    // 给星星设置随机位置，Node 下的 setPosition() 用于设置节点在父节点坐标系中的位置
    newStar.setPosition(this.getNewStarPosition())
    // 在星星脚本组件上保存 Game 对象的引用(starPrefab中存在Star组件)
    newStar.getComponent('Star').game = this
    // 重置计时器，根据消失时间范围随机取值
    store.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration)
    store.timer = 0
  }

  getNewStarPosition () {
    let randX = 0
    // 根据地平面位置和主角跳跃高度，随机得到一个星星的y坐标
    const randY = this.groundY + Math.random() * this.player.jumpHeight + 50
    // 根据屏幕宽度，随机得到一个星星的x坐标（原点在屏幕中心，所以需要/2）
    const maxX = this.node.width / 2
    randX = (Math.random() - 0.5) * 2 * maxX
    // 返回星星坐标，setPosition可以-1.传入两个数值 x 和 y；2.传入 cc.v2(x, y) 或 cc.v3(x, y, z)（类型为 cc.Vec2 或 cc.Vec3 的对象）
    return cc.v2(randX, randY)
  }

  gainScore () {
    store.score += 1
    // 更新scoreDisplay Label文字
    this.scoreDisplay.string = 'Score:' + store.score

    // 播放得分音效
    cc.audioEngine.playEffect(this.scoreAudio, false)
  }

  gameOver () {
    // 停止动作
    this.player.enabled = false
    // 重新加载场景game
    this.renderState(this.OVER)
  }

  update (dt: number) {
    // 每帧更新计时器，超过限度还没有生成新的星星就会调用游戏失败逻辑
    if (store.timer > store.starDuration) {
      this.gameOver()
      return
    }
    store.timer += dt
  }
}
