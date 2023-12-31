import { CommandModule } from 'yargs';
import { ApiParser } from '../api-parser';
import fs from "fs-extra";

export const generateCommand: CommandModule = {
  command: ['generate'],
  describe: 'Generate a API documention',
  builder: (yargs) => {
    yargs.option('path', {
      describe: 'path to the directory to analyze',
      demandOption: true,
      type: 'string',
      normalize: true,
      requiresArg: true,
      string: true,
    });
    yargs.option('output', {
      describe: 'path to write result in a file',
      demandOption: false,
      type: 'string',
      normalize: true,
      requiresArg: false,
      string: true,
    });

    return yargs;
  },
  handler: async (argv: any) => {
    const apiParser = new ApiParser([argv['path']]);

    const parserResult = await apiParser.parser();

    const outputPath = argv['output'] || './output.json';
    await fs.writeJson(outputPath, parserResult, {spaces: 2});
  },
};
