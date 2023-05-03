import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CardEvent from '../components/CardEvent';
import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import Navbar from '../components/NavBar';
import swal from 'sweetalert2';
import { Button, Grid } from '@mui/material';
import { Height } from '@material-ui/icons';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1286f7',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function ShowsEvents() {

  const [publications, setPublications] = useState([]);

  let token_user = window.localStorage.getItem("token");


  const loadPublications = () => {
    api.get('/organizer/events')
      .then((response) => {
        setPublications(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    let vaciar = JSON.stringify('');
    //window.localStorage.setItem("preguntas", vaciar);
    //window.localStorage.setItem('cache_datos', vaciar);
    //window.localStorage.setItem('cache_event', vaciar);
    window.localStorage.setItem("cache_images", JSON.stringify([]));
    //window.localStorage.setItem('coverPic', vaciar)

    loadPublications();
  }, []);


  const [searchText, setSearchText] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);


  const handleViewClick = async (e, row) => {
  
     try {   
      var options = {
        method: 'GET',
           url:`/organizer/event?event_id=${row.id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token_user
            },
        };
  
      api.request(options)
        //.then((response) => response.json())
        .then((response) => {
            console.log(response);
            if (response.length === 0) {
                console.log("No hay evento")
            }
            window.localStorage.setItem("cache_view", JSON.stringify(response.data));
            window.localStorage.setItem("cache_cover_id", JSON.stringify(response.data.Event.pic_id));
            window.location.href = "/view";
         })
                
       } catch (error) {
            console.error(error);
        }

    }


    const update = async (props) => {
  
     try {   
      var options = {
        method: 'GET',
           url:`/organizer/event?event_id=${props.id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token_user
            },
        };
  
      api.request(options)
        //.then((response) => response.json())
        .then((response) => {
            console.log(response);
            if (response.length === 0) {
                console.log("No hay evento")
            }
            window.localStorage.setItem("cache_edit", JSON.stringify(response.data));
            const result = JSON.parse(window.localStorage.getItem("cache_edit"));
            window.localStorage.setItem("cache_images", JSON.stringify(response.data.Images));
            window.localStorage.setItem("cache_cover_id", JSON.stringify(response.data.Event.pic_id));
            console.log(result);
            window.location.href = "/editEvent"
         })
                
       } catch (error) {
            console.error(error);
        }

    }


/*  const handleViewClick = async (e, row) => {
      const response = await loadEvent(row.id)
      .then((response) => {const result = JSON.parse(window.localStorage.getItem("cache_event"));
      console.log(result);})
      window.location.href = "/view";
  };


  const update = async (props) => {
    const response = await loadEvent(props.id);
    let result = JSON.parse(window.localStorage.getItem("cache_edit"));
    console.log(result);
    window.location.href = "/editEvent"
  }
*/

  const deleteEvent = async (props) => {
    swal.fire({
      title: "Confirmar",
      text: "¿Confirmas que deseas borrar el evento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Si, borrar!',
      cancelButtonText: 'No',
      dangerMode: true
    }).then(function (result) {

      if (result['isConfirmed']) {

        const params = new URLSearchParams([['event_id', props.id]]);

        var options = {
          method: 'DELETE',
          url: '/organizer/event',
          params: params,
        };

        api.request(options).then(function (response) {
          window.location.href = "/showEvents"
        }).catch(function (error) {
          console.error(error);
        });
      }
    })
  }


  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };


  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };


  const filteredData = publications.filter((row) =>
    row.title.toLowerCase().includes(searchText.toLowerCase())
  );


  return (
      <div>
        <Navbar />
        <CardEvent />
        <Grid sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <Paper sx={{  width: '100%' }} elevation={5}>
            <TableContainer component={Grid}>
              <div>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">Mostrar</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={rowsPerPage}
                    label="Mostrar"
                    onChange={handleRowsPerPageChange}
                  >
                    <MenuItem sx={{ color: 'black' }} value={5}>5</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value={10}>10</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value={25}>25</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  sx={{ m: 1, width: '30ch' }}
                  label="Buscar por evento"
                  variant="outlined"
                  value={searchText}
                  onChange={handleSearchChange}
                />
              </div>

              <Grid sx={{ maxHeight: '700px', overflowY: 'scroll'}}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">

                  <TableHead>
                    <TableRow>
                      <StyledTableCell> Nombre</StyledTableCell>
                      <StyledTableCell align="right">Categoria</StyledTableCell>
                      <StyledTableCell align="right">Fecha</StyledTableCell>
                      <StyledTableCell align="right">Dirección</StyledTableCell>
                      <StyledTableCell align="center">Opciones</StyledTableCell>
                    </TableRow>
                  </TableHead>

                  {(publications && publications.length > 0) ? 
                  (
                    <TableBody>
                      {filteredData
                        .slice(0, rowsPerPage)
                        .map((row) => (
                          <StyledTableRow key={row.name}>
                            <StyledTableCell component="th" scope="row">
                              {row.title}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {row.category}
                            </StyledTableCell>
                            <StyledTableCell align="right"> {new Date(row.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</StyledTableCell>
                            <StyledTableCell align="right">
                              {row.direction}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              <Button aria-label="ver" onClick={(e) => handleViewClick(e, row)} >
                                VER
                              </Button>
                              <Button aria-label="editar" onClick={() => { update(row) }}>
                                EDITAR
                              </Button>
                              <IconButton aria-label="eliminar" onClick={() => { deleteEvent(row) }}>
                                <DeleteIcon />
                              </IconButton>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                      }
                    </TableBody> 
                  )
                  : 
                  (
                    <StyledTableRow >
                      <StyledTableCell component="th" scope="row">
                        NO TIENES EVENTOS CREADOS
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </Table>
              </Grid>

            </TableContainer>
          </Paper>
        </Grid>
      </div>
  );
}
