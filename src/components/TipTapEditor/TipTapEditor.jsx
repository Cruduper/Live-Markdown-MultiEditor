import React, { useState, useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { marked } from 'marked';
import { demoText } from '../../data/demoText.js'
import { DEFAULT, viewModeList as modes } from '../../data/viewModeList.js'
import '/src/styles/editor-styles.scss';



function TipTapEditor() {
  const [viewMode, setViewMode] = useState(modes[DEFAULT]); 
  const [content, setContent] = useState(demoText);
  const defaultButtonRef = useRef(null);
  const editor = useEditor({
    extensions: [
      StarterKit, 
      Highlight, 
      Typography
    ],
    content: content,
  });

  useEffect(() => {
    if (defaultButtonRef.current) {
      defaultButtonRef.current.focus();
    }
  }, [])

  const handleInputChange = (event) => {
    const content = event.target.value;

    setContent(content);
    editor.commands.setContent(content);
  };

  function markdownToHTML(markdownInput) {
    return marked(markdownInput);
  }

  function getPreviewElement() {
    if (viewMode === modes.FORMATTED) {
      return <div className="live-preview-content" dangerouslySetInnerHTML={{ __html: marked(content) }} ></div>
    } 
    else if (viewMode === modes.HTML) {   
      return <pre className="live-preview-content">{markdownToHTML(content)}</pre>
    } 
    else if (viewMode === modes.MARKDOWN){
      return <pre className="live-preview-content">{content}</pre>
    } 
    else {
      return <pre className="live-preview-content">Error: "{viewMode}" is not a valid view mode.</pre>
    }
  }

  return (
    <div className="text-editor">
      <h2 className="text-editor-header">TipTap Text Editor</h2>
      <textarea className="markdown-input"
        onChange={handleInputChange}
        value={content}
        placeholder="Type your content here..."
      />

      <div className="view-buttons">
        {Object.keys(modes).map((modeKey) => {
          if (modeKey === DEFAULT) {
            return <button ref={defaultButtonRef} onClick={() => setViewMode(modes[modeKey])}>
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
};

export default TipTapEditor;
