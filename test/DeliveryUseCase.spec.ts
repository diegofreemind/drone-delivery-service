import DeliveryUseCase from '../src/useCases/DeliveryUseCase';
import { IDroneSquadMember } from '../src/useCases/DronesDTO';
import { ILocation } from '../src/useCases/LocationsDTO';

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

    deliveryUseCase.execute(
      {
        drones: dronesPayload,
      },
      {
        locations: locationsPayload,
      }
    );
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
