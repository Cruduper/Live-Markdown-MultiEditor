import React, { useState, useEffect, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import {demoText} from '../../data/demoText.js'
import { DEFAULT, viewModeList as modes } from '../../data/viewModeList.js'
import '/src/styles/editor-styles.scss';



const md_it = new MarkdownIt();



const MarkdownItEditor = () => {
  const [viewMode, setViewMode] = useState(modes[DEFAULT]); 
  const [content, setContent] = useState(demoText);
  const [htmlPreview, setHtmlPreview] = useState('');
  const defaultButtonRef = useRef(null);

  useEffect(() => {
    setHtmlPreview(md_it.render(demoText));

    if (defaultButtonRef.current) {
      defaultButtonRef.current.focus();
    }
  }, [])

  const handleTextInputChange = (event) => {
    const rawText = event.target.value;
    setContent(rawText);
    const html = md_it.render(rawText);
    setHtmlPreview(html);
  };

  function getPreviewElement() {
    if (viewMode === modes.FORMATTED) {
      return <div className="live-preview-content" dangerouslySetInnerHTML={{ __html: htmlPreview }} />
    } else if (viewMode === modes.HTML) {
      return <pre className="live-preview-content">{htmlPreview}</pre>
    } else if (viewMode === modes.MARKDOWN) {
      return <pre className="live-preview-content">{content}</pre>
    } else {
      return <pre className="live-preview-content">Error: "{viewMode}" is not a valid view mode.</pre>
    }
  }

  return (
    <>
    <div className="text-editor">
      <h2 className="text-editor-header">Markdown-it Text Editor</h2>
      <textarea
        value={content}
        onChange={handleTextInputChange}
        className="markdown-input"
      />
      <div className="view-buttons">
        {Object.keys(modes).map((modeKey) => {
          if (modeKey === DEFAULT) {
            return <button onClick={() => setViewMode(modes[modeKey])} ref={defaultButtonRef}>
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
    </>
  );
};

export default MarkdownItEditor;
