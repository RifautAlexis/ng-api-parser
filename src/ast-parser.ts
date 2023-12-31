import ngs from './ng-structure';
import ts from 'typescript';
import { classParser } from './parsers/class-parser';

export function sourceFileParser(sourceFile: ts.SourceFile, checker: ts.TypeChecker): ngs.ComponentStructure {
  let fileContent: Partial<ngs.FileContent> = {};

  sourceFile.forEachChild((child) => {

    switch (child.kind) {
      case ts.SyntaxKind.ImportDeclaration:
        const importDeclaration: ts.ImportDeclaration = child as ts.ImportDeclaration;
        fileContent.imports = [...(fileContent.imports || []), importDeclarationParser(importDeclaration)];
        break;

      case ts.SyntaxKind.ClassDeclaration:
        const classDeclaration: ts.ClassDeclaration = child as ts.ClassDeclaration;
        fileContent.content = [...(fileContent.content || []), classParser(classDeclaration, checker)];
        break;

      case ts.SyntaxKind.EnumDeclaration:
      case ts.SyntaxKind.InterfaceDeclaration:
      case ts.SyntaxKind.FunctionDeclaration:
        break;

      default:
        break;
    }
  });
  
  return fileContent as ngs.ComponentStructure;
}

function importDeclarationParser(
  node: ts.ImportDeclaration
): string {
    return node.getText();
}