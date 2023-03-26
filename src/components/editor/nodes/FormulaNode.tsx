import {
  $applyNodeReplacement,
  LexicalNode,
  EditorConfig,
  LexicalEditor,
  SerializedLexicalNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  ElementNode,
  NodeKey,
  RangeSelection,
  $createParagraphNode,
  ParagraphNode,
  SerializedElementNode,
} from "lexical";
import { addClassNamesToElement } from "@lexical/utils";

export type SerializedFormulaNode = SerializedLexicalNode & {
  type: "formula";
  version: 1;
};

export const allowedTokens = /^(sum|multiply)$/;

export class FormulaNode extends ElementNode {
  static getType(): string {
    return "formula";
  }

  static clone(node: FormulaNode): FormulaNode {
    return new FormulaNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  static importJSON(_serializedNode: SerializedFormulaNode): FormulaNode {
    return $createFormulaNode();
  }

  static importDOM(): DOMConversionMap | null {
    return {
      section: () => ({
        conversion: convertFormulaElement,
        priority: 0,
      }),
    };
  }

  parseFormula() {
    const children = this.getChildren();
    const [op, rest] = children[0].getTextContent().split("(");
    if (rest?.includes(")")) {
      const endIndex = rest.indexOf(")");
      const blockKeys = rest
        .slice(0, endIndex)
        .split(",")
        .map((param) => param.trim().slice(1));
      return { op, blockKeys };
    }
    return null;
  }

  exportJSON(): SerializedElementNode<SerializedLexicalNode> {
    return super.exportJSON();
  }

  exportDOM(): DOMExportOutput {
    return { element: document.createElement("section") };
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    const dom = document.createElement("section");
    addClassNamesToElement(dom, _config.theme.formula);
    return dom;
  }

  updateDOM(
    _prevNode: unknown,
    _dom: HTMLElement,
    _config: EditorConfig
  ): boolean {
    return false;
  }

  isInline(): false {
    return false;
  }

  // Mutation
  insertNewAfter(
    selection: RangeSelection,
    restoreSelection = true
  ): FormulaNode | ParagraphNode | null {
    const children = this.getChildren();
    const childrenLength = children.length;

    if (
      childrenLength >= 2 &&
      children[childrenLength - 1].getTextContent() === "\n" &&
      children[childrenLength - 2].getTextContent() === "\n" &&
      selection.isCollapsed() &&
      selection.anchor.key === this.__key &&
      selection.anchor.offset === childrenLength
    ) {
      children[childrenLength - 1].remove();
      children[childrenLength - 2].remove();
      const newElement = $createParagraphNode();
      this.insertAfter(newElement, restoreSelection);
      return newElement;
    }
    return null;
  }

  collapseAtStart(): true {
    const newElement = $createParagraphNode();
    const children = this.getChildren();
    children.forEach((child) => newElement.append(child));
    this.replace(newElement);
    return true;
  }
}

function convertFormulaElement(): DOMConversionOutput {
  return { node: $createFormulaNode() };
}

export function $createFormulaNode(): FormulaNode {
  return $applyNodeReplacement(new FormulaNode());
}

export function $isFormulaNode(node: LexicalNode | null | undefined): boolean {
  return node instanceof FormulaNode;
}
