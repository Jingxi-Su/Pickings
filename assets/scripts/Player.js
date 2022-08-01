/* eslint-disable no-undef */
cc.Class({
  extends: cc.Component,

  properties: {
    // 主角跳跃高度
    jumpHeight: 0,
    // 主角跳跃持续时间
    jumpDuration: 0,
    // 最大移动速度
    maxMoveSpeed: 0,
    // 加速度
    accel: 0,
    // 跳跃音效资源
    jumpAudio: {
      default: null,
      type: cc.AudioClip
    }
  },
  runJumpAction () {
    // 跳跃上升
    const jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: 'sineOut' })
    // 下落
    const jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: 'sineIn' })
    // 创建一个缓动
    const tween = cc.tween()
      // 按jumpUp、jumpDown的顺序执行动作
      .sequence(jumpUp, jumpDown)
      // 添加一个回调函数，在前面的动作都结束时调用我们定义的 playJumpSound() 方法
      .call(this.playJumpSound, this)
    // 不断重复
    return cc.tween().repeatForever(tween)
  },

  playJumpSound: function () {
    // 调用引擎播放声音
    cc.audioEngine.playEffect(this.jumpAudio, false)
  },

  onKeyDown (event) {
    // 按下时设定flag
    switch (event.keyCode) {
      // 获取键盘的A键
      case cc.macro.KEY.a:
        this.accLeft = true
        break
      case cc.macro.KEY.d:
        this.accRight = true
        break
    }
  },
  onKeyUp (event) {
    // 按下时设定flag
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        this.accLeft = false
        break
      case cc.macro.KEY.d:
        this.accRight = false
        break
    }
  },
  // onLoad 方法会在场景加载后立刻执行，所以初始化相关的操作和逻辑都会放在这里面
  // 调用 start 开始执行 cc.tween
  onLoad: function () {
    // 初始化跳跃动作
    const jumpAction = this.runJumpAction()
    cc.tween(this.node).then(jumpAction).start()

    // 加速度方向开关
    this.accLeft = false
    this.accRight = false
    // 主角当前水平方向速度，正右负左
    this.xSpeed = 0

    // Creator 通过 systemEvent 来监听 系统全局事件。
    // 调用 cc.systemEvent，在场景加载后就开始监听键盘输入
    // cc.systemEvent.on(type, callback, target),可选的 type 类型有:
    // cc.SystemEvent.EventType.KEY_DOWN (键盘按下)/cc.SystemEvent.EventType.KEY_UP (键盘释放)
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
  },

  onDestroy () {
    // 取消键盘输入监听
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
  },

  // start () {

  // },

  // update 会在场景加载后每帧调用一次，我们一般把需要经常计算或及时更新的逻辑内容放在 update 中
  update: function (dt) {
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
})
