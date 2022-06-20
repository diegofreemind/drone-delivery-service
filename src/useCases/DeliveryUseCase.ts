import Drone from '../entities/Drone';
import DeliveryPackage from '../entities/Package';
import DeliveryLocation from '../entities/Location';

import { validatorDto } from '../shared/validatorDTO';
import { LocationsDTO, ILocation } from './LocationsDTO';
import { DroneSquadDTO, IDroneSquadMember } from './DronesDTO';
import { IDroneIdleCapacity, ICalculatedRoute } from '../shared/interfaces';

export default class DeliveryUseCase {
  constructor() {}

  async execute(droneSquadInfo: DroneSquadDTO, locationsInfo: LocationsDTO) {
    await validatorDto(LocationsDTO, locationsInfo);
    await validatorDto(DroneSquadDTO, droneSquadInfo);

    const { drones } = droneSquadInfo;
    const { locations } = locationsInfo;

    const droneSquad = drones.map(this.createSquadMember);
    const deliveryLocations = locations.map(this.createDeliveryLocation);

    return { droneSquad, deliveryLocations };
  }

  calculateTheMostEfficientDeliveries(
    droneSquad: Drone[],
    locations: DeliveryLocation[]
  ) {
    // https://www.geeksforgeeks.org/given-two-unsorted-arrays-find-pairs-whose-sum-x/

    let squadLocationsAsMap = new Map();
    let remainingLocations: DeliveryLocation[] = [];

    // TODO: if non tagged location:
    // TODO: @find droneIdleCapacity > nonTaggedLocation.getPackages
    // TODO: @compare droneIdleCapacity.targets.sum x nonTaggedLocation.getPackages ( switch )

    const routes = droneSquad.map((drone) => {
      remainingLocations =
        remainingLocations.length === 0 ? locations : remainingLocations;

      const { mapped, idle, remaining } = this.matchLocationsByDrone(
        drone,
        remainingLocations,
        squadLocationsAsMap
      );

      console.log({ drone });
      console.log({ mapped, idle, remaining });

      remainingLocations = remaining;
      return { mapped, idle };
    });

    return routes;
  }

  matchLocationsByDrone(
    drone: Drone,
    locations: DeliveryLocation[],
    squadLocationsAsMap: Map<DeliveryLocation, string>
  ) {
    const sortedLocations = locations.sort(
      (a, b) => a.getPackages - b.getPackages
    );

    console.log({
      sorted: sortedLocations.length,
      mapLength: squadLocationsAsMap.size,
    });

    let droneIdleCapacity = drone.getMaxWeight;

    sortedLocations.map((item, index, array) => {
      const nextIndex = array[index + 1] ? index + 1 : false;

      const targetWeight = !nextIndex
        ? item.getPackages
        : item.getPackages + array[nextIndex]?.getPackages;

      const isAlreadyTagged = squadLocationsAsMap.has(item);

      console.log(
        isAlreadyTagged,
        droneIdleCapacity,
        targetWeight,
        item.getPackages,
        nextIndex
      );

      if (!isAlreadyTagged && droneIdleCapacity >= targetWeight) {
        if (nextIndex) {
          squadLocationsAsMap.set(array[nextIndex], drone.getId!);
        }

        squadLocationsAsMap.set(item, drone.getId!);
        droneIdleCapacity -= targetWeight;
      }
    });

    return {
      idle: droneIdleCapacity,
      mapped: squadLocationsAsMap.entries(),
      remaining: locations.filter((i) => !squadLocationsAsMap.has(i)),
    };
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
