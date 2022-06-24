import { Token, TokenPosition } from "./lib";



export enum TokenKind {
    OpenBracket,
    CloseBracket,
    Space,
    StringLiteral,
    NumberLiteral,
    True,
    False,
    Identifier,
    PropSep,
    Comment,
    Comma,
  }
  

  
export class Node<A extends ast.All = ast.All> {
    __nodeBrand: '';
    constructor(readonly ast: A, readonly pos: TokenPosition) {}
    // get start() {
    //     return this.position
    // }
    // get end() {

    // }
  }
  
  export class NodeArray<A extends ast.All = ast.All> {
    __nodeArrayBrand: '';
    [Symbol.iterator]() {
        return this.nodes[Symbol.iterator]()
    }

    map: Array<Node>['map']

    constructor(readonly nodes: Node<A>[]) {
        this.map = nodes.map;
    }
  }
  
  export function createNode<A extends ast.All>(ast: A, pos: TokenPosition) {
    return new Node<A>(ast, pos);
  }
  export function createNodeArray<A extends ast.All>(nodes: Node<A>[]) {
    return new NodeArray<A>(nodes);
  }
  
  export namespace ast {
    export interface StringLiteral {
      kind: 'StringLiteral';
      val: string;
    }
  
    export interface NumberLiteral {
      kind: 'NumberLiteral';
      val: number;
    }
  
    export interface TrueLiteral {
      kind: 'TrueLiteral';
    }
  
    export interface FalseLiteral {
      kind: 'FalseLiteral';
    }
  
    export interface Identifier {
      kind: 'Identifier';
      name: string;
    }
  
    type PropertyValLike =
      | StringLiteral
      | NumberLiteral
      | TrueLiteral
      | FalseLiteral
      | ObjectDeclaration;
  
    export interface Property {
      kind: 'Property';
      name: Node<Identifier> | undefined;
      val: Node<PropertyValLike>;
    }
  
    export interface ObjectDeclaration {
      kind: 'ObjectDeclaration';
      typeName: Node<Identifier> | undefined;
      properties: NodeArray<Property>;
    }
  
    export type All =
      | StringLiteral
      | NumberLiteral
      | TrueLiteral
      | FalseLiteral
      | Property
      | ObjectDeclaration
      | Identifier;
  }
  
  export type AnyTokenOrNode = Token<TokenKind> | Node;