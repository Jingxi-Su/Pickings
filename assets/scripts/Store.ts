import { observable } from "mobx";

class Store {
  @observable
  timer: number = 0

  @observable
  starDuration: number = 0

  @observable
  score: number = 0
}

export const store = new Store()

