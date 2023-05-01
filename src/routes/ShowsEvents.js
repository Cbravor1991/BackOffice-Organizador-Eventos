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
import { Button } from '@mui/material';


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
    window.localStorage.setItem("preguntas", vaciar);
    window.localStorage.setItem('cache_datos', vaciar);
    window.localStorage.setItem("cache_images", JSON.stringify([]));
    window.localStorage.setItem('coverPic', '')

    loadPublications();
  }, []);


  const [searchText, setSearchText] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleViewClick = (event, row) => {
    window.localStorage.setItem("cache_event", JSON.stringify(event));
    window.location.href = "/preview";
  };

  const update = async (props) => {
    window.localStorage.setItem("cache_event", JSON.stringify(props));
    console.log(props)
    window.location.href = "/editEvent"
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
        <TableContainer component={Paper}>
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
                <MenuItem sx={{ color: 'black' }} value={1}>1</MenuItem>
                <MenuItem sx={{ color: 'black' }} value={5}>5</MenuItem>
                <MenuItem sx={{ color: 'black' }} value={10}>10</MenuItem>
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
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell> Tus eventos</StyledTableCell>
                <StyledTableCell align="right">Categoria</StyledTableCell>
                <StyledTableCell align="right">Fecha</StyledTableCell>
                <StyledTableCell align="right">Direccion</StyledTableCell>
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
                        <Button aria-label="ver" onClick={(event) => handleViewClick(event, row)} >
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
        </TableContainer>
      </div>
  );
}
