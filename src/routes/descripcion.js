import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
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
    console.log(
        content);
  };

  const toolbarOptions = {
   
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="descripcion">Descripción:</label>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        toolbar={toolbarOptions}
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default Formulario;
