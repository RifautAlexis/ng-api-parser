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
      alias: "p",
      describe: "path to the directory to analyze",
      demandOption: true,
      type: "string",
      requiresArg: true,
      string: true,
    });
    yargs.option("output", {
      alias: "o",
      describe: "path to write result in a file",
      demandOption: false,
      type: "string",
      normalize: true,
      requiresArg: false,
      string: true,
    });
    yargs.option("exclude", {
      alias: "e",
      describe: "exclude files to parse, based on one or more glob",
      demandOption: false,
      type: "string",
      requiresArg: false,
      string: true,
      array: true,
    });
    yargs.option("parentRelated", {
      alias: "pr",
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
    const paths: string[] = argv["path"];
    let output: string = argv["output"];
    const filesToExclude: string[] | undefined = argv["exclude"];
    const parentRelated: boolean = argv["parentRelated"];

    const matchFileRegex = /(!?[\w-]+\..*)/m;

    if (parentRelated && !!output && matchFileRegex.test(output)) {
      throw new Error(
        "May not specify a file as an output path when parentRelated option is set to true"
      );
    }

    const apiParser = new ApiParser();

    for (const filepath of getPaths(paths, filesToExclude)) {
      const parserResults = apiParser.parser(filepath);

      for (const parserResult of parserResults) {

        if (parentRelated) {
          const parentDirectory = path.basename(path.dirname(filepath));
          const outputPathRoot: string = output ?? './output/';
          const outputPath = path.join(outputPathRoot, parentDirectory, path.basename(filepath).replace(/.ts$/, '.json')); // `${outputpath}${parentDirectory}/${path.basename(filepath).replace(/.ts$/, '.json')}`
          await fs.outputJSON(outputPath, parserResult, { spaces: 2 });
          
        } else {
          const outputPath = output ?? "./output.json";
          await fs.outputJSON(outputPath, parserResult, { spaces: 2 });
        }
      }
    }
  },
};

const getPaths = (paths: string[], filesToExclude?: string[]): string[] => {
  const glob = new Glob(paths, {
    ignore: filesToExclude,
    nodir: true,
  });

  const pathFiles: string[] = [];
  for (const file of glob) {
    pathFiles.push(file);
  }
  return pathFiles;
};
