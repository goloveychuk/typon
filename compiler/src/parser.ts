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
  apply,
} from './parsec';
import {TokenPosition} from './types';

import {createNode, TokenKind, Node, ast, createNodeArray, NodeArray, AnyTokenOrNode} from './types';
function createPosForNodesRange(
  start: AnyTokenOrNode,
  end: AnyTokenOrNode,
): TokenPosition {
  return {
    index: start.pos.index,
    indexEnd: end.pos.indexEnd,
    columnBegin: start.pos.columnBegin,
    rowBegin: start.pos.rowBegin,
    columnEnd: end.pos.columnEnd,
    rowEnd: end.pos.rowEnd,
  };
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
  ['skipOnParse', /^\/\/[^\n]*/g, TokenKind.Comment],
  [false, /^\s+/g, TokenKind.Space],
]);

// const numberListParser = list_sc(tok(TokenKind.Number), str(','));

const trueLiteral = apply(
  tok(TokenKind.True),
  (token): Node<ast.TrueLiteral> => {
    return createNode({ kind: 'TrueLiteral' }, token.pos);
  },
);

const falseLiteral = apply(
  tok(TokenKind.False),
  (token): Node<ast.FalseLiteral> => {
    return createNode({ kind: 'FalseLiteral' }, token.pos);
  },
);

const stringLiteral = apply(
  tok(TokenKind.StringLiteral),
  (token): Node<ast.StringLiteral> => {
    return createNode({ kind: 'StringLiteral', val: token.text }, token.pos);
  },
);

const numberLiteral = apply(
  tok(TokenKind.NumberLiteral),
  (token): Node<ast.NumberLiteral> => {
    return createNode(
      { kind: 'NumberLiteral', val: Number(token.text) },
      token.pos,
    );
  },
);

const objectRule = rule<TokenKind, Node<ast.ObjectDeclaration>>();

const propVal = alt(
  trueLiteral,
  falseLiteral,
  stringLiteral,
  numberLiteral,
  objectRule,
);

const propIdentifier = apply(
  tok(TokenKind.Identifier),
  (token): Node<ast.Identifier> => {
    return createNode({ kind: 'Identifier', name: token.text }, token.pos);
  },
);

const optPropName = opt_sc(kleft(propIdentifier, tok(TokenKind.PropSep)));

const propDecl = apply(
  seq(optPropName, propVal),
  ([name, val]): Node<ast.Property> => {
    return createNode<ast.Property>(
      {
        kind: 'Property',
        name,
        val,
      },
      createPosForNodesRange(name ?? val, val),
    );
  },
);

const props = apply(
  opt_sc(
    kleft(
      list_sc(propDecl, tok(TokenKind.Comma)),
      opt_sc(tok(TokenKind.Comma)),
    ),
  ),
  (val): NodeArray<ast.Property> => {
    return createNodeArray(val ?? []);
  },
);

const typeName = apply(
  tok(TokenKind.Identifier),
  (token): Node<ast.Identifier> =>
    createNode({ kind: 'Identifier', name: token.text }, token.pos),
);

const objBody = seq(
  tok(TokenKind.OpenBracket),
  props,
  tok(TokenKind.CloseBracket),
);

const fullObjDecl = apply(
  seq(opt_sc(typeName), objBody),
  ([typeName, [_startBody, props, _endBody]]) => ({
    typeName,
    props,
    _start: typeName ?? _startBody,
    _end: _endBody,
  }),
);
const shortObjDecl = apply(typeName, (typeName) => ({
  typeName,
  props: createNodeArray<ast.Property>([]),
  _start: typeName,
  _end: typeName,
}));

const objectParser = apply(
  alt(fullObjDecl, shortObjDecl),
  ({ typeName, props, _start, _end }): Node<ast.ObjectDeclaration> => {
    return createNode(
      {
        kind: 'ObjectDeclaration',
        typeName,
        properties: props,
      },
      createPosForNodesRange(_start, _end),
    );
  },
);

objectRule.setPattern(objectParser);

const rootParser = objectParser;



export const parse = (codeToParse: string) => {
  const tokens = tokenizer.parse(codeToParse);
  // debugger
  const res2 = expectEOF(rootParser.parse(tokens));
  const res = expectSingleResult(res2);
  debugger
  // const visitor = (node: Node) => {
  //   console.log(node.ast.kind, node.pos.index, node.pos.indexEnd)
  //   forEachChild(node, visitor)
  // }
  // forEachChild(res, visitor)

  return res;
};
