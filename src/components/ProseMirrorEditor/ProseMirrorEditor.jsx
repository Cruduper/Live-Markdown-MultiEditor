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


// MarkdownView Component
function MarkdownView({ content, onChange }) {
  const [text, setText] = useState(content);

  useEffect(() => {
    onChange(text); // Call onChange when text updates
  }, [text, onChange]);

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
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

// Main Editor Component
function LiveMarkdownEditor() {
  const [viewMode, setViewMode] = useState('HTML Preview'); // 'HTML Preview', 'Raw Markdown', or 'Raw HTML'
  const [content, setContent] = useState(demoText); // Initial content
  const defaultButtonRef = useRef(null);

  useEffect(() => {
    if (defaultButtonRef.current) {
      defaultButtonRef.current.focus();
    }
  }, [])

  function getPreviewElement() {
    if (viewMode === 'HTML Preview') {
      return <ProseMirrorView className="prose-mirror-view" content={content} onChange={setContent} ref={defaultButtonRef} />
    } else if (viewMode === 'Raw HTML') {
      return <ProseMirrorView className="prose-mirror-view" content={content} onChange={setContent} />
    } else {
      return <pre onChange={setContent}>{content}</pre>
    }
  }

  return (
    <div className="text-editor">
      <h2 className="text-editor-header">ProseMirror Text Editor</h2>
      <MarkdownView content={content} onChange={setContent} />
      <div className="view-buttons">
        <button ref={defaultButtonRef} onClick={() => setViewMode('HTML Preview')}>HTML Preview</button>
        <button onClick={() => setViewMode('Raw HTML')}>Raw HTML</button>
        <button onClick={() => setViewMode('Raw Markdown')}>Raw Markdown</button>
      </div>

      <div className="live-preview-container">
        <h3 id="live-preview-header-text">
          {viewMode === 'HTML Preview' && 'Formatted'}
          {viewMode === 'Raw HTML' && 'HTML'}
          {viewMode === 'Raw Markdown' && 'Markdown'}
        </h3>
        {getPreviewElement()}
      </div>
    </div>
  );
}

export default LiveMarkdownEditor;
