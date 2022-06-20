import { BaseEntity } from './BaseEntity';

export default class Drone extends BaseEntity {
  constructor(private maxWeight: number, private name: string) {
    super();
  }

  get getName() {
    return this.name;
  }

  get getMaxWeight() {
    return this.maxWeight;
  }
}
