
class Generic {

}

export class TypeFactory {

    addGeneric(name: string): Generic {
        return undefined as any;

    }
}


class Factory {

    addType(type: string): TypeFactory {
        return undefined as any;
    }
}



export const factory = new Factory()

