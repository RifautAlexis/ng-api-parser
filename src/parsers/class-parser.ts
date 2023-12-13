import cs from '../component-structure';
import ts from 'typescript';
import { callExpressionParser, leafParser, visibilityParser } from './utils';

export function classParser(classDeclaration: ts.ClassDeclaration, checker: ts.TypeChecker): cs.ComponentStructure {
  const compStruct: cs.ComponentStructure = {
    kind: cs.ContentKind.Class,
    className: '',
    isExported: false,
    comment: commentParser(classDeclaration, checker),
  };

  classDeclaration.forEachChild((node) => {
    switch (node.kind) {
      case ts.SyntaxKind.Decorator:
        compStruct.classDecorators = [...(compStruct.classDecorators || []), decoratorParser(node as ts.Decorator)];
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
          const propertyDecorator = decoratorParser(decorator);
          switch (propertyDecorator.kind) {
            case cs.DecoratorType.Input:
              compStruct.inputDecorators = [...(compStruct.inputDecorators || []), {
                ...decoratorParser(decorator),
                ...propertyParsed,
              }];
              break;
            case cs.DecoratorType.Output:
              compStruct.outputDecorators = [...(compStruct.outputDecorators || []), {
                ...decoratorParser(decorator),
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

function propertyDeclarationParser(node: ts.PropertyDeclaration, checker: ts.TypeChecker): cs.Property {
  return {
    name: leafParser(node.name) as string,
    visibility: visibilityParser(node.modifiers),
    comment: commentParser(node, checker),
    isOptional: node.questionToken !== undefined,
    type: leafParser(node.type) as string,
    defaultValue: leafParser(node.initializer),
  };
}

function commentParser(node: ts.Node, checker: ts.TypeChecker): string | null {
  if('name' in node) {
    const propertyName = node.name as ts.PropertyName;
    const symbol = checker.getSymbolAtLocation(propertyName);
    if (symbol) {
      return ts.displayPartsToString(symbol.getDocumentationComment(checker));
    }
  }
  
  return null;
}

function decoratorParser(node: ts.Decorator): cs.Decorator {
  if(ts.isCallExpression(node.expression)){
    let decoratorType = callExpressionParser(node.expression);
    return {
      kind: cs.DecoratorType[decoratorType.name],
      arguments: decoratorType.values,
    };
  }
}

function heritageClauseParser(heritageClause: ts.HeritageClause): string[] {
  let types: string[] = [];

  for (const type of heritageClause.types) {
    types.push(leafParser(type.expression) as string);
  }

  return types;
}