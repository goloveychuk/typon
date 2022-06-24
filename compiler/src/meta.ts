class TypeArgument {
  constructor(private data: { named: boolean; optional: boolean }) {}
  static createArg<T extends TypeLike>(type: T) {
    return new TypeArgument({ named: false, optional: false });
  }
  static createNamed<T extends TypeLike>(type: T) {
    return new TypeArgument({ named: true, optional: false });
  }
}

class Protocol {
  static create() {
    return new Protocol();
  }
}
class TypeConstructor {
  constructor(readonly data: { args: Record<string, TypeArgument> }) {}
  static create(args: Record<string, TypeArgument>) {
    return new TypeConstructor({ args });
  }
}
class MetaType {
  static create(data: {
    implements?: Protocol[];
    constructors?: TypeConstructor[];
  }) {
    return new MetaType();
  }
}

type PrimitiveKind = 'string' | 'number';

class Primitive {
  constructor(readonly data: { kind: PrimitiveKind }) {}
  static createString() {
    return new Primitive({ kind: 'string' });
  }
  static createNumber() {
    return new Primitive({ kind: 'number' });
  }
}

class Domain {
  constructor(
    readonly data: {
      Root: MetaType;
      Types: Record<string, MetaType>;
    },
  ) {}

  static create(data: { Root: MetaType; Types: Record<string, MetaType> }) {
    return new Domain(data);
  }
}

type TypeLike = Primitive | MetaType;

class RecordType {
  constructor(private data: {}) {}
  static create<T extends TypeLike>(type: T) {
    return new RecordType({});
  }
}

export const type = MetaType.create;
export const protocol = Protocol.create;
export const constructor = TypeConstructor.create;
export const string = Primitive.createString;
export const number = Primitive.createNumber;
export const record = RecordType.create;
export const arg = TypeArgument.createArg;
export const namedArg = TypeArgument.createNamed;
export const domain = Domain.create;
