import ngs from '../ng-structure';
import ts from 'typescript';
import { callExpressionParser, leafParser, visibilityParser } from './utils';

export function classParser(classDeclaration: ts.ClassDeclaration, checker: ts.TypeChecker): ngs.ComponentStructure {
  const compStruct: ngs.ComponentStructure = {
    kind: ngs.ContentKind.Class,
    className: '',
    isExported: false,
    comment: commentParser(classDeclaration, checker),
  };

  classDeclaration.forEachChild((node) => {
    switch (node.kind) {
      case ts.SyntaxKind.Decorator:
        const decortor = decoratorParser(node as ts.Decorator);
        if (decortor) {
          compStruct.classDecorators = [...(compStruct.classDecorators || []), ];
        }
        break;
      case ts.SyntaxKind.ExportKeyword:
        compStruct.isExported = true;
        break;
      case ts.SyntaxKind.Identifier:
        compStruct.className = node.getText();
        break;
      case ts.SyntaxKind.HeritageClause:
        const heritageClause = node as ts.HeritageClause;
        switch (heritageClause.token) {
          case ts.SyntaxKind.ExtendsKeyword:
            compStruct.extends = heritageClauseParser(heritageClause);
            break;
        
          case ts.SyntaxKind.ImplementsKeyword:
            compStruct.implements = heritageClauseParser(heritageClause);
            break;
        }
        break;
      case ts.SyntaxKind.PropertyDeclaration:
        const property = node as ts.PropertyDeclaration;

        const propertyParsed = propertyDeclarationParser(property, checker);

        const decorator = property.modifiers?.find(modifier => ts.isDecorator(modifier)) as ts.Decorator | undefined;
        
        if(decorator) {
          const propertyDecorator = decoratorParser(decorator)!;
          switch (propertyDecorator.kind) {
            case ngs.DecoratorType.Input:
              compStruct.inputDecorators = [...(compStruct.inputDecorators || []), {
                ...propertyDecorator,
                ...propertyParsed,
              }];
              break;
            case ngs.DecoratorType.Output:
              compStruct.outputDecorators = [...(compStruct.outputDecorators || []), {
                ...propertyDecorator,
                ...propertyParsed,
              }];
              break;
            default:
              break;
          }
        } else {
          compStruct.properties = [...(compStruct.properties || []), propertyParsed];
        }
        break;
      case ts.SyntaxKind.ExportKeyword:
        break;
      case ts.SyntaxKind.Constructor:
        break;
      case ts.SyntaxKind.MethodDeclaration:
        break;

      default:
        break;
    }
  });

  return compStruct;
}

function propertyDeclarationParser(node: ts.PropertyDeclaration, checker: ts.TypeChecker): ngs.Property {
  return {
    name: leafParser(node.name) as string,
    visibility: visibilityParser(node.modifiers),
    comment: commentParser(node, checker),
    isOptional: node.questionToken !== undefined,
    type: leafParser(node.type!) as string,
    defaultValue: leafParser(node.initializer!),
  };
}

function commentParser(node: ts.Node, checker: ts.TypeChecker): string | undefined {
  if('name' in node) {
    const propertyName = node.name as ts.PropertyName;
    const symbol = checker.getSymbolAtLocation(propertyName);
    if (symbol) {
      return ts.displayPartsToString(symbol.getDocumentationComment(checker));
    }
  }
  
  return undefined;
}

function decoratorParser(node: ts.Decorator): ngs.Decorator | undefined {
  if(ts.isCallExpression(node.expression)){
    let decoratorType = callExpressionParser(node.expression);
    return {
      kind: ngs.DecoratorType[decoratorType.name],
      arguments: decoratorType.values,
    };
  }

  return undefined;
}

function heritageClauseParser(heritageClause: ts.HeritageClause): string[] {
  let types: string[] = [];

  for (const type of heritageClause.types) {
    types.push(leafParser(type.expression) as string);
  }

  return types;
}