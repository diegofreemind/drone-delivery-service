import DeliveryLocation from '../entities/Location';

export interface ICalculatedRoute {
  droneId: string;
  targets: DeliveryLocation[];
}

export interface IDroneIdleCapacity {
  droneId: string;
  idle: number;
}
