import { makeObservable, observable } from 'mobx'

/** mobx状态管理库 */
class Store {
  timer = 0

  starDuration = 0

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
