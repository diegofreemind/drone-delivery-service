import { DeliveryUseCase } from './useCases';
import { createReadStream } from 'fs';
import { Command } from 'commander';
import { parse } from 'csv-parse';
import { resolve } from 'path';

const deliveryUseCase = new DeliveryUseCase();
const program = new Command();

program
  .command('execute')
  .description('Process the locations and drones files')
  .argument('[inputPath]', 'Path for input file', './input.csv')
  .argument('[outputPath]', 'Path for output file', './output.csv')
  .action((inputPath, outputPath) => {
    // TODO: read file from command path
    // TODO: parse and execute from action

    // deliveryUseCase.execute();
    const inputAbsPath = resolve(process.cwd(), inputPath);
    const outputAbsPath = resolve(process.cwd(), outputPath);

    createReadStream(inputAbsPath)
      .pipe(parse({ delimiter: ',' }))
      .on('data', function (row: any) {
        console.log(row);
      });

    console.log({ inputAbsPath, outputAbsPath });
  });

program.parse();
