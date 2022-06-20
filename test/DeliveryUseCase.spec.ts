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
];

describe('Should handle drone squad deliveries', () => {
  test('Should execute a delivery at 4 locations', async () => {
    const deliveryUseCase = new DeliveryUseCase();

    const dronesPayload: IDroneSquadMember[] = [
      {
        name: 'Drone A',
        maxWeight: 200,
      },
    ];

    const { droneSquad, deliveryLocations } = await deliveryUseCase.execute(
      {
        drones: dronesPayload,
      },
      {
        locations: locationsPayload,
      }
    );

    expect(droneSquad).toHaveLength(1);
    expect(deliveryLocations).toHaveLength(4);
    expect(droneSquad[0]).toBeInstanceOf(Drone);
    expect(deliveryLocations[0]).toBeInstanceOf(DeliveryLocation);

    expect(droneSquad[0]).toHaveProperty('id');
    expect(deliveryLocations[0]).toHaveProperty('id');
  });

  test.only('Should calculate the most efficient routes for a given drone squad', () => {
    const addLocations: ILocation[] = [
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
    ];

    // TODO: simulate Drone B -> 150 ( 1 location missing )
    const dronesPayload: IDroneSquadMember[] = [
      {
        name: 'Drone A',
        maxWeight: 200,
      },
      {
        name: 'Drone B',
        maxWeight: 180,
      },
      {
        name: 'Drone C',
        maxWeight: 120,
      },
    ];

    const deliveryUseCase = new DeliveryUseCase();

    const droneSquad = dronesPayload.map(deliveryUseCase.createSquadMember);

    const locations = addLocations
      .concat(locationsPayload)
      .map(deliveryUseCase.createDeliveryLocation);

    const routes = deliveryUseCase.calculateTheMostEfficientDeliveries(
      droneSquad,
      locations
    );

    console.log({ routes });

    // const [singleCalculated] = calculatedRoutes;
    // const [idleCapacity] = idleCapactityCollection;

    // const unhandledPackages = locations.filter(
    //   (loc) => !singleCalculated.targets.find((i) => i.getName === loc.getName)
    // );

    // const missedPackages = unhandledPackages.find(
    //   (i) => i.getPackages < idleCapacity.idle
    // );

    // console.log({ unhandledPackages, missedPackages });

    // expect(singleCalculated).toBeDefined();
    // expect(missedPackages).toBeUndefined();
    // expect(singleCalculated.targets).toHaveLength(6);
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

    const locationsPayload: ILocation[] = [
      {
        name: 'LocationA',
        packagesWeight: 120,
      },
    ];

    await expect(
      deliveryUseCase.execute(
        {
          drones: [],
        },
        {
          locations: locationsPayload,
        }
      )
    ).rejects.toThrowError();
  });
});
