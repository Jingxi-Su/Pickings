/* eslint-disable @typescript-eslint/no-inferrable-types */
import { reaction } from 'mobx'
import { starManager } from './StarManager'
import Player from './Player'
import { store } from './Store'

const { ccclass, property } = cc._decorator

/** 游戏主类，包括游戏不同阶段及主相机等 */
@ccclass
export default class Game extends cc.Component {
  /** 此属性引用了星星的预制资源 */
  @property(cc.Prefab)
    starPrefab: cc.Prefab = null

  /** 此属性引用了星星爆炸的预制资源 */
  @property(cc.Prefab)
    boomPrefab: cc.Prefab = null

  /** 地面节点，确定星星生成的高度 */
  @property(cc.Node)
    ground: cc.Node = null

  /** Player节点，获取主角弹跳的高度+控制主角行动开关 */
  @property(Player)
    player: Player = null

  /** score label的引用 */
  @property(cc.Label)
    scoreDisplay: cc.Label = null

  /** 得分音效资源 */
  @property(cc.AudioClip)
    scoreAudio: cc.AudioClip = null

  /** 游戏结束音效资源 */
  @property(cc.AudioClip)
    overAudio: cc.AudioClip = null

  /** 星星产生后消失时间的随机范围最大值 */
  @property
    maxStarDuration = 0

  /** 星星产生后消失时间的随机范围最小值 */
  @property
    minStarDuration = 0

  /** 按钮节点 */
  @property(cc.Node)
    btnStart: cc.Node = null

  /** gameOver的引用 */
  @property(cc.Node)
    gameOverNode: cc.Node = null

  /** 星星指示器-左 */
  @property(cc.Node)
    leftIndicator: cc.Node = null

  /** 星星指示器-右 */
  @property(cc.Node)
    rightIndicator: cc.Node = null

  /** 相机节点 */
  @property(cc.Node)
    mainCamera: cc.Node = null

  /** 相机跟随节点 */
  @property(cc.Node)
    uiContainer: cc.Node = null

  /** 地平面 */
  groundY: number = 0
  /** 当前星星节点 */
  currentStar: cc.Node = null

  onLoad () {
    this.setInitUI()
    this.groundY = this.ground.y + this.ground.height / 2
    store.timer = 0
    store.starDuration = 0
    reaction(
      () => store.score,
      (score: number) => {
        this.scoreDisplay.string = 'Score:' + score
      }
    )
  }

  setInitUI () {
    this.btnStart.active = true
    this.gameOverNode.active = false
    this.scoreDisplay.enabled = false
    this.leftIndicator.active = false
    this.rightIndicator.active = false
    this.enabled = false
  }

  /** 点击play按钮后触发 */
  private gameStart () {
    this.setPlayingUI()
    store.score = 0
    if (!this.player.enabled) {
      this.player.enabled = true
      this.player.startMove(cc.v2(0, this.groundY))
      this.updateCamera(true)
    }
    this.currentStar = starManager.spawnNewStar(this)
    this.indicatorVisible()
  }

  setPlayingUI () {
    this.player.setInputControl()
    this.btnStart.active = false
    this.gameOverNode.active = false
    this.scoreDisplay.enabled = true
    this.enabled = true
  }

  /** 游戏失败 */
  private gameOver () {
    this.player.enabled = false
    this.currentStar.destroy()
    cc.audioEngine.playEffect(this.overAudio, false)
    this.setOverUI()
  }

  setOverUI () {
    this.btnStart.active = true
    this.gameOverNode.active = true
    this.scoreDisplay.enabled = true
    this.leftIndicator.active = false
    this.rightIndicator.active = false
    this.enabled = false
  }

  /** 处理左右指示箭头的显示隐藏 */
  private indicatorVisible () {
    const starPosition = this.currentStar.position
    if (starPosition.x > cc.winSize.width / 2 + this.mainCamera.position.x) {
      this.rightIndicator.active = true
    } else if (starPosition.x < -cc.winSize.width / 2 + this.mainCamera.position.x) {
      this.leftIndicator.active = true
    } else {
      this.leftIndicator.active = false
      this.rightIndicator.active = false
    }
  }

  /** 相机跟随主角移动 */
  private updateCamera (restart?:boolean) {
    const playerPos = this.player.node.position
    const cameraPos = this.mainCamera.position
    const distance = cc.winSize.width / 2 - this.player.node.width
    if (restart) {
      cameraPos.x = playerPos.x
    } else {
      if (playerPos.x - cameraPos.x > distance) {
        cameraPos.x = playerPos.x - distance
      } else if (cameraPos.x - playerPos.x > distance) {
        cameraPos.x = playerPos.x + distance
      }
    }
    this.mainCamera.setPosition(cameraPos)
    this.uiContainer.setPosition(cameraPos.x, this.uiContainer.position.y, this.uiContainer.position.z)
  }

  /** 每帧更新计时器，超过限度还没有摘除星星就会调用游戏失败逻辑 */
  update (dt: number) {
    if (store.timer > store.starDuration) {
      this.gameOver()
      return
    }
    this.updateCamera()
    this.indicatorVisible()
    store.timer += dt
  }
}
