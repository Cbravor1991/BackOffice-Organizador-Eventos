import React, { useState } from 'react';
import { EditorState, convertToRaw, convertFromRaw  } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Formulario = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    console.log(content);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="descripcion">Descripción:</label>
      <Editor sx={ {color: 'black'}}
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default Formulario;
