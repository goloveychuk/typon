enum SemTokens {
    namespace = "namespace",
    /**
     * Represents a generic type. Acts as a fallback for types which can't be mapped to
     * a specific type like class or enum.
     */
    type = "type",
    class = "class",
    enum = "enum",
    interface = "interface",
    struct = "struct",
    typeParameter = "typeParameter",
    parameter = "parameter",
    variable = "variable",
    property = "property",
    enumMember = "enumMember",
    event = "event",
    function = "function",
    method = "method",
    macro = "macro",
    keyword = "keyword",
    modifier = "modifier",
    comment = "comment",
    string = "string",
    number = "number",
    regexp = "regexp",
    operator = "operator",
    /**
     * @since 3.17.0
     */
    decorator = "decorator"
}
// Object.keys(_SemTokens)

export enum TokenTypes {
    asd = 1
}

export function getSemanticTokens() {
  
}