import { useState } from "react";
import dynamic from "next/dynamic";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import { FormulaPlugin } from "@/components/editor/plugins/FormulaPlugin";
import Nodes from "@/components/editor/nodes";

const ComponentPickerMenuPlugin = dynamic(
  () => import("@/components/editor/plugins/ComponentPickerPlugin"),
  {
    ssr: false,
  }
);

const DraggableBlockPlugin = dynamic(
  () => import("@/components/editor/plugins/DraggableBlockPlugin"),
  {
    ssr: false,
  }
);

const theme = {
  ltr: "text-left",
  rtl: "text-right",
  placeholder: "text-pink-900",
  heading: {
    h1: "text-2xl",
    h2: "text-xl",
    h3: "text-lg",
  },
  formula: "border-2 rounded p-2",
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed.
function onError(error: any) {
  console.error(error);
}

function Editor() {
  const initialConfig = {
    namespace: "Potion",
    theme,
    nodes: [...Nodes],
    onError,
  };

  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ComponentPickerMenuPlugin />
      <HorizontalRulePlugin />
      <RichTextPlugin
        contentEditable={
          <div className="relative my-4" ref={onRef}>
            <ContentEditable className="my px-8 text-white outline-none" />
          </div>
        }
        placeholder={
          <>
            <div className="my-5 font-bold text-white">
              ^ Cast a spell... (ﾉ≧∀≦ )ﾉ・‥…━━━★ ^
            </div>
            <div className="my-2 font-bold text-white">
              Type &apos;/&apos; for a menu to quickly switch blocks and search
              by typing
            </div>
            <div className="my-2 font-bold text-white">
              Each block is referred by the number you see on its left when you
              hover it
            </div>
            <div className="my-2 font-bold text-white">
              Supported formulas: &apos;sum&apos; and &apos;multiply&apos;
            </div>
            <div className="my-2 font-bold text-white">
              Formulas refer to other blocks in the format of: `[operation](
              b[key] , b[key]...)` e.g. sum( b2, b4 )
            </div>
            <div className="my-2 font-bold text-white">
              Press &apos;return&apos; multiple times to exit a formula block
            </div>
            <div className="my-2 font-bold text-white">
              Press &apos;backspace&apos; to remove a block when its empty
            </div>
          </>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      {floatingAnchorElem ? (
        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
      ) : (
        <></>
      )}
      <FormulaPlugin />
    </LexicalComposer>
  );
}

export default Editor;
