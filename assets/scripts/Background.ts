
const { ccclass, property } = cc._decorator

@ccclass
export default class Background extends cc.Component {
  /** 连续背景-1 */
  @property(cc.Node)
  private bg_1: cc.Node = null

  /** 连续背景-2 */
  @property(cc.Node)
  private bg_2: cc.Node = null

  /** 连续背景-3 */
  @property(cc.Node)
  private bg_3: cc.Node = null

  /** 相机节点 */
  @property(cc.Node)
  private mainCamera:cc.Node = null

  /** 背景数组 */
  private bgList:cc.Node[] = null

  onLoad () {
    this.bgList = [this.bg_1, this.bg_2, this.bg_3]
    this.setBgPosition(this.bgList)
  }

  /**
     * 设置连续背景图坐标
     * @param background 背景数组
     */
  setBgPosition (background:cc.Node[]) {
    background[0].x = background[1].x - background[0].width
    background[2].x = background[1].x + background[2].width
  }

  /**
     * 检查是否要重置背景位置
     * @param background 背景数组
     */
  checkBgReset (background:cc.Node[]) {
    if ((this.mainCamera.x - cc.winSize.width / 2) < (background[0].x - background[0].width / 2)) {
      const temp = background.pop()
      background.unshift(temp)
      this.setBgPosition(background)
    } else if ((this.mainCamera.x + cc.winSize.width / 2) > (background[2].x + background[2].width / 2)) {
      const temp = background.shift()
      background.push(temp)
      this.setBgPosition(background)
    }
  }

  update () {
    this.checkBgReset(this.bgList)
  }
}
