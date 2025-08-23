import React, { useState, useEffect} from 'react';
import ProseMirrorEditor from './ProseMirrorEditor/ProseMirrorEditor';
import TipTapEditor from './TipTapEditor/TipTapEditor';

function MultiEditor() {
  const [editorType, setEditorType] = useState('TipTap'); // "TipTap", "Markdown-it", "ProseMirror"

  function getPreviewElement() {
    if (editorType === 'TipTap') {
      return <TipTapEditor/>
    }
    else if (editorType === 'ProseMirror') {
      return <ProseMirrorEditor/>
    }
    else if (editorType === 'Markdown-it') {
      return <div>placeholder for markdown-it component</div>
    }
    else {
      return <div>ERROR</div>
    } 
  }

  return (
    <>
      <div>
        <button onClick={() => setEditorType('TipTap')}>TipTap</button>
        <button onClick={() => setEditorType('Markdown-it')}>Markdown-it</button>
        <button onClick={() => setEditorType('ProseMirror')}>ProseMirror</button>
      </div>
      {getPreviewElement()}
    </>
  )
}

export default MultiEditor