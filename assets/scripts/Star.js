/* eslint-disable no-undef */
cc.Class({
  extends: cc.Component,

  properties: {
    // 星星和主角之间的距离小于这个数值时，就会完成收集
    pickRadius: 0
  },

  // onLoad () {},
  getPlayerDistance: function () {
    // 根据Player节点位置判断距离
    const playerPos = this.game.player.getPosition()
    // 根据两点位置计算两点之间的距离
    const dist = this.node.position.sub(playerPos).mag()
    return dist
  },

  onPicked: function () {
    // 当星星被收集时，调用Game脚本中的接口，生成一个新的星星
    this.game.spawnNewStar()
    // 销毁当前星星，通过 node.destroy() 函数，可以销毁节点
    this.node.destroy()
  },

  start () {

  },

  update: function (dt) {
    // 每帧判断星星和主角之间的距离是否小于收集距离
    if (this.getPlayerDistance() < this.pickRadius) {
      this.onPicked()
    }
  }
})
