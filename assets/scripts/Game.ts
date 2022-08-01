
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

  // 此属性引用了星星的预制资源
  @property(cc.Prefab)
  starPrefab: cc.Prefab = null;

  // 地面节点，确定星星生成的高度
  @property(cc.Node)
  ground: cc.Node = null;

  //Player节点，获取主角弹跳的高度+控制主角行动开关
  @property(cc.Node)
  player: cc.Node = null;

  // score label的引用
  @property(cc.Label)
  scoreDisplay: cc.Label = null;

  // 得分音效资源
  @property(cc.AudioClip)
  scoreAudio: cc.AudioClip = null;


  // 星星产生后消失时间的随机范围
  @property
  maxStarDuration: number = 0
  @property
  minStarDuration: number = 0

  groundY: number = 0
  timer: number = 0
  starDuration: number = 0
  score: number = 0

  onLoad() {
    // 获取地平面的y轴坐标
    this.groundY = this.ground.y + this.ground.height / 2
    // 初始化计时器
    this.timer = 0
    this.starDuration = 0
    // 生成新的star
    this.spawnNewStar()
    // 初始化记分
    this.score = 0
  }

  spawnNewStar() {
    // 使用给定的模版在场景中生成一个新节点。instantiate() 用于克隆指定的任意类型的对象，或者从 Prefab 实例化出新节点，返回值为 Node 或者 Object
    const newStar = cc.instantiate(this.starPrefab)
    // 将新增的节点添加到Canvas节点下。addChild() 用于在节点下添加一个新的子节点，所以新节点在场景中的显示效果在该节点之上
    this.node.addChild(newStar)
    // 给星星设置随机位置，Node 下的 setPosition() 用于设置节点在父节点坐标系中的位置
    newStar.setPosition(this.getNewStarPosition())
    // 在星星脚本组件上保存 Game 对象的引用(starPrefab中存在Star组件)
    newStar.getComponent('Star').game = this
    // 重置计时器，根据消失时间范围随机取值
    this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration)
    this.timer = 0
  }

  getNewStarPosition() {
    let randX = 0
    // 根据地平面位置和主角跳跃高度，随机得到一个星星的y坐标
    const randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50
    // 根据屏幕宽度，随机得到一个星星的x坐标（原点在屏幕中心，所以需要/2）
    const maxX = this.node.width / 2
    randX = (Math.random() - 0.5) * 2 * maxX
    // 返回星星坐标，setPosition可以-1.传入两个数值 x 和 y；2.传入 cc.v2(x, y) 或 cc.v3(x, y, z)（类型为 cc.Vec2 或 cc.Vec3 的对象）
    return cc.v2(randX, randY)
  }

  gainScore() {
    this.score += 1
    // 更新scoreDisplay Label文字
    this.scoreDisplay.string = 'Score:' + this.score

    // 播放得分音效
    cc.audioEngine.playEffect(this.scoreAudio, false)
  }

  gameOver() {
    // 停止Player节点的跳跃动作
    this.player.stopAllActions()
    // 重新加载场景game
    cc.director.loadScene('game')
  }

  start() {

  }

  update(dt: number) {
    // 每帧更新计时器，超过限度还没有生成新的星星就会调用游戏失败逻辑
    if (this.timer > this.starDuration) {
      this.gameOver()
      return
    }
    this.timer += dt
  }
}
