/* eslint-disable @typescript-eslint/no-inferrable-types */
import { reaction } from 'mobx'
import { manager } from './Manager'
import Player from './Player'
import { State, store } from './Store'

const { ccclass, property } = cc._decorator

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

  // 星星指示器
  @property(cc.Node)
    leftIndicator:cc.Node = null

  @property(cc.Node)
    rightIndicator:cc.Node = null

  groundY:number = 0
  currentStar:cc.Node = null

  onLoad () {
    // 初始化状态
    this.renderState(State.NONE)
    // 获取地平面的y轴坐标
    this.groundY = this.ground.y + this.ground.height / 2
    // 初始化计时器
    store.timer = 0
    store.starDuration = 0
    // 监测计分
    reaction(
      () => store.score,
      (score:number) => {
        this.scoreDisplay.string = 'Score:' + score
      }
    )
  }

  // 根据游戏阶段修改按钮的显示隐藏 以及 enabled
  renderState (state:number) {
    switch (state) {
      case State.NONE:
        this.btnStart.active = true
        this.gameOverNode.active = false
        this.scoreDisplay.enabled = false
        this.leftIndicator.active = false
        this.rightIndicator.active = false
        this.enabled = false
        break
      case State.PLAYING:
        this.btnStart.active = false
        this.gameOverNode.active = false
        this.scoreDisplay.enabled = true
        this.enabled = true
        break
      case State.OVER:
        this.btnStart.active = true
        this.gameOverNode.active = true
        this.scoreDisplay.enabled = true
        this.enabled = false
        break
    }
  }

  gameStart () {
    this.renderState(State.PLAYING)
    // 初始化记分
    store.score = 0
    if (!this.player.enabled) {
      this.player.enabled = true
      this.player.startMoveAt(cc.v2(0, this.groundY))
    }
    // 生成新的star
    this.currentStar = manager.spawnNewStar(this)
    this.indicatorVisible(this.currentStar.position, this.player.node.position)
  }

  gameOver () {
    // 停止动作
    this.player.enabled = false
    this.currentStar.destroy()
    // 重新加载场景game
    this.renderState(State.OVER)
  }

  indicatorVisible (starPosition:cc.Vec2|cc.Vec3, playerPosition:cc.Vec2|cc.Vec3) {
    if (starPosition.x - playerPosition.x > this.node.width / 2) {
      this.rightIndicator.active = true
    } else if (playerPosition.x - starPosition.x > this.node.width / 2) {
      this.leftIndicator.active = true
    } else {
      this.leftIndicator.active = false
      this.rightIndicator.active = false
    }
  }

  update (dt: number) {
    // 每帧更新计时器，超过限度还没有生成新的星星就会调用游戏失败逻辑
    if (store.timer > store.starDuration) {
      this.gameOver()
      return
    }

    this.indicatorVisible(this.currentStar.position, this.player.node.position)
    store.timer += dt
  }
}
