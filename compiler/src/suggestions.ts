//@ts-nocheck
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
  
  