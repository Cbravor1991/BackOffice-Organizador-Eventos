import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useEffect, useState } from 'react';
import { EditorState, convertToRaw, convertFromRaw  } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Grid from '@mui/material/Grid';
import { Button, Divider, Typography, TextField } from '@mui/material';
import CardFaqs from '../components/CardFaqs';
import Navbar from '../components/NavBar';
import { version } from 'react-dom';

export default function Faqs() {
  const [question_1, setQuestion_1] = useState('');
  const [question_2, setQuestion_2] = useState('');
  const [question_3, setQuestion_3] = useState('');
  const [question_4, setQuestion_4] = useState('');
  const [question_5, setQuestion_5] = useState('');
  

  const [editorState_1, setEditorState_1] = useState(() => EditorState.createEmpty());
  const [editorState_2, setEditorState_2] = useState(() => EditorState.createEmpty());
  const [editorState_3, setEditorState_3] = useState(() => EditorState.createEmpty());
  const [editorState_4, setEditorState_4] = useState(() => EditorState.createEmpty());
  const [editorState_5, setEditorState_5] = useState(() => EditorState.createEmpty());
  const [answer_1, setAnswer_1] = useState('');
  const [answer_2, setAnswer_2] = useState('');
  const [answer_3, setAnswer_3] = useState('');
  const [answer_4, setAnswer_4] = useState('');
  const [answer_5, setAnswer_5] = useState('');

  
  const toolbarOptions = {

  };



  const handleSubmit = (event) => {

    event.preventDefault();
    const questions = [];

   
   



    const datos_1 = {
      question: question_1,
      response: answer_1
    }; 

    questions.push (datos_1)



    const datos_2 = {
      question: question_2,
      response: answer_2
    };

    questions.push (datos_2)

    const datos_3 = {
      question: question_3,
      response: answer_3
    };

    questions.push (datos_3)

    const datos_4 = {
      question: question_4,
      response: answer_4
    };

    questions.push (datos_4)


    const datos_5 = {
      question: question_5,
      response: answer_5
    };

    questions.push (datos_5)
    let questionsJSON = JSON.stringify(questions);
    
    window.localStorage.setItem("preguntas", questionsJSON);

    const preguntasRecuperadasJSON = window.localStorage.getItem("preguntas");
   
   


   
   


  };

  const handleEditorChange_1 = (newEditorState,) => {
    setEditorState_1(newEditorState);
    setAnswer_1 (JSON.stringify(convertToRaw(editorState_1.getCurrentContent())));
    
  };

  const handleEditorChange_2 = (newEditorState) => {
    setEditorState_2(newEditorState);
    setAnswer_2 (JSON.stringify(convertToRaw(editorState_2.getCurrentContent())));
    
  };

  const handleEditorChange_3 = (newEditorState) => {
    setEditorState_3(newEditorState);
    setAnswer_3 (JSON.stringify(convertToRaw(editorState_3.getCurrentContent())));
    
  };

  const handleEditorChange_4 = (newEditorState) => {
    setEditorState_4(newEditorState);
    setAnswer_4 (JSON.stringify(convertToRaw(editorState_4.getCurrentContent())));
    
  };

  const handleEditorChange_5 = (newEditorState) => {
    setEditorState_5(newEditorState);
    setAnswer_5 (JSON.stringify(convertToRaw(editorState_5.getCurrentContent())));
    
  };

  useEffect(() => {

    const preguntasRecuperadasJSON = window.localStorage.getItem("preguntas");
    const analizar = JSON.parse(preguntasRecuperadasJSON);

    if (analizar== '') {
      
      
    } else {
        analizar.map((pregunta, index) => {
          if(pregunta.response!='' ) {
          if(index==0){
          const rawContent = JSON.parse(pregunta.response);
          const contentState = convertFromRaw(rawContent);
          setEditorState_1 (EditorState.createWithContent(contentState));
          setQuestion_1(pregunta.question)
          }
          if(index==1){
            const rawContent = JSON.parse(pregunta.response);
            const contentState = convertFromRaw(rawContent);
            setEditorState_2 (EditorState.createWithContent(contentState));
            setQuestion_2(pregunta.question)
          }
          if(index==2){
            const rawContent = JSON.parse(pregunta.response);
            const contentState = convertFromRaw(rawContent);
            setEditorState_3 (EditorState.createWithContent(contentState));
            setQuestion_3(pregunta.question)
          }
          if(index==3){
            const rawContent = JSON.parse(pregunta.response);
            const contentState = convertFromRaw(rawContent);
            setEditorState_4 (EditorState.createWithContent(contentState));
            setQuestion_4(pregunta.question)
          }
          if(index==4){
            const rawContent = JSON.parse(pregunta.response);
            const contentState = convertFromRaw(rawContent);
            setEditorState_5 (EditorState.createWithContent(contentState));
            setQuestion_5(pregunta.question)
          }

         
        }
      });
    }
    
  }, []);

  return (
    <div>
      <Navbar/>
        <CardFaqs sx={{ width: '100%' }} />
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
       
      <div>
     
       

        <Grid item xs={6} sx={{ width: '100%' }}>

        <FormControl fullWidth sx={{ m: 1, width: '900px', marginLeft: '10px' }} variant="standard">
          <InputLabel htmlFor="standard-adornment-amount">Pregunta uno</InputLabel>
          <Input
           value={question_1}
            id="standard-adornment-amount"
            onChange={(e) => setQuestion_1(e.target.value)}
           
          />
        </FormControl>
                


                <Box sx={{ border: '1px solid black', height: '200px', overflow: 'auto', width: '900px', marginLeft: '10px' }}>
                  <Editor
                    editorState={editorState_1}
                    onEditorStateChange={handleEditorChange_1}
                    toolbar={toolbarOptions}
                    wrapperClassName="wrapper-class"
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                    style={{ maxHeight: '100px' }}
                  />
                </Box>


          </Grid>

          <Grid item xs={6} sx={{ width: '100%' }}>

<FormControl fullWidth sx={{ m: 1, width: '900px', marginLeft: '10px' }} variant="standard">
  <InputLabel htmlFor="standard-adornment-amount">Pregunta dos</InputLabel>
  <Input
   value={question_2}
    id="standard-adornment-amount"
    onChange={(e) => setQuestion_2(e.target.value)}
   
  />
</FormControl>
        


        <Box sx={{ border: '1px solid black', height: '200px', overflow: 'auto', width: '900px', marginLeft: '10px' }}>
          <Editor
            editorState={editorState_2}
            onEditorStateChange={handleEditorChange_2}
            toolbar={toolbarOptions}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            style={{ maxHeight: '100px' }}
          />
        </Box>


  </Grid>
  <Grid item xs={6} sx={{ width: '100%' }}>

<FormControl fullWidth sx={{ m: 1, width: '900px', marginLeft: '10px' }} variant="standard">
  <InputLabel htmlFor="standard-adornment-amount">Pregunta tres</InputLabel>
  <Input
   value={question_3}
    id="standard-adornment-amount"
    onChange={(e) => setQuestion_3(e.target.value)}
   
  />
</FormControl>
        


        <Box sx={{ border: '1px solid black', height: '200px', overflow: 'auto', width: '900px', marginLeft: '10px' }}>
          <Editor
            editorState={editorState_3}
            onEditorStateChange={handleEditorChange_3}
            toolbar={toolbarOptions}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            style={{ maxHeight: '100px' }}
          />
        </Box>


  </Grid>
  <Grid item xs={6} sx={{ width: '100%' }}>

<FormControl fullWidth sx={{ m: 1, width: '900px', marginLeft: '10px' }} variant="standard">
  <InputLabel htmlFor="standard-adornment-amount">Pregunta cuatro</InputLabel>
  <Input
   value={question_4}
    id="standard-adornment-amount"
    onChange={(e) => setQuestion_4(e.target.value)}
   
  />
</FormControl>
        


        <Box sx={{ border: '1px solid black', height: '200px', overflow: 'auto', width: '900px', marginLeft: '10px' }}>
          <Editor
            editorState={editorState_4}
            onEditorStateChange={handleEditorChange_4}
            toolbar={toolbarOptions}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            style={{ maxHeight: '100px' }}
          />
        </Box>


  </Grid>
  <Grid item xs={6} sx={{ width: '100%' }}>

<FormControl fullWidth sx={{ m: 1, width: '900px', marginLeft: '10px' }} variant="standard">
  <InputLabel htmlFor="standard-adornment-amount">Pregunta cinco</InputLabel>
  <Input
   value={question_5}
    id="standard-adornment-amount"
    onChange={(e) => setQuestion_5(e.target.value)}
   
  />
</FormControl>
        


        <Box sx={{ border: '1px solid black', height: '200px', overflow: 'auto', width: '900px', marginLeft: '10px' }}>
          <Editor
            editorState={editorState_5}
            onEditorStateChange={handleEditorChange_5}
            toolbar={toolbarOptions}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            style={{ maxHeight: '100px' }}
          />
        </Box>


  </Grid>
        <Box sx={{marginLeft: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <Button variant="contained" onClick={handleSubmit} sx={{
                    backgroundColor: '#1286f7',
                    border: 'none',
                    color: 'white',
                    width: '300px',
                    height: '50px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    marginTop: '20px',
                    marginRight: '150px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease-in-out'
                  }}>Cargar preguntas</Button>
                </Box>
      </div>
    </Box>
    </div>
  );
}
