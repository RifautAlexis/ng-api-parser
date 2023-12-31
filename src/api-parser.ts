import fs from 'fs-extra';
import { normalize } from 'path';
import ts from 'typescript';
import { sourceFileParser } from './ast-parser';
import ngs from './ng-structure';

export class ApiParser {
  private readonly typescriptFilesParsableRegex = /^((?!index).)*\.ts$/;

  private program?: ts.Program = undefined;
  private checker?: ts.TypeChecker = undefined;
  private readonly paths: string[];
  private typescriptFilePaths: string [] = []

  constructor(paths: string[]) {
    this.paths = paths;
    this.init(paths);
  }

  async parser(): Promise<ngs.ComponentStructure[]> {

    let componentsStructure: ngs.ComponentStructure[] = [];

    for (const path of this.paths) {
      await this.filterPath(path);
    }

    this.program = ts.createProgram(this.typescriptFilePaths, {});
    this.checker = this.program.getTypeChecker();

    for (const path of this.typescriptFilePaths) {
      const sourceFile = this.program.getSourceFile(path);
      componentsStructure.push(sourceFileParser(sourceFile!, this.checker));
    }
      
    return componentsStructure;
  }
  
  private init(paths: string[]): void {
    for (const path of paths) {
      if (!fs.existsSync(path)) {
        throw new Error(`${path} do not exist`);
      }
    }
  }

  private async filterPath(path: string): Promise<void> {
    try{
      const stats = await fs.promises.stat(path);
    
      if (stats.isFile() && this.typescriptFilesParsableRegex.test(path)) {
        this.typescriptFilePaths.push(path);
      } else if (stats.isDirectory()) {
        const files = await fs.promises.readdir(path);

        for (const file of files) {
          const filePath = normalize(`${path}\\${file}`);
          await this.filterPath(filePath);
        }
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  }
}
