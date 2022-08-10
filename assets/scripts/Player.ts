
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
  mainCamera: cc.Node = null

  onLoad() {
    //FIXME:改造 startMoveAt 方法，在这里可以直接调用
    // 初始化跳跃动作
    const jumpAction = this.runJumpAction()
    //FIXME:直接封装到 runJumpAction() 方法中
    cc.tween(this.node).then(jumpAction).start()
    this.accLeft = false
    this.accRight = false
    this.xSpeed = 0
  }

  /**
   * 定义player的跳跃动作
   * @returns
   */
  runJumpAction() {
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

  /**
   * 调用引擎播放跳跃声音
   */
  playJumpSound() {
    cc.audioEngine.playEffect(this.jumpAudio, false)
  }

  /**
   * 初始化事件监听
   */
  setInputControl() {
    // 初始化键盘输入
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
    // 初始化触控输入
    this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
  }

  /**
   * 取消事件监听
   */
  onDestroy() {
    // 取消键盘输入监听
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
    // 取消触控监听
    this.node.parent.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.node.parent.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
  }

  /**
   * 按下按键回调
   * @param event
   */
  onKeyDown(event) {
    switch (event.keyCode) {
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

  /**
   * 松开按键回调
   * @param event
   */
  onKeyUp(event) {
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

  /**
   * 开始触摸
   * @param event
   */
  onTouchStart(event) {
    const touchLoc = event.getLocation()
    if (touchLoc.x >= this.mainCamera.position.x + cc.winSize.width / 2) {
      this.accRight = true
      this.accLeft = false
    } else {
      this.accLeft = true
      this.accRight = false
    }
  }

  /**
   * 结束触摸
   */
  onTouchEnd() {
    this.accLeft = false
    this.accRight = false
  }

  /**
   * 指定位置开始运动
   * @param pos 指定位置
   */
  startMoveAt(pos: cc.Vec2) {
    this.xSpeed = 0
    this.accLeft = false
    this.accRight = false
    this.node.x = pos.x
    this.node.y = pos.y
    const jumpAction = this.runJumpAction()
    cc.tween(this.node).then(jumpAction).start()
  }

  /**
   * 根据当前加速度方向每帧更新速度
   * @param dt
   */
  update(dt: number) {
    if (this.accLeft) {
      this.xSpeed -= this.accel * dt
    } else if (this.accRight) {
      this.xSpeed += this.accel * dt
    }

    //FIXME: this.xSpeed = Math.min(Math.abs(this.xSpeed), this.maxSpeed)
    if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
      this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed)
    }

    this.node.x += this.xSpeed * dt
  }

  /**
   * 当组件的 enabled 属性从 true 变为 false 时，会激活 onDisable 回调，同时停止update
   */
  onDisable() {
    this.node.stopAllActions()
  }
}
