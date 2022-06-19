import DeliveryPackage from './Package';

export default class DeliveryLocation {
  constructor(private name: string, private packages: DeliveryPackage[]) {}

  get getName() {
    return this.name;
  }

  get getPackages() {
    return this.packages;
  }
}
