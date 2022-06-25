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

