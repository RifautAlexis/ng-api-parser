import cs from '../component-structure';
import ts from 'typescript';

export function callExpressionParser(node: ts.CallExpression): cs.CallExpressionParsed {
    let decoratorArguments: Array<cs.PropertyAssignmentParsed[]> = [];
    for (let argument of node.arguments) {
        if (ts.isObjectLiteralExpression(argument)) {
            const decoratorPropertie = objectLitteralExpressionParser(argument);
            if(decoratorPropertie !== undefined) {
                decoratorArguments.push(objectLitteralExpressionParser(argument));
            }
        }
    }

    return {
        name: leafParser(node.expression) as cs.DecoratorType,
        values: decoratorArguments.length > 0 ? decoratorArguments : undefined,
    };
}

export function objectLitteralExpressionParser(node: ts.ObjectLiteralExpression): cs.PropertyAssignmentParsed[] | undefined {
    const properties: cs.PropertyAssignmentParsed[] = [];
    for (const property of node.properties) {
        if(ts.isPropertyAssignment(property)) {
            properties.push(propertyAssignmentParser(property));
        }
    }
    return properties.length > 0 ? properties : undefined;
}

export function propertyAssignmentParser(node: ts.PropertyAssignment): cs.PropertyAssignmentParsed {
    return {
        name: leafParser(node.name) as string,
        value: leafParser(node.initializer),
    };
}

export function leafParser(node: ts.Node): string | string[] | null | undefined {
  if(node === undefined) {
    return undefined;
  }

  switch (node.kind) {
    case ts.SyntaxKind.Identifier:
      return (node as ts.Identifier).text;
      
    case ts.SyntaxKind.StringLiteral:
      return (node as ts.StringLiteral).text;

    case ts.SyntaxKind.NumericLiteral:
      return (node as ts.NumericLiteral).text;

    case ts.SyntaxKind.TrueKeyword:
    case ts.SyntaxKind.FalseKeyword:
    case ts.SyntaxKind.StringKeyword:
    case ts.SyntaxKind.NumberKeyword:
    case ts.SyntaxKind.BooleanKeyword:
    case ts.SyntaxKind.AnyKeyword:
    case ts.SyntaxKind.BigIntKeyword:
    case ts.SyntaxKind.NeverKeyword:
    case ts.SyntaxKind.ObjectKeyword:
    case ts.SyntaxKind.SymbolKeyword:
    case ts.SyntaxKind.IntrinsicKeyword:
    case ts.SyntaxKind.UndefinedKeyword:
    case ts.SyntaxKind.UnknownKeyword:
    case ts.SyntaxKind.VoidKeyword:
      return node.getText();

    case ts.SyntaxKind.ArrayLiteralExpression:
      const arrayValues: string[] = [];
      
      const elements: ts.NodeArray<ts.Expression> = (node as ts.ArrayLiteralExpression).elements;

      for (const element of elements) {
        arrayValues.push(leafParser(element) as string);
      }
      
      return arrayValues;

    case ts.SyntaxKind.ObjectLiteralExpression:
      return (node as ts.ObjectLiteralExpression).getText();

    case ts.SyntaxKind.FunctionExpression:
      return (node as ts.FunctionExpression).getText();

    case ts.SyntaxKind.ArrowFunction:
      return (node as ts.ArrowFunction).getText();

    
    case ts.SyntaxKind.TypeReference:
      return leafParser((node as ts.TypeReferenceNode).typeName);

    default:
      return null;
  }
}

export function visibilityParser(modifiers?: ts.NodeArray<ts.ModifierLike>): cs.Visibility {
  if(modifiers === undefined){
    return cs.Visibility.Public;
  }
  
  for (const modifier of modifiers) {
    if(modifier.kind === ts.SyntaxKind.PrivateKeyword) {
      return cs.Visibility.Private;
    } else if(modifier.kind === ts.SyntaxKind.ProtectedKeyword) {
      return cs.Visibility.Protected;
    } else if(modifier.kind === ts.SyntaxKind.PublicKeyword) {
      return cs.Visibility.Public;
    }
  }
  return cs.Visibility.Public;
}