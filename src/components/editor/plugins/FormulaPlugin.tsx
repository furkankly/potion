import { useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  TextNode,
  LexicalEditor,
  $createTextNode,
  $getNodeByKey,
  ParagraphNode,
  LexicalNode,
} from "lexical";

import { getTopLevelNodeKeys } from "@/components/editor/plugins/utils";
import { FormulaNode } from "@/components/editor/nodes/FormulaNode";

export function FormulaPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useFormula(editor);

  useEffect(() => {
    return editor.registerMutationListener(TextNode, (mutations) => {
      const topLevelNodeKeys = getTopLevelNodeKeys(editor);
      const topLevelElements = new Map();
      for (const key of topLevelNodeKeys) {
        const element = editor.getElementByKey(key);
        topLevelElements.set(key, element);
      }
    });
  }, [editor]);

  return null;
}

const upsertResultNode = (
  node: LexicalNode,
  op: string,
  blockKeys: string[]
) => {
  let result = op === "sum" ? 0 : 1;
  for (const blockKey of blockKeys) {
    const node = $getNodeByKey(blockKey);
    const param = Number(node?.getTextContent());
    if (!isNaN(param)) {
      op === "sum" ? (result += param) : (result *= param);
    }
  }

  const resultNode = node.getChildren()[1];
  const prevResult = Number(resultNode?.getTextContent().split(" ")[1]);
  if (!resultNode) {
    const resultNode = $createTextNode(`= ${result}`);
    resultNode.toggleFormat("bold");
    node.append(resultNode);
  } else if (result !== prevResult) {
    const newNode = $createTextNode(`= ${result}`);
    newNode.toggleFormat("bold");
    resultNode.replace(newNode);
  }
};

function useFormula(editor: LexicalEditor): void {
  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (node: TextNode) => {
      const topLevelNodeKeys = getTopLevelNodeKeys(editor);
      const topLevelNodes = new Map();
      for (const key of topLevelNodeKeys) {
        const element = $getNodeByKey(key);
        topLevelNodes.set(key, element);
      }

      const parentNode = $getNodeByKey(node.getKey())?.getParent();
      if (parentNode instanceof FormulaNode) {
        const formula = parentNode.parseFormula();
        if (formula) {
          const { op, blockKeys } = formula;
          upsertResultNode(parentNode, op, blockKeys);
        }
      } else {
        for (const [_key, topLevelNode] of topLevelNodes.entries()) {
          if (topLevelNode instanceof FormulaNode) {
            const formula = topLevelNode.parseFormula();
            if (formula) {
              const { op, blockKeys } = formula;
              if (
                (
                  $getNodeByKey(node.getKey())?.getParent() as ParagraphNode
                ).getKey()
              ) {
                upsertResultNode(topLevelNode, op, blockKeys);
              }
            }
          }
        }
      }
    });
  }, [editor]);
}
