import React, { useState, useEffect, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import {demoText} from '../../data/demoText.js'
import '/src/styles/editor-styles.scss';

const md_it = new MarkdownIt();

const LiveMarkdownEditor = () => {
  const [textInput, setTextInput] = useState(demoText);
  const [htmlPreview, setHtmlPreview] = useState('');
    //TODO make viewMode load from config
  const [viewMode, setViewMode] = useState('Formatted Preview'); // "Formatted Preview", "Raw HTML", "Raw Markdown"
  const defaultButtonRef = useRef(null);

  useEffect(() => {
    setHtmlPreview(md_it.render(demoText));

    if (defaultButtonRef.current) {
      defaultButtonRef.current.focus();
    }
  }, [])

  const handleTextInputChange = (event) => {
    const rawText = event.target.value;
    setTextInput(rawText);
    const html = md_it.render(rawText);
    setHtmlPreview(html);
  };

  function getPreviewElement() {
    if (viewMode === 'Formatted Preview') {
      return <div className="live-preview-content" dangerouslySetInnerHTML={{ __html: htmlPreview }} />
    } else if (viewMode === 'Raw HTML') {
      return <pre className="live-preview-content">{htmlPreview}</pre>
    } else if (viewMode === 'Raw Markdown') {
      return <pre className="live-preview-content">{textInput}</pre>
    } 
  }

  return (
    <>
    <div className="text-editor">
      <h2 className="text-editor-header">Markdown-it Text Editor</h2>
      <textarea
        value={textInput}
        onChange={handleTextInputChange}
        className="markdown-input"
      />
      <div className="view-buttons">
        <button ref={defaultButtonRef} onClick={() => setViewMode('Formatted Preview')}>Preview</button>
        <button onClick={() => setViewMode('Raw HTML')}>HTML</button>
        <button onClick={() => setViewMode('Raw Markdown')}>Markdown</button>
      </div>
      <div className="live-preview-container">
        <h3 id="live-preview-header-text">
          {viewMode}
        </h3>
          {getPreviewElement()}
      </div>
    </div>
    </>
  );
};

export default LiveMarkdownEditor;
