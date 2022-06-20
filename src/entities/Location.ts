import { BaseEntity } from './BaseEntity';
import DeliveryPackage from './Package';

export default class DeliveryLocation extends BaseEntity {
  constructor(private name: string, private packages: DeliveryPackage[]) {
    super();
  }

  get getName() {
    return this.name;
  }

  get getPackages() {
    return this.packages.reduce((acc, item) => acc + item.getWeight, 0);
  }
}
