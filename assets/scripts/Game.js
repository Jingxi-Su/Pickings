// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    //此属性引用了星星的预制资源
    starPrefab: {
      default: null,
      type: cc.Prefab
    },

    //星星产生后消失时间的随机范围
    maxStarDuration: 0,
    minStarDuration: 0,

    //地面节点，确定星星生成的高度
    ground: {
      default: null,
      type: cc.Node
    },

    //Player节点，获取主角弹跳的高度+控制主角行动开关
    player: {
      default: null,
      type: cc.Node
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {

  },

  // update (dt) {},
});
