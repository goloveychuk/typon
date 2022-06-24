// type

type String<Metadata extends { description: string }> = {__metadata: Metadata, type: 'string'};
type Ref<T, Metadata extends { description: string }> = {__metadata: Metadata, type: 'string'};


interface Car {
    
}

export interface Props {
  d: String<{ description: 'asdasd' }>;
}

export var Props!: Props;
