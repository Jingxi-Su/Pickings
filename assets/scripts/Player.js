// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
    accel: 0
  },
  runJumpAction () {
    // 跳跃上升
    // cc.tween()为cocos的缓动系统，by对属性进行相对值计算，使用 easing 来使缓动更生动（sineOut 正弦曲线缓出函数。）
    const jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: 'sineOut' });
    // 下落
    const jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: 'sineIn' });
    // 创建一个缓动，按jumpUp、jumpDown的顺序执行动作
    const tween = cc.tween().sequence(jumpUp, jumpDown);
    // 不断重复
    // repeat/repeatForever 函数会将前一个 action 作为作用对象。但是如果有参数提供了其他的 action 或者 tween，则 repeat/repeatForever 函数会将传入的 action 或者 tween 作为作用对象。
    return cc.tween().repeatForever(tween);
  },

  // LIFE-CYCLE CALLBACKS:
  // onLoad 方法会在场景加载后立刻执行，所以初始化相关的操作和逻辑都会放在这里面
  // 调用 start 开始执行 cc.tween
  onLoad () {
    // 初始化跳跃动作
    const jumpAction = this.runJumpAction();
    cc.tween(this.node).then(jumpAction).start();
  },

  start () {

  },

  // update (dt) {},
});
