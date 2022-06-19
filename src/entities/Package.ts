export default class DeliveryPackage {
  constructor(private weight: number) {}

  get getWeight() {
    return this.weight;
  }
}
