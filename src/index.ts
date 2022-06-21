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
  .action(async (inputPath, outputPath) => {
    const parsed = await handleCSVInput(inputPath);

    const res = await deliveryUseCase.execute(
      parsed.droneSquadPayload,
      parsed.locationPayload
    );

    console.log(JSON.stringify(res));
    console.log(res.length);
  });

program.parse();
