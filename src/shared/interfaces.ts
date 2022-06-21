import Drone from '../entities/Drone';
import DeliveryLocation from '../entities/Location';

export interface IDroneDelivery {
  drone: Drone;
  idleCapacity: number;
  targets: DeliveryLocation[];
}

export interface ITripCollection {
  tripId: string;
  description: string;
  deliveries: IDroneDelivery[];
}
