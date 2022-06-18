export class Drone {
  constructor(private maxWeight: number, private name: string) {}

  get getName() {
    return this.name;
  }

  get getMaxWeight() {
    return this.maxWeight;
  }
}
