import { action, observable } from "mobx";

export const enum State {
  NONE = 0,   // 游戏未开始
  PLAYING = 1,// 游戏进行中
  OVER = 2    // 游戏结束
};

class Store {
  @observable
  state: State = State.NONE

  @observable
  timer: number = 0

  @observable
  starDuration: number = 0

  @observable
  score: number = 0

  @action
  setState(state: State) {
    this.state = state;
  }
}

export const store = new Store()

