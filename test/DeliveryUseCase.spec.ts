import Drone from '../src/entities/Drone';
import DeliveryLocation from '../src/entities/Location';
import { ILocation } from '../src/useCases/LocationsDTO';

import DeliveryUseCase from '../src/useCases/DeliveryUseCase';
import { IDroneSquadMember } from '../src/useCases/DronesDTO';

const locationsPayload: ILocation[] = [
  {
    name: 'LocationA',
    packagesWeight: 120,
  },
  {
    name: 'LocationB',
    packagesWeight: 15,
  },
  {
    name: 'LocationC',
    packagesWeight: 45,
  },
  {
    name: 'LocationD',
    packagesWeight: 20,
  },
  {
    name: 'LocationE',
    packagesWeight: 120,
  },
  {
    name: 'LocationF',
    packagesWeight: 30,
  },
  {
    name: 'LocationG',
    packagesWeight: 50,
  },
  {
    name: 'LocationH',
    packagesWeight: 20,
  },
  {
    name: 'LocationI',
    packagesWeight: 60,
  },
  {
    name: 'LocationJ',
    packagesWeight: 60,
  },
];

describe('Should handle drone squad deliveries', () => {
  test('Should calculate the most efficient routes for a given drone squad(3)', () => {
    const dronesPayload: IDroneSquadMember[] = [
      {
        name: 'Drone B',
        maxWeight: 150,
      },
      {
        name: 'Drone A',
        maxWeight: 200,
      },
      {
        name: 'Drone C',
        maxWeight: 120,
      },
    ];

    const deliveryUseCase = new DeliveryUseCase();

    const droneSquad = dronesPayload.map(deliveryUseCase.createSquadMember);

    const locations = locationsPayload.map(
      deliveryUseCase.createDeliveryLocation
    );

    const mappedDeliveries = deliveryUseCase.calculateTrips(
      droneSquad,
      locations
    );

    const totalMapped = mappedDeliveries.reduce(
      (acc, drone) =>
        acc + drone.deliveries.reduce((ac, c) => ac + c.targets.length, 0),
      0
    );

    expect(mappedDeliveries).toHaveLength(2);
    expect(totalMapped).toBe(locations.length);

    for (let x of mappedDeliveries) {
      expect(x.tripId).toBeDefined();
      expect(x.description).toBeDefined();

      expect(mappedDeliveries[0].deliveries[0]).toHaveProperty('drone');
      expect(mappedDeliveries[0].deliveries[0]).toHaveProperty('targets');
      expect(mappedDeliveries[0].deliveries[0]).toHaveProperty('idleCapacity');
    }
  });

  test('Should throw an error when not informing locations', async () => {
    const deliveryUseCase = new DeliveryUseCase();

    const dronesPayload: IDroneSquadMember[] = [
      {
        name: 'Drone A',
        maxWeight: 200,
      },
    ];

    await expect(
      deliveryUseCase.execute(
        {
          drones: dronesPayload,
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
