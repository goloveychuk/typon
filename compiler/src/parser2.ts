import {
  buildLexer, ParserOutput,
  
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
  Colon,
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
  [true, /^:/g, TokenKind.Colon],
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

const optPropName = opt_sc(kleft(propIdentifier, tok(TokenKind.Colon)));

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

interface Token {
  kind: TokenKind
}

class ParsingContext {

  diagnostics = []

  forceReadToken(tokenKind: TokenKind, errMsg?: string): Token  {
    const token = this.tryReadToken(tokenKind);
    if (token === undefined) {
      const err = errMsg ?? `expecting ${TokenKind[tokenKind]}`
      this.diagnostics.push(err);
    }
  }
  isNextToken(tokenKind: TokenKind): boolean {
  }
  getNextToken(): Token {
  }

  // tryReadToken(tokenKind: TokenKind): Token | null {

  // }
}


function parseList<T>(ctx: ParsingContext, parseItem: (ctx: ParsingContext) => T, sep: TokenKind, end: TokenKind) {
  const items: T[] = [];
  while (true) {
    if (ctx.isNextToken(end))  {
      break
    }
    if (items.length > 0) {
      ctx.forceReadToken(sep) //stopping parsing?
    }
    const item = parseItem(ctx);
    items.push(item)
  }
  if (items.length) {

  }
  return items
}

function parseProperty(ctx: ParsingContext): ast.Property {

  branch( (reader) => {
    readOrStop(Identifier)
    readOrStop(Colon)
    
    parsePropertyValue(ctx)
  })

  
  
  mbReadToken(TokenKind.Comma)

  return {
    kind: 'Property',
    name,
  }
}

function parseObject(ctx: ParsingContext): ast.ObjectDeclaration {
  ctx.forceReadToken(TokenKind.OpenBracket)


  const properties = parseList(ctx, parseProperty, TokenKind.Comma, TokenKind.CloseBracket)
  ctx.forceReadToken(TokenKind.CloseBracket)

}

function parseRoot(ctx: ParsingContext) {
  return parseObject(ctx)
}

export const parse = (codeToParse: string) => {
  const tokens = tokenizer.parse(codeToParse);
  
  
  return res
}


{
  asd: 




