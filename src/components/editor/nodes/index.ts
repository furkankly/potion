import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode } from "@lexical/rich-text";
import type { Klass, LexicalNode } from "lexical";

import { FormulaNode } from "@/components/editor/nodes/FormulaNode";

const Nodes: Array<Klass<LexicalNode>> = [
  FormulaNode,
  HeadingNode,
  HorizontalRuleNode,
];

export default Nodes;
