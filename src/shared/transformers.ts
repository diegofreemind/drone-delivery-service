import { DroneSquadDTO } from '../useCases/DTOs/DronesDTO';
import { ILocation, LocationsDTO } from '../useCases/DTOs/LocationsDTO';

import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { resolve } from 'path';

function handleCSVInput(inputPath: string, outputPath: string) {
  const inputAbsPath = resolve(process.cwd(), inputPath);
  const outputAbsPath = resolve(process.cwd(), outputPath);

  let droneSquadInfo: DroneSquadDTO;
  const locationsInfo: LocationsDTO = {
    locations: [],
  };

  createReadStream(inputAbsPath)
    .pipe(parse({ delimiter: ',', fromLine: 2 }))
    .on('data', function (row: any) {
      console.log(row);

      // [ '[LocationA]', ' [200]' ]
      const [currentLocation, weight] = row;

      const parsedLocation = {
        name: currentLocation,
        packagesWeight: weight.replace(/\W/g, ''),
      } as ILocation;

      locationsInfo.locations.push(parsedLocation);

      console.log({ parsedLocation, row });
    })
    .on('end', function () {
      console.log({ locationsInfo });
    });
}

export { handleCSVInput };
