import { ArrayMinSize, IsArray } from 'class-validator';

export interface ILocation {
  name: string;
  packagesWeight: number;
}

export class LocationsDTO {
  @IsArray()
  @ArrayMinSize(1)
  readonly locations!: ILocation[];
}
