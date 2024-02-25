import { CommandModule } from "yargs";
import { ApiParser } from "../api-parser";
import fs from "fs-extra";
import ngs from "../ng-structure";
import { glob, globSync, globStream, globStreamSync, Glob } from "glob";
import * as path from "path";

export const generateCommand: CommandModule = {
  command: ["generate"],
  describe: "Generate a API documention",
  builder: (yargs) => {
    yargs.option("path", {
      alias: "P",
      describe: "path to the directory to analyze",
      demandOption: true,
      type: "string",
      requiresArg: true,
      string: true,
    });
    yargs.option("output", {
      alias: "O",
      describe: "path to write result in a file",
      demandOption: false,
      type: "string",
      normalize: true,
      requiresArg: false,
      string: true,
    });
    yargs.option("exclude", {
      alias: "E",
      describe: "exclude files to parse, based on one or more glob",
      demandOption: false,
      type: "string",
      requiresArg: false,
      string: true,
      array: true,
    });
    yargs.option("parentRelated", {
      alias: "PR",
      describe: "exclude files to parse, based on one or more glob",
      demandOption: false,
      type: "boolean",
      requiresArg: false,
      boolean: true,
      default: false,
    });

    return yargs;
  },
  handler: async (argv: any) => {
    const sourcePath: string = argv["path"];
    let output: string = argv["output"];
    const filesToExclude: string[] | undefined = argv["exclude"];
    const parentRelated: boolean = argv["parentRelated"];

    const matchFileRegex = /(!?[\w-]+\..*)/m;
    const matchJsonFileRegex = /(!?[\w-]+\.json)/m;

    if (parentRelated && !!output && matchFileRegex.test(output)) {
      throw new Error(
        "May not specify a file as an output path when parentRelated option is set to true"
      );
    }
    if(!parentRelated && !!output && !matchJsonFileRegex.test(output)) {
      throw new Error(
        "The specified output value is not a file with .json extension "
      );
    }

    let parserResults: ngs.ComponentStructure[] = [];

    if (!parentRelated) {
      for (const filepathFiltered of getPaths(sourcePath, filesToExclude)) {
        const apiParser = new ApiParser();
        parserResults.push(...apiParser.parser(filepathFiltered));
      }

      const outputPath = output ?? "./output.json";
      
      await fs.outputJSON(outputPath, parserResults, { spaces: 2 });

    } else {
      for (const filepathFiltered of getPaths(sourcePath, filesToExclude)) {
        const apiParser = new ApiParser();
        parserResults = apiParser.parser(filepathFiltered);

        for (const parserResult of parserResults) {
          const parentDirectory = path.basename(path.dirname(filepathFiltered));
          const outputPathRoot: string = output ?? './output/';
          const outputPath = path.join(outputPathRoot, parentDirectory, path.basename(filepathFiltered).replace(/.ts$/, '.json'));
          await fs.outputJSON(outputPath, parserResult, { spaces: 2 });
        }
      }
    }
  },
};

const getPaths = (path: string, filesToExclude?: string[]): string[] => {
  const typescriptFileRegex = /^.*\.ts$/;

  const glob = new Glob(path, {
    ignore: filesToExclude,
    nodir: true,
  });

  const pathFiles: string[] = [];
  for (const file of glob) {
    if(typescriptFileRegex.test(file)){
      pathFiles.push(file);
    }
    
  }

  return pathFiles;
};
