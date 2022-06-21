import Drone from '../entities/Drone';
import DeliveryPackage from '../entities/Package';
import DeliveryLocation from '../entities/Location';
import { IDroneDelivery } from '../shared/interfaces';

import { validatorDto } from '../shared/validatorDTO';
import { LocationsDTO, ILocation } from './LocationsDTO';
import { DroneSquadDTO, IDroneSquadMember } from './DronesDTO';

export default class DeliveryUseCase {
  constructor() {}

  async execute(droneSquadInfo: DroneSquadDTO, locationsInfo: LocationsDTO) {
    await validatorDto(LocationsDTO, locationsInfo);
    await validatorDto(DroneSquadDTO, droneSquadInfo);

    const { drones } = droneSquadInfo;
    const { locations } = locationsInfo;

    const droneSquad = drones.map(this.createSquadMember);
    const deliveryLocations = locations.map(this.createDeliveryLocation);

    return this.calculateDeliveries(droneSquad, deliveryLocations);
  }

  calculateDeliveries(droneSquad: Drone[], locations: DeliveryLocation[]) {
    let squadLocationsAsMap = new Map();
    let targetLocations: DeliveryLocation[] = [];

    const sortedDroneSquad = this.sortDronesByHighestWeight(droneSquad);
    const sortedLocations = this.sortLocationsByLowestWeight(locations);

    const deliveries = sortedDroneSquad.map((drone) => {
      let remainingLocations = targetLocations[1]
        ? targetLocations
        : sortedLocations;

      const { remaining, idleCapacity, targets } = this.matchLocationsByDrone(
        drone,
        remainingLocations,
        squadLocationsAsMap
      );

      targetLocations = this.sortLocationsByLowestWeight(remaining);

      return {
        drone,
        targets,
        idleCapacity,
      };
    });

    return deliveries;
  }

  matchLocationsByDrone(
    drone: Drone,
    sortedLocations: DeliveryLocation[],
    squadLocationsAsMap: Map<DeliveryLocation, string>
  ) {
    let idleCapacity = drone.getMaxWeight;

    sortedLocations.map((item, index, array) => {
      const nextItem = array[index + 1];

      const targetWeight = this.calculateTargetWeight(item, nextItem);
      const isAlreadyTagged = squadLocationsAsMap.has(item);

      if (!isAlreadyTagged && idleCapacity >= targetWeight) {
        if (nextItem) {
          squadLocationsAsMap.set(nextItem, drone.getId!);
        }

        squadLocationsAsMap.set(item, drone.getId!);
        idleCapacity -= targetWeight;
      }
    });

    return {
      idleCapacity,
      targets: sortedLocations.filter((i) => squadLocationsAsMap.has(i)),
      remaining: sortedLocations.filter((i) => !squadLocationsAsMap.has(i)),
    };
  }

  sortLocationsByLowestWeight(locations: DeliveryLocation[]) {
    return locations.sort((a, b) => a.getPackages - b.getPackages);
  }

  sortDronesByHighestWeight(droneSquad: Drone[]) {
    return droneSquad.sort((a, b) => b.getMaxWeight - a.getMaxWeight);
  }

  calculateTargetWeight(location: DeliveryLocation, next?: DeliveryLocation) {
    return next
      ? location.getPackages + next?.getPackages
      : location.getPackages;
  }

  createSquadMember(member: IDroneSquadMember) {
    return new Drone(member.maxWeight, member.name);
  }

  createDeliveryLocation(deliveryLocation: ILocation) {
    const deliveryPackage = new DeliveryPackage(
      deliveryLocation.packagesWeight
    );

    return new DeliveryLocation(deliveryLocation.name, [deliveryPackage]);
  }
}
