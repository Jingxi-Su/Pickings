import { makeObservable, observable } from 'mobx'

export const enum State {
  NONE = 0, // 游戏未开始
  PLAYING = 1, // 游戏进行中
  OVER = 2 // 游戏结束
}

class Store {
  state: State = State.NONE

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
