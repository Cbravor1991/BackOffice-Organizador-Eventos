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
import CancelIcon from '@mui/icons-material/Cancel';
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
import { Height } from '@mui/icons-material'';
import Tooltip from '@mui/material/Tooltip';


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
  const [data, setData] = useState(null)


  let token_user = window.localStorage.getItem("token");


  const loadPublications = () => {
    api.get('/organizer/events')
      .then((response) => {
        console.log('estos son los datos =>', response.data)
        setPublications(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    window.localStorage.setItem('cache_cover', null)
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
        url: `/organizer/event?event_id=${row.id}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token_user
        },
      };

      api.request(options)
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
        url: `/organizer/event?event_id=${props.id}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token_user
        },
      };

      api.request(options)
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


  const cancelEvent = async (props) => {


    try {
      var options = {
        method: 'GET',
        url: `/organizer/event?event_id=${props.id}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token_user
        },
      };

      await api.request(options)
        .then((response) => {
          console.log(response)
          swal.fire({
            title: "Confirmar cancelación",
            input: "text",
            inputAttributes: {
              maxlength: 50,
              size: 50
            },
            text: "¿Confirmas que deseas cancelar el evento? Se enviará una notificación a los usuarios.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Si, cancelar!',
            cancelButtonText: 'No',
            inputPlaceholder: "Mensaje (máximo 50 caracteres)"
          }).then(function (result) {

            if (result['isConfirmed']) {

              var options = {
                method: 'PUT',
                url: '/organizer/event',
                data: {
                  "id": props.id,
                  "title": response.data.Event.title,
                  "category": response.data.Event.category,
                  "init_date": response.data.Event.init_date,
                  "end_date": response.data.Event.end_date,
                  "date": response.data.Event.date,
                  "description": response.data.Event.description,
                  "direction": response.data.Event.direction,
                  "latitude": response.data.Event.latitude,
                  "longitude": response.data.Event.longitude,
                  "capacity": response.data.Event.capacity,
                  "agenda": response.data.Event.agenda,
                  "faqs": response.data.Event.faqs,
                  "images": response.data.Images,
                  "vacancies": response.data.Event.vacancies,
                  "state": "canceled"
                }
              };

              console.log(result.value);
              api.request(options).then(function (response__) {
                const params = { "event_id": props.id }

                var options2 = {
                  method: 'POST',
                  url: '/organizer/event/notify',
                  params: params,
                  data: {
                    "title": "Cancelación de evento",
                    "description": result.value
                  }
                };

                console.log(result.value);
                api.request(options2).then(function (response_) {
                  if (response.data.Event.pic_id != null) {
                    console.log('fijate=>', response.data)
                    response.data.Images.map(item => {
                      console.log('item_id=>', item.id)
                      console.log('cover_id=>', response.data.Event.pic_id)
                      if (response.data.Event.pic_id == item.id) {
                        api.post(
                          'organizer/event/cover/pic',
                          JSON.stringify({
                            "link": item.link,
                            "event_id": props.id
                          })
                        );
                      }
                    })
                  } else {
                    console.log('fallo')
                    window.location.href = "/eventList"

                  }
                  window.location.href = "/eventList"
                })
              }).catch(function (error) {
                console.error(error);
              });
            }
          })
        })

    } catch (error) {
      console.error(error);
    }
  }


  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };


  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };


  const filteredData = publications.filter((row) =>
    row.title.toLowerCase().includes(searchText.toLowerCase()) && row.state === "published"
  );


  return (
    <div>
      <Navbar />
      <CardEvent />
      <Grid sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <Paper sx={{ width: '100%' }} elevation={5}>
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

            <Grid sx={{ maxHeight: '700px', overflowY: 'scroll' }}>
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
                            <StyledTableCell align="right"> {new Date(row.init_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</StyledTableCell>
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

                              <Tooltip title="Cancelar" text="Cancelar">
                                <IconButton aria-label="cancelar" tooltip="Add bold text" tooltipDirection="sw" tooltipAlign="left" onClick={() => { cancelEvent(row) }}>
                                  <CancelIcon />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Eliminar" text="Eliminar">
                                <IconButton aria-label="eliminar" onClick={() => { deleteEvent(row) }}>
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>

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
