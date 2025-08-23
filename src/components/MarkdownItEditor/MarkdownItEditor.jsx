import React, { useState, useEffect, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import {demoText} from '../../data/demoText.js'
import './MarkdownItEditor.scss';

const md_it = new MarkdownIt();

const LiveMarkdownEditor = () => {
  const [textInput, setTextInput] = useState(demoText);
  const [htmlPreview, setHtmlPreview] = useState('');
    //TODO make viewMode load from config
  const [viewMode, setViewMode] = useState('HTML Preview'); // 'HTML Preview', 'Raw Markdown', or 'Raw HTML'
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
    if (viewMode === 'HTML Preview') {
      return <div dangerouslySetInnerHTML={{ __html: htmlPreview }} />
    } else if (viewMode === 'Raw HTML') {
      return <pre>{htmlPreview}</pre>
    } else {
      return <pre>{textInput}</pre>
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
    </>
  );
};

export default LiveMarkdownEditor;
