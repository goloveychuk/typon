

namespace V {
  class StringLiteral {
    constructor() {}
  }

  export class Record {}
}




namespace M {
    // export const a = ''
}







namespace U {
    


    const name = stringLiteral({oneOf: ['a', 'b']})

    const props = record()

    const Model = Shape({
        name,
        props,
    })
}