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

namespace ast {
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

// const numberListParser = list_sc(tok(TokenKind.Number), str(','));

const trueLiteral = apply(tok(TokenKind.True), (): ast.TrueLiteral => {
  return { kind: 'TrueLiteral' };
});

const falseLiteral = apply(tok(TokenKind.False), (): ast.FalseLiteral => {
  return { kind: 'FalseLiteral' };
});

const stringLiteral = apply(
  tok(TokenKind.StringLiteral),
  (v): ast.StringLiteral => {
    return { kind: 'StringLiteral', val: v.text };
  },
);

const numberLiteral = apply(
  tok(TokenKind.NumberLiteral),
  (v): ast.NumberLiteral => {
    return { kind: 'NumberLiteral', val: Number(v.text) };
  },
);

const objectRule = rule<TokenKind, ast.ObjectDeclaration>();

const propVal = alt(
  trueLiteral,
  falseLiteral,
  stringLiteral,
  numberLiteral,
  objectRule,
);

const propIdentifier = apply(tok(TokenKind.Identifier), (val) => val.text);

const optPropName = opt_sc(kleft(propIdentifier, tok(TokenKind.PropSep)));

const propDecl = apply(
  seq(optPropName, propVal),
  ([name, val]): ast.Property => {
    return {
      kind: 'Property',
      name,
      val,
    };
  },
);

const props = apply(
  opt_sc(
    kleft(
      list_sc(propDecl, tok(TokenKind.Comma)),
      opt_sc(tok(TokenKind.Comma)),
    ),
  ),
  (val): ast.Property[] => {
    return val;
  },
);

const typeName = apply(tok(TokenKind.Identifier), (v) => v.text);

const objBody = kmid(
  tok(TokenKind.OpenBracket),
  props,
  tok(TokenKind.CloseBracket),
);

const fullObjDecl = apply(
  seq(opt_sc(typeName), objBody),
  ([typeName, props]) => ({ typeName, props }),
);
const shortObjDecl = apply(typeName, (typeName) => ({ typeName, props: [] }));

const objectParser = apply(
  alt(fullObjDecl, shortObjDecl),
  ({ typeName, props }): ast.ObjectDeclaration => {
    return {
      kind: 'ObjectDeclaration',
      typeName,
      properties: props ?? [],
    };
  },
);

objectRule.setPattern(objectParser);

const rootParser = objectParser;

const codeToParse = `
{}

`

const codeToParse2 = `
{    
    // asd: 23,
    // asd3: true,
    // text: 'sd    "f',
    // text2: "sdfdf'",
    nested: SomeType {
        x: {

        },
        prop: 'sdf',
    },
    nested2: {
        prop: 'sdf', //comm
        //;;l
    },
    asd: Optional { String { }, },
}
`;

const tokens = tokenizer.parse(codeToParse);

const numberArray = expectSingleResult(expectEOF(rootParser.parse(tokens)));

console.log(JSON.stringify(numberArray, undefined, 4));
