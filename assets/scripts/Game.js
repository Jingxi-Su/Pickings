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

  onLoad: function () {
    //获取地平面的y轴坐标
    this.groundY = this.ground.y + this.ground.height / 2;
    //生成新的star
    this.spawnNewStar();
  },

  spawnNewStar: function () {
    //使用给定的模版在场景中生成一个新节点。instantiate() 用于克隆指定的任意类型的对象，或者从 Prefab 实例化出新节点，返回值为 Node 或者 Object
    var newStar = cc.instantiate(this.starPrefab)
    //将新增的节点添加到Canvas节点下。addChild() 用于在节点下添加一个新的子节点，所以新节点在场景中的显示效果在该节点之上
    this.node.addChild(newStar)
    //给星星设置随机位置，Node 下的 setPosition() 用于设置节点在父节点坐标系中的位置
    newStar.setPosition(this.getNewStarPosition())
    // 在星星脚本组件上保存 Game 对象的引用(starPrefab中存在Star组件)
    newStar.getComponent('Star').game = this;
  },

  getNewStarPosition: function () {
    var randX = 0;
    //根据地平面位置和主角跳跃高度，随机得到一个星星的y坐标
    var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
    //根据屏幕宽度，随机得到一个星星的x坐标（原点在屏幕中心，所以需要/2）
    var maxX = this.node.width / 2;
    randX = (Math.random() - 0.5) * 2 * maxX;
    //返回星星坐标，setPosition可以-1.传入两个数值 x 和 y；2.传入 cc.v2(x, y) 或 cc.v3(x, y, z)（类型为 cc.Vec2 或 cc.Vec3 的对象）
    return cc.v2(randX, randY);
  }

  // update (dt) {},
});
