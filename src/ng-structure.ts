namespace ngs {
  export interface FileContent {
    imports?: string[];
    content?: Array<ComponentStructure | InterfaceStructure | EnumStructure | FunctionStructure>;
  }

  export interface ComponentStructure extends StructureKind{
    classDecorators?: Decorator[];
    className: string;
    comment?: string;
    isExported: boolean;
    implements?: string[];
    extends?: string[];
    inputDecorators?: PropertyDecorator[];
    outputDecorators?: PropertyDecorator[];
    properties?: Property[];
  }

  export enum DecoratorType {
    Injectable = 'Injectable',
    Component = 'Component',
    Input = 'Input',
    Output = 'Output',
  }

  export enum ContentKind {
    Class = 'class',
    Interface = 'interface',
    Enum = 'enum',
    Function = 'function',
  }

  export interface Decorator {
    kind: DecoratorType;
    arguments?: Array<PropertyAssignmentParsed[]>;
  }

  export interface ClassDecorator extends Decorator {}

  export interface Property {
    name: string;
    visibility: Visibility;
    comment?: string;
    isOptional: boolean;
    type?: string;
    defaultValue?: defaultValue;
  }

  export type PropertyDecorator = Property & Decorator;

  export enum Visibility {
    Public,
    Private,
    Protected,
  }

  export type defaultValue =
    | string
    | number
    | boolean
    | Object
    | Array<string | number | boolean | Object>;

  export interface PropertyAssignmentParsed {
    name: string;
    value: defaultValue;
  }

  export interface CallExpressionParsed {
    name: DecoratorType;
    values: Array<PropertyAssignmentParsed[]> | undefined;
  }

  interface InterfaceStructure extends StructureKind{
    
  }

  interface EnumStructure extends StructureKind{
    
  }

  interface FunctionStructure extends StructureKind{
    
  }

  interface StructureKind {
    kind: ContentKind;
  }
}

export default ngs;