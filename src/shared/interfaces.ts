import Drone from '../entities/Drone';
import DeliveryLocation from '../entities/Location';

export interface IDroneDelivery {
  drone: Drone;
  idleCapacity: number;
  targets: DeliveryLocation[];
}
