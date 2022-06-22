import { DroneSquadDTO } from '../useCases/DTOs/DronesDTO';
import { LocationsDTO } from '../useCases/DTOs/LocationsDTO';
import { IDroneDelivery, ITripCollection } from './interfaces';

import { parse } from 'csv-parse';

import { createReadStream, appendFileSync } from 'fs';
import { resolve } from 'path';

async function handleCSVInput(inputPath: string) {
  const inputAbsPath = resolve(process.cwd(), inputPath);

  const locationPayload = await generateLocationInfo(inputAbsPath);
  const droneSquadPayload = await generateDroneSquadInfo(inputAbsPath);

  return { locationPayload, droneSquadPayload };
}

async function handleCSVOutput(
  response: ITripCollection[],
  outputPath: string
) {
  const outputAbsPath = resolve(process.cwd(), outputPath);
  const parsedOutput = generateOutputResponse(response);

  appendFileSync(outputAbsPath, '***BEGIN OUTPUT FILE #1***\n');

  for (const item in parsedOutput) {
    if (Object.prototype.hasOwnProperty.call(parsedOutput, item)) {
      try {
        appendFileSync(outputAbsPath, parsedOutput[item].toString(), 'utf-8');
      } catch (err) {
        console.error(err);
      }
    }
  }

  appendFileSync(outputAbsPath, '\n ***END OUTPUT FILE #1*** \n\n');
}

function generateOutputResponse(response: ITripCollection[]) {
  const dronesByTrips: any = {};

  response.map((trip) => {
    trip.deliveries.map((delivery) => {
      const droneId = delivery.drone.getId;
      const description = trip.description;

      if (droneId) {
        const droneItem = dronesByTrips[droneId!];
        const isInitial = droneItem ? false : true;

        const plainOutput = formatOutputToPlain(
          handleOutputFormat(delivery, description, droneId),
          isInitial
        );

        dronesByTrips[droneId!] = !isInitial
          ? droneItem.concat([plainOutput])
          : [plainOutput];
      }
    });
  });

  return dronesByTrips;
}

function formatOutputToPlain(formatted: any, isInitial: boolean) {
  return isInitial
    ? `\n${formatted.name}\n${formatted.description}\n${formatted.locations}\n\n`
    : `${formatted.description}\n${formatted.locations}\n\n`;
}

function handleOutputFormat(
  delivery: IDroneDelivery,
  description: string,
  droneId: string
) {
  return {
    id: droneId,
    description: description,
    name: delivery.drone.getName,
    locations: delivery.targets.map((i) => i.getName).join(','),
  };
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

export { handleCSVInput, handleCSVOutput };
