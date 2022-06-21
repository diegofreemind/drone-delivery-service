import { ILocation, LocationsDTO } from '../src/useCases/DTOs/LocationsDTO';
import DeliveryUseCase from '../src/useCases/DeliveryUseCase';
import mockedLocations from './mockLocations.json';
import mockedDroneSquad from './mockDrones.json';

import {
  DroneSquadDTO,
  IDroneSquadMember,
} from '../src/useCases/DTOs/DronesDTO';

import {
  createSquadMember,
  createDeliveryLocation,
} from '../src/shared/factories';

const locationsPayload: ILocation[] = mockedLocations.default;
const dronesPayload: IDroneSquadMember[] = mockedDroneSquad.default;

describe('Should handle drone squad deliveries', () => {
  test('Should calculate the most efficient routes for a given drone squad', () => {
    const deliveryUseCase = new DeliveryUseCase();
    const droneSquad = dronesPayload.map(createSquadMember);
    const locations = locationsPayload.map(createDeliveryLocation);

    const mappedDeliveries = deliveryUseCase.calculateTrips(
      droneSquad,
      locations
    );

    const totalMapped = mappedDeliveries.reduce(
      (acc, drone) =>
        acc + drone.deliveries.reduce((ac, c) => ac + c.targets.length, 0),
      0
    );

    expect(mappedDeliveries).toHaveLength(4);
    expect(totalMapped).toBe(locations.length);

    for (const droneRoute of mappedDeliveries) {
      expect(droneRoute.tripId).toBeDefined();
      expect(droneRoute.description).toBeDefined();

      expect(droneRoute.deliveries[0]).toHaveProperty('drone');
      expect(droneRoute.deliveries[0]).toHaveProperty('targets');
      expect(droneRoute.deliveries[0]).toHaveProperty('idleCapacity');
    }
  });

  test('Should execute the delivery use case flow', async () => {
    const deliveryUseCase = new DeliveryUseCase();

    const locationsInfo: LocationsDTO = {
      locations: locationsPayload,
    };

    const droneSquadInfo: DroneSquadDTO = {
      drones: dronesPayload,
    };

    console.log(JSON.stringify({ locationsInfo, droneSquadInfo }));

    const mappedDeliveries = await deliveryUseCase.execute(
      droneSquadInfo,
      locationsInfo
    );

    // console.log(JSON.stringify(mappedDeliveries[0]));
    // console.log(mappedDeliveries.length);

    expect(mappedDeliveries).toHaveLength(4);
  });

  test('Should throw an error when not informing locations', async () => {
    const deliveryUseCase = new DeliveryUseCase();

    await expect(
      deliveryUseCase.execute(
        {
          drones: [dronesPayload[0]],
        },
        {
          locations: [],
        }
      )
    ).rejects.toThrowError();
  });

  test('Should throw an error when not informing drones', async () => {
    const deliveryUseCase = new DeliveryUseCase();

    await expect(
      deliveryUseCase.execute(
        {
          drones: [],
        },
        {
          locations: [locationsPayload[0]],
        }
      )
    ).rejects.toThrowError();
  });
});
