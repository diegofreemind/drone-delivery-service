import { IDroneSquadMember } from '../useCases/DTOs/DronesDTO';
import { ILocation } from '../useCases/DTOs/LocationsDTO';
import DeliveryLocation from '../entities/Location';
import DeliveryPackage from '../entities/Package';
import Drone from '../entities/Drone';

export function createSquadMember(member: IDroneSquadMember) {
  return new Drone(member.maxWeight, member.name);
}

export function createDeliveryLocation(deliveryLocation: ILocation) {
  const deliveryPackage = new DeliveryPackage(deliveryLocation.packagesWeight);

  return new DeliveryLocation(deliveryLocation.name, [deliveryPackage]);
}
