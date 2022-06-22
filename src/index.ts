#!/usr/bin/env node

import { handleCSVInput, handleCSVOutput } from './shared/transformers';
import { DeliveryUseCase } from './useCases';
import { Command } from 'commander';

const deliveryUseCase = new DeliveryUseCase();
const program = new Command();

program
  .command('execute')
  .description('Process the locations and drones files')
  .argument('[inputPath]', 'Path for input file', './input.csv')
  .argument('[outputPath]', 'Path for output file', './output.txt')
  .action(async (inputPath, outputPath) => {
    const parsedInput = await handleCSVInput(inputPath);
    const { droneSquadPayload, locationPayload } = parsedInput;

    const response = await deliveryUseCase.execute(
      droneSquadPayload,
      locationPayload
    );

    await handleCSVOutput(response, outputPath);
  });

program.parse();
