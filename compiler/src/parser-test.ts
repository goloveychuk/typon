import {
  buildLexer,
  seq,
  list_sc,
  tok,
  rule,
  str,
  opt,
  opt_sc,
  alt,
  kmid,
  kleft,
  kright,
  expectEOF,
  expectSingleResult,
  Token,
  apply,
} from './lib';

enum TokenKind {
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

  type PropertyValLike =
    | StringLiteral
    | NumberLiteral
    | TrueLiteral
    | FalseLiteral
    | ObjectDeclaration;

  export interface Property {
    kind: 'Property';
    name: string | undefined;
    val: PropertyValLike;
  }

  export interface ObjectDeclaration {
    kind: 'ObjectDeclaration';
    typeName: string | undefined;
    properties: Property[];
  }
}

const tokenizer = buildLexer([
  [true, /^'([^'\n]|\\.)*'/g, TokenKind.StringLiteral],
  [true, /^"([^"\n]|\\.)*"/g, TokenKind.StringLiteral],
  [true, /^[\+\-]?\d+(\.\d+)?/g, TokenKind.NumberLiteral],

  [true, /^true/g, TokenKind.True],
  [true, /^false/g, TokenKind.False],
  [true, /^{/g, TokenKind.OpenBracket],
  [true, /^}/g, TokenKind.CloseBracket],
  [true, /^\w+/g, TokenKind.Identifier],
  [true, /^:/g, TokenKind.PropSep],
  [true, /^,/g, TokenKind.Comma],
  [false, /^\/\/[^\n]*/g, TokenKind.Comment],
  [false, /^\s+/g, TokenKind.Space],
]);

const rootParser = kleft(
  apply(tok(TokenKind.NumberLiteral), (t) => ({
    kind: 'number',
    val: +t.text,
  })),
  apply(tok(TokenKind.Comma), () => 'comma'),
);

export const parse = (codeToParse: string) => {
  const tokens = tokenizer.parse(codeToParse);
  const res2 = expectEOF(rootParser.parse(tokens));
  const res = expectSingleResult(res2);
  // res.
  return res;
};

parse(`123,`);
