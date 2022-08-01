import { Token, TokenPosition } from "./parsec";
import { forEachChild } from "./utils";


export {Token, TokenPosition};

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
  

export class Binding {

}

  
export class Node<A extends ast.All = ast.All> {
    __nodeBrand: '';
    parent?: Node
    binding?: Binding
    constructor(readonly ast: A, readonly pos: TokenPosition) {}
    // get start() {
    //     return this.position
    // }
    // get end() {

    // }
  }
  
  export interface NodeArray<A extends ast.All = ast.All> extends Array<Node<A>> {
    __nodeArrayBrand: '';
    pos: TokenPosition | undefined
  }
  
  export function createNode<A extends ast.All>(ast: A, pos: TokenPosition) {
    const node = new Node<A>(ast, pos);
    forEachChild(node, child=> {
        child.parent = node
    })
    return node
  }
  export function createNodeArray<A extends ast.All>(nodes: Node<A>[]) {
    const arr = nodes.slice() as NodeArray<A>;
    // arr.pos //todo
    return arr
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


  export class Program {
    diagnostic(node: Node,type: 'error'  | 'warning', msg: string) {

    }
  }