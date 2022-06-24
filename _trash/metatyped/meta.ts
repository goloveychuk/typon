const schema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { type: 'string' },
  },
};

const obj = {
  a: 'sdf',
  b: 'sdf',
};

namespace ast {

    // type St = Variable 
  export class Variable<T> {
      varType: T
      constructor(name: string) {}
      prop<K extends keyof T>(prop: K) {
          return new Variable<T[K]>('asd')
      }
  }

  export class ForEach<T> {
    constructor() {}

    static create<T>(variable: Variable<T[]>, action: (v: Variable<T>) => any) {

    }
  }

  export class Access<T> {
    constructor(variable: Variable<T>) {

    }
    static create<T, K extends keyof T>(v: Variable<T>, k: K) {
        return new Access<T[K]>('asd' as undefined)
    }
  }

  export class If {
    static create<T>(v: Variable<T>, k: K) {


    }
  }
  export const access = Access.create;
  export const foreach = ForEach.create;
}

type Schema =
  | {
      type: 'object';
    //   properties: Record<string, Schema>;
      properties: Array<Schema>
    }
//   | { type: 'string' };



let v = new ast.Variable<Schema>('schema')

// ast.foreach(v.prop('properties'), prop => {
//     ast.If(ast.op.eq(prop, ast.undefined))
// })


function validate1(schema, obj) {
    for (const prop in schema.properties) {
      const propS = schema.properties[prop];
      if (propS.type === 'string') {
          if (obj[prop]) 
      }
    }
  }

function validate2(obj) {
  if (typeof obj.a !== 'string') {
    throw 'sd';
  }
  if (typeof obj.b !== 'string') {
    throw 'sd';
  }
}

interface ForEach {
    type: 'foreach',
    var: 
}

let a = {
    type: 'foreach',
    var: {type: 'variable', ref: '$schema'} 
}