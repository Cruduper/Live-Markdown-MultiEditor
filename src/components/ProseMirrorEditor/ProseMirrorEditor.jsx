import React, { useState, useEffect, useRef } from "react";
import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { Schema } from "prosemirror-model";
import { undo, redo, history } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { baseKeymap } from "prosemirror-commands"
import { schema, defaultMarkdownParser, defaultMarkdownSerializer } from "prosemirror-markdown";
// import { exampleSetup } from "prosemirror-example-setup";
import "prosemirror-view/style/prosemirror.css";
import demoText from '../../data/demoText.js'
import { DEFAULT, viewModeList as modes } from '../../data/viewModeList.js'
import '/src/styles/editor-styles.scss';



const markSchema = new Schema({
  nodes: {
    doc: { content: "block+" },
    paragraph: { group: "block", content: "text*", marks: "_" },
    heading: { group: "block", content: "text*", marks: "" },
    text: { inline: true }
  },
  marks: {
    strong: {},
    em: {},
  }
})



function MarkdownView({ content, setContent, onChange }) {

  useEffect(() => {
    onChange(content);
  }, [content, onChange]);

  return (
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      className="markdown-input"
    />
  );
}

function ProseMirrorView({ content, onChange }) {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      viewRef.current = new EditorView(editorRef.current, {
        state: EditorState.create({
          doc: defaultMarkdownParser.parse(content),
          plugins: [
            history(),
            keymap({ "Mod-z": undo, "Mod-y": redo })
          ]
        }),
        dispatchTransaction(transaction) { //! DEBUG 
          console.log("Document size went from", transaction.before.content.size,
            "to", transaction.doc.content.size)
          let newState = viewRef.current.state.apply(transaction)
          viewRef.current.updateState(newState)
        }
      });
    }

    return () => {
      if (viewRef.current) {
        onChange(defaultMarkdownSerializer.serialize(viewRef.current.state.doc));
        viewRef.current.destroy();
      }
    };
  }, [content, onChange]);

  return <div ref={editorRef} />;
}



function ProseMirrorEditor() {
  const [viewMode, setViewMode] = useState(modes[DEFAULT]); 
  const [content, setContent] = useState(demoText); 
  const defaultButtonRef = useRef(null);

  useEffect(() => {
    if (defaultButtonRef.current) {
      defaultButtonRef.current.focus();
    }
  }, [])

  function getPreviewElement() {
    if (viewMode === modes.FORMATTED) {
      return <ProseMirrorView className="live-preview-content" content={content} setContent={setContent} onChange={setContent}  />
    } else if (viewMode === modes.HTML) {
      return <ProseMirrorView className="live-preview-content" content={content} setContent={setContent} onChange={setContent} />
    } else if (viewMode === modes.MARKDOWN) {
      return <pre className="live-preview-content" onChange={setContent}>{content}</pre>
    } else {
      return <pre className="live-preview-content">Error: "{viewMode}" is not a valid view mode.</pre>
    }
  }

  return (
    <div className="text-editor">
      <h2 className="text-editor-header">ProseMirror Text Editor</h2>
      <MarkdownView content={content} onChange={setContent} />
      <div className="view-buttons">
        {Object.keys(modes).map((modeKey) => {
          if (modeKey === DEFAULT) {
            return <button ref={defaultButtonRef} onClick={() => setViewMode(modes[modeKey])} >
              {modes[modeKey].btnText}
            </button>
          } else {
            return <button onClick={() => setViewMode(modes[modeKey])}>
              {modes[modeKey].btnText}
            </button>
          }
        })}
      </div>

      <div className="live-preview-container">
        <h3 id="live-preview-header-text">
          {viewMode.headerText}
        </h3>
        {getPreviewElement()}
      </div>
    </div>
  );
}

export default ProseMirrorEditor;
