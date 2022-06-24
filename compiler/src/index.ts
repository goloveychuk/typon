import { parse } from './parser';
import * as M from './meta'

const code = `
{    
    name: 'asd',
    props: {
        a: { String, def: 'asd' },
        b: { Optional { String }, def:'asd' }
    }
}
`;

const code2 = `
{    
    name: 'asd',
    props: {
        a: String #def='asd'
        b: Optional ( String ) #def:'asd'
    }

    fns: {
      getCars: { args: (make: String, x: Optional ( Number ) ), returns: Boolean }
    }
}
`;


let x2 = `
(
  name: 'asd',
  asd: Prop (
    Java ( String, d: {} ), a: 'sd' )
  )
)
`

let b = `
{
  getPosts: Get {
    '/getPosts',
    
  }
}
`

type A = [d: string, b: number];

interface Node<Kind, D> {
  kind: Kind
  data: {[K in keyof D]: D[K]}
}

let a: Node<'', A> = {
  kind : '',
  data: []
}

a.data

const TypeLike = M.protocol();

const String = M.type({
  implements: [TypeLike],
});

const Boolean = M.type({
  implements: [TypeLike],
});

const Optional = M.type({
  constructors: [
    M.constructor({
      type: M.arg(TypeLike),
    }),
  ],
  implements: [TypeLike],
});

const Prop = M.type({
  constructors: [
    M.constructor({
      type: M.arg(TypeLike),
      description: M.namedArg(M.string()),
    }),
  ],
});

const Root = M.type({
  constructors: [
    M.constructor({
      name: M.namedArg(M.string()),
      props: M.namedArg(M.record(Prop)),
    }),
  ],
});

const Domain = M.domain({
  Types: {
    String,
    Boolean,
    Optional,
    Prop,
  },
  Root,
});

const parsed = parse(code);

console.log(JSON.stringify(parsed, undefined, 4));

let x= `
{
  a: {
    ..
  }
}
`

let y = `
{
  a: ..
}
`

function getSuggestionAtLocation(pos: number) {
  const node = findNodeForPos(pos); //is EmptyNode

  if (isPropertyValueLocation(node.parent)) {
    const prop = node.parent;

    // const objDecl = prop.parent // always ObjDecl

    const metaType = getMetaType(prop); //recursively find or already here?
    if (isErrorType(metaType)) {
      return []
    }
    if (metaType.type === 'protocol') {
      return findAllTypesConformsProtocol(metaType)
    }
    if (metaType.type === 'object') {

    }

  }
  if (isPropertyNameLocation(node.parent)) {
    if (metaType.type === 'argument') {

    }
  }
}

