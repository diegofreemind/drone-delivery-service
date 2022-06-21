import { DroneSquadDTO } from '../useCases/DTOs/DronesDTO';
import { LocationsDTO } from '../useCases/DTOs/LocationsDTO';

import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { resolve } from 'path';

async function handleCSVInput(inputPath: string) {
  const inputAbsPath = resolve(process.cwd(), inputPath);

  const locationPayload = await generateLocationInfo(inputAbsPath);
  const droneSquadPayload = await generateDroneSquadInfo(inputAbsPath);

  return { locationPayload, droneSquadPayload };
}

async function generateDroneSquadInfo(
  inputAbsPath: string
): Promise<DroneSquadDTO> {
  const droneSquadInfo: DroneSquadDTO = {
    drones: [],
  };

  return new Promise((resolve, reject) => {
    createReadStream(inputAbsPath)
      .pipe(parse({ delimiter: ',', to_line: 1 }))
      .on('data', (row: string[]) => {
        row.map((item, index, array) => {
          if (index % 2 === 0 && array[index + 1]) {
            droneSquadInfo.drones.push({
              name: item,
              maxWeight: Number(array[index + 1].replace(/\W/g, '')),
            });
          }
        });
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', () => {
        resolve(droneSquadInfo);
      });
  });
}

async function generateLocationInfo(
  inputAbsPath: string
): Promise<LocationsDTO> {
  const locationsInfo: LocationsDTO = {
    locations: [],
  };

  return new Promise((resolve, reject) => {
    createReadStream(inputAbsPath)
      .pipe(parse({ delimiter: ',', fromLine: 2 }))
      .on('data', (row: string[]) => {
        locationsInfo.locations.push({
          name: row[0],
          packagesWeight: Number(row[1].replace(/\W/g, '')),
        });
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', () => {
        resolve(locationsInfo);
      });
  });
}

export { handleCSVInput };
