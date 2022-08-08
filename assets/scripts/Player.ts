import Game from './Game'

const { ccclass, property } = cc._decorator

@ccclass
export default class Player extends cc.Component {
  // 主角跳跃高度
  @property
    jumpHeight = 0

  // 主角跳跃持续时间
  @property
    jumpDuration = 0

  // 主角跳跃形变时间
  @property
    squashDuration = 0

  // 最大移动速度
  @property
    maxMoveSpeed = 0

  // 加速度
  @property
    accel = 0

  // 跳跃音效资源
  @property(cc.AudioClip)
    jumpAudio: cc.AudioClip = null

  // 加速度方向开关
  accLeft = false
  accRight = false

  // 主角当前水平方向速度，正右负左
  xSpeed = 0

  @property(cc.Node)
    mainCamera:cc.Node = null

  onLoad () {
    // 初始化跳跃动作
    const jumpAction = this.runJumpAction()
    cc.tween(this.node).then(jumpAction).start()
    // 加速度方向开关
    this.accLeft = false
    this.accRight = false
    // 主角当前水平方向速度
    this.xSpeed = 0
    this.setInputControl()
  }

  runJumpAction () {
    // 上升
    const jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: 'sineOut' })
    // 下落
    const jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: 'sineIn' })
    // 形变
    const squash = cc.scaleTo(this.squashDuration, 1, 0.6)
    const stretch = cc.scaleTo(this.squashDuration, 1, 1.2)
    const scaleBack = cc.scaleTo(this.squashDuration, 1, 1)
    // 创建一个缓动
    const tween = cc.tween()
      // 按jumpUp、jumpDown的顺序执行动作
      .sequence(squash, stretch, jumpUp, scaleBack, jumpDown)
      // 添加一个回调函数，在前面的动作都结束时调用我们定义的 playJumpSound() 方法
      .call(this.playJumpSound, this)
    // 不断重复
    return cc.tween().repeatForever(tween)
  }

  playJumpSound () {
    // 调用引擎播放声音
    cc.audioEngine.playEffect(this.jumpAudio, false)
  }

  setInputControl () {
    // 初始化键盘输入
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
    // 初始化触控输入
    this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
  }

  onDestroy () {
    // 取消键盘输入监听
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
    // 取消触控监听
    this.node.parent.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.node.parent.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
  }

  onKeyDown (event) {
    // 按下时设定flag
    switch (event.keyCode) {
      // 获取键盘的A键
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.accLeft = true
        this.accRight = false
        break
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.accRight = true
        this.accLeft = false
        break
    }
  }

  onKeyUp (event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.accLeft = false
        break
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.accRight = false
        break
    }
  }

  onTouchStart (event) {
    const touchLoc = event.getLocation()
    if (touchLoc.x >= this.mainCamera.position.x) {
      this.accRight = true
      this.accLeft = false
    } else {
      this.accLeft = true
      this.accRight = false
    }
    return true
  }

  onTouchEnd () {
    this.accLeft = false
    this.accRight = false
  }

  startMoveAt (pos: cc.Vec2) {
    this.xSpeed = 0
    this.accLeft = false
    this.accRight = false
    this.node.setPosition(pos)
    const jumpAction = this.runJumpAction()
    cc.tween(this.node).then(jumpAction).start()
  }

  update (dt: number) {
    // 根据当前加速度方向每帧更新速度
    if (this.accLeft) {
      this.xSpeed -= this.accel * dt
    } else if (this.accRight) {
      this.xSpeed += this.accel * dt
    }

    // 限制主角的速度不能超过最大值
    if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
      this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed)
    }

    // 根据当前速度更新主角的位置
    this.node.x += this.xSpeed * dt
  }

  // 当组件的 enabled 属性从 true 变为 false 时，会激活 onDisable 回调，同时停止update
  onDisable () {
    this.node.stopAllActions()
  }
}
