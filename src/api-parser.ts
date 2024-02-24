import ts from 'typescript';
import { sourceFileParser } from './ast-parser';
import ngs from './ng-structure';

export class ApiParser {

  private program?: ts.Program = undefined;
  private checker?: ts.TypeChecker = undefined;

  parser(path: string): ngs.ComponentStructure[] {
    let componentsStructure: ngs.ComponentStructure[] = [];

    this.program = ts.createProgram([path], {});
    this.checker = this.program.getTypeChecker();

    const sourceFile = this.program.getSourceFile(path);
    componentsStructure.push(sourceFileParser(sourceFile!, this.checker));
    
    return componentsStructure;
  }
}
