import { IsArray, ArrayMaxSize, ArrayMinSize } from 'class-validator';

export interface IDroneSquadMember {
  name: string;
  maxWeight: number;
}

export class DroneSquadDTO {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  readonly drones!: IDroneSquadMember[];
}
