import { Node, Program } from './types';

enum TypeNodeKind {
  string,
  boolean,
  number,
  object,
  dict,
  array,
}

interface ObjectType {
  kind: TypeNodeKind.object;
  properties: Record<string, TypeNode>;
}

interface StringType {
  kind: TypeNodeKind.string;
}

interface BooleanType {
  kind: TypeNodeKind.boolean;
}
interface NumberType {
  kind: TypeNodeKind.number;
}
interface DictType {
  kind: TypeNodeKind.dict;
  // elements: Record<string,
}

interface ArrayType {
  kind: TypeNodeKind.array;
  elements: TypeNode[];
}

type AnyTypeNode =
  | ObjectType
  | BooleanType
  | StringType
  | NumberType
  | DictType;

class TypeNode<T extends AnyTypeNode = AnyTypeNode> {
  type: T;
  node: Node;
}

function msg(parts: TemplateStringsArray, dict: Record<string, any>): string {}

const msgs = {
  typeIsNotAssignable(targetType: TypeNode, sourceType: TypeNode): string {},
};

const is = {
  boolean(type: TypeNode): type is TypeNode<BooleanType> {
    return type.type.kind === TypeNodeKind.boolean;
  },
  string(type: TypeNode): type is TypeNode<StringType> {
    return type.type.kind === TypeNodeKind.string;
  },
  number(type: TypeNode): type is TypeNode<NumberType> {
    return type.type.kind === TypeNodeKind.number;
  },
  object(type: TypeNode): type is TypeNode<ObjectType> {
    return type.type.kind === TypeNodeKind.object;
  },
};

function checkBoolean(
  program: Program,
  targetType: TypeNode<BooleanType>,
  sourceType: TypeNode,
) {
  if (sourceType.type.kind !== TypeNodeKind.boolean) {
    return program.diagnostic(
      sourceType.node,
      'error',
      msgs.typeIsNotAssignable(targetType, sourceType),
    );
  }
  return true;
}

function checkDict(
  program: Program,
  node: Node,
  targetType: TypeNode<DictType>,
) {}

function checkTypeConstruct(
  program: Program,
  node: Node,
  targetType: TypeNode,
) {
  if (!is.object(sourceType)) {
    return program.diagnostic(
      sourceType.node,
      'error',
      msgs.typeIsNotAssignable(targetType, sourceType),
    );
  }
  for (const [propName, propType] of Object.entries(
    sourceType.type.properties,
  )) {
    const nodeFromSource = sourceType.type.properties[propName];
    
    checkType(program, propType, nodeFromSource)
  }
}

function checkType(
  program: Program,
  targetType: TypeNode,
  sourceType: TypeNode,
) {
  if (is.boolean(targetType)) {
    return checkBoolean(program, targetType, sourceType);
  }
}
