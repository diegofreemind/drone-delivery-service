import { handleCSVInput } from './shared/transformers';
import { DeliveryUseCase } from './useCases';
import { Command } from 'commander';

const deliveryUseCase = new DeliveryUseCase();
const program = new Command();

program
  .command('execute')
  .description('Process the locations and drones files')
  .argument('[inputPath]', 'Path for input file', './input.csv')
  .argument('[outputPath]', 'Path for output file', './output.csv')
  .action((inputPath, outputPath) => {
    // deliveryUseCase.execute();
    handleCSVInput(inputPath, outputPath);
  });

program.parse();
