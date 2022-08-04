
const { ccclass, property } = cc._decorator

@ccclass
export default class Background extends cc.Component {
    @property(cc.Node)
      bg_1: cc.Node = null

    @property(cc.Node)
      bg_2: cc.Node = null

    @property(cc.Node)
      bg_3: cc.Node = null

    @property(cc.Node)
      ground_1: cc.Node = null

    @property(cc.Node)
      ground_2: cc.Node = null

    @property(cc.Node)
      ground_3: cc.Node = null

    @property(cc.Node)
      mainCamera:cc.Node = null

    player:cc.Node = null
    bgList:cc.Node[] = null
    groundList:cc.Node[] = null

    onLoad () {
      this.player = cc.find('Canvas/Player')
      this.bgList = [this.bg_1, this.bg_2, this.bg_3]
      this.groundList = [this.ground_1, this.ground_2, this.ground_3]
      this.setBgPosition(this.bgList)
      this.setBgPosition(this.groundList)
    }

    // 设置连续背景图坐标
    setBgPosition (background:cc.Node[]) {
      background[0].x = background[1].x - background[0].width
      background[2].x = background[1].x + background[2].width
    }

    // 检查是否要重置位置
    checkBgReset (background:cc.Node[]) {
      if ((this.mainCamera.x - cc.winSize.width / 2) < (background[0].x - background[0].width / 2)) {
        const temp = background.pop()
        background.unshift(temp)
        this.setBgPosition(background)
      } else if ((this.mainCamera.x - cc.winSize.width / 2) < (background[0].x - background[0].width / 2)) {
        const temp = background.shift()
        background.push(temp)
        this.setBgPosition(background)
      }
    }

    update () {
      this.checkBgReset(this.bgList)
      this.checkBgReset(this.groundList)
    }
}
