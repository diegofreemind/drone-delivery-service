import { BaseEntity } from './BaseEntity';

export default class DeliveryPackage extends BaseEntity {
  constructor(private weight: number) {
    super();
  }

  get getWeight() {
    return this.weight;
  }
}
