import { Token } from './lib';
import {
  createNode,
  TokenKind,
  Node,
  ast,
  createNodeArray,
  NodeArray,
  AnyTokenOrNode,
} from './types';

function visitNodes<T>(
  cbNode: (node: Node) => T,
  cbNodes: ((node: NodeArray) => T | undefined) | undefined,
  nodes: NodeArray | undefined,
): T | undefined {
  if (nodes) {
    if (cbNodes) {
      return cbNodes(nodes);
    }
    for (const node of nodes) {
      const result = cbNode(node);
      if (result) {
        return result;
      }
    }
  }
}

function visitNode<T>(
  cbNode: (node: Node) => T,
  node: Node | undefined,
): T | undefined {
  return node && cbNode(node);
}

export function forEachChild<T>(
  node: Node,
  cbNode: (node: Node) => T | undefined,
  cbNodes?: (nodes: NodeArray) => T | undefined,
): T | undefined {
  if (!node) {
    return;
  }

  switch (node.ast.kind) {
    case 'FalseLiteral':
    case 'TrueLiteral':
    case 'NumberLiteral':
    case 'StringLiteral':
    case 'Identifier':
      return;
    case 'Property':
      return (
        visitNode(cbNode, node.ast.name) || visitNode(cbNode, node.ast.val)
      );
    case 'ObjectDeclaration':
      return (
        visitNode(cbNode, node.ast.typeName) ||
        visitNodes(cbNode, cbNodes, node.ast.properties)
      );
    default:
        //@ts-expect-error
        throw new Error(`Unkonwn ast.kind ${node.ast.kind}`)
  }
}

class Scanner {
    scan():Token<TokenKind> {
        
    }
}

let scanner: Scanner

function addSyntheticNodes(nodes: Push<Node>, pos: number, end: number, parent: Node): void {
    scanner.setTextPos(pos);
    while (pos < end) {
        const token = scanner.scan();
        const textPos = scanner.getTextPos();
        if (textPos <= end) {
            // if (token === SyntaxKind.Identifier) {
            //     Debug.fail(`Did not expect ${Debug.formatSyntaxKind(parent.kind)} to have an Identifier in its trivia`);
            // }
            nodes.push(createNode(token, pos, textPos, parent));
        }
        pos = textPos;
        if (token === SyntaxKind.EndOfFileToken) {
            break;
        }
    }
}

function createSyntaxList(nodes: NodeArray<Node>, parent: Node): Node {
    const list = createNode(SyntaxKind.SyntaxList, nodes.pos, nodes.end, parent) as any as SyntaxList;
    list._children = [];
    let pos = nodes.pos;
    for (const node of nodes) {
        addSyntheticNodes(list._children, pos, node.pos, parent);
        list._children.push(node);
        pos = node.end;
    }
    addSyntheticNodes(list._children, pos, nodes.end, parent);
    return list;
}


function createChildren(node: Node,): Node[] {

    
    // if (!isNodeKind(node.kind)) {
    //     return emptyArray;
    // }

    const children: Node[] = [];

    // if (isJSDocCommentContainingNode(node)) {
    //     /** Don't add trivia for "tokens" since this is in a comment. */
    //     node.forEachChild(child => {
    //         children.push(child);
    //     });
    //     return children;
    // }


    let pos = node.pos;
    const processNode = (child: Node) => {
        addSyntheticNodes(children, pos, child.pos, node);
        children.push(child);
        pos = child.end;
    };
    const processNodes = (nodes: NodeArray) => {
        addSyntheticNodes(children, pos, nodes.pos, node);
        children.push(createSyntaxList(nodes, node));
        pos = nodes.end;
    };
    // jsDocComments need to be the first children
    // forEach((node as JSDocContainer).jsDoc, processNode);
    // For syntactic classifications, all trivia are classified together, including jsdoc comments.
    // For that to work, the jsdoc comments should still be the leading trivia of the first child.
    // Restoring the scanner position ensures that.
    pos = node.pos;
    forEachChild(node, processNode, processNodes);
    addSyntheticNodes(children, pos, node.end, node);

    return children;
}