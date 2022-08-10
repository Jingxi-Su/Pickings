import { makeObservable, observable } from 'mobx'

/** mobx状态管理库 */
class Store {
  /** 计时器 */
  timer = 0

  /** 星星持续时间 */
  starDuration = 0

  /** 分数 */
  score = 0

  constructor () {
    makeObservable(this, {
      score: observable,
      timer: observable,
      starDuration: observable
    })
  }
}

export const store = new Store()
