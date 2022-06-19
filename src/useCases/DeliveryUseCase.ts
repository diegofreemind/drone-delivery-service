import { validatorDto } from '../shared/validatorDTO';
import { LocationsDTO } from './LocationsDTO';
import { DroneSquadDTO } from './DronesDTO';

export default class DeliveryUseCase {
  constructor() {}

  async execute(drones: DroneSquadDTO, locations: LocationsDTO) {
    await validatorDto(DroneSquadDTO, drones);
    await validatorDto(LocationsDTO, locations);
  }
}
