import { observable } from 'mobx'

export const enum State {
  NONE = 0, // 游戏未开始
  PLAYING = 1, // 游戏进行中
  OVER = 2 // 游戏结束
}

class Store {
  @observable
    state: State = State.NONE

  @observable
    timer = 0

  @observable
    starDuration = 0

  @observable
    score = 0
}

export const store = new Store()
