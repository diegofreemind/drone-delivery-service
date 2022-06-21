import { v4 } from 'uuid';
import Drone from '../entities/Drone';
import DeliveryLocation from '../entities/Location';
import { IDroneDelivery, ITripCollection } from '../shared/interfaces';
import { createSquadMember, createDeliveryLocation } from '../shared/factories';

import { validatorDto } from '../shared/validatorDTO';
import { LocationsDTO } from './DTOs/LocationsDTO';
import { DroneSquadDTO } from './DTOs/DronesDTO';

export default class DeliveryUseCase {
  constructor() {}

  async execute(droneSquadInfo: DroneSquadDTO, locationsInfo: LocationsDTO) {
    await validatorDto(LocationsDTO, locationsInfo);
    await validatorDto(DroneSquadDTO, droneSquadInfo);

    const { drones } = droneSquadInfo;
    const { locations } = locationsInfo;

    const droneSquad = drones.map(createSquadMember);
    const deliveryLocations = locations.map(createDeliveryLocation);

    return this.calculateTrips(droneSquad, deliveryLocations);
  }

  calculateTrips(
    droneSquad: Drone[],
    locations: DeliveryLocation[],
    mappedDeliveries: ITripCollection[] = []
  ): ITripCollection[] {
    const { deliveries, unallocated } = this.calculateDeliveries(
      droneSquad,
      locations
    );

    mappedDeliveries!.push({
      deliveries,
      tripId: v4(),
      description: `Trip #${mappedDeliveries.length + 1}`,
    });

    if (unallocated.length > 0) {
      return this.calculateTrips(droneSquad, unallocated, mappedDeliveries);
    }

    return mappedDeliveries!;
  }

  calculateDeliveries(droneSquad: Drone[], locations: DeliveryLocation[]) {
    const squadLocationsAsMap = new Map();
    let targetLocations: DeliveryLocation[] = [];

    const sortedDroneSquad = this.sortDronesByHighestWeight(droneSquad);
    const sortedLocations = this.sortLocationsByLowestWeight(locations);

    const deliveries: IDroneDelivery[] = sortedDroneSquad.map((drone) => {
      const remainingLocations =
        targetLocations.length > 0 ? targetLocations : sortedLocations;

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

    return {
      unallocated: targetLocations,
      deliveries: deliveries.filter((item) => item.targets.length > 0),
    };
  }

  matchLocationsByDrone(
    drone: Drone,
    sortedLocations: DeliveryLocation[],
    squadLocationsAsMap: Map<DeliveryLocation, string>
  ) {
    let idleCapacity = drone.getMaxWeight;
    const droneTargets: DeliveryLocation[] = [];

    sortedLocations.map((item, index, array) => {
      const nextItem = array[index + 1];

      const targetWeight = this.calculateTargetWeight(item, nextItem);
      const isAlreadyTagged = squadLocationsAsMap.has(item);

      if (!isAlreadyTagged && idleCapacity >= targetWeight) {
        if (nextItem) {
          squadLocationsAsMap.set(nextItem, drone.getId!);
          droneTargets.push(nextItem);
        }

        droneTargets.push(item);
        squadLocationsAsMap.set(item, drone.getId!);
        idleCapacity -= targetWeight;
      }
    });

    return {
      idleCapacity,
      targets: droneTargets,
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
}
