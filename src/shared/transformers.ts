import { DroneSquadDTO } from '../useCases/DTOs/DronesDTO';
import { ILocation, LocationsDTO } from '../useCases/DTOs/LocationsDTO';

import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { resolve } from 'path';

async function handleCSVInput(inputPath: string, outputPath: string) {
  const inputAbsPath = resolve(process.cwd(), inputPath);
  const outputAbsPath = resolve(process.cwd(), outputPath);

  const l = await generateLocationInfo(inputAbsPath);
  const d = await generateDroneSquadInfo(inputAbsPath);

  return { l, d };
}

async function generateDroneSquadInfo(inputAbsPath: string) {
  const droneSquadInfo: DroneSquadDTO = {
    drones: [],
  };

  return new Promise((resolve, reject) => {
    createReadStream(inputAbsPath)
      .pipe(parse({ delimiter: ',', to_line: 1 }))
      .on('data', (row: string[]) => {
        console.log({ row });
        droneSquadInfo.drones.push({
          name: row[0],
          maxWeight: Number(row[1].replace(/\W/g, '')),
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

async function generateLocationInfo(inputAbsPath: string) {
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
