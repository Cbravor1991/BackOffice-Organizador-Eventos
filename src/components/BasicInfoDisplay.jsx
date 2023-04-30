import { Typography, Stack, Grid, Divider, Paper } from '@mui/material';

function basicInfoData(event, stringDate) {
  return [
    {
      'key': 'Categoria',
      'value': event.category
    },
    {
      'key': 'Fecha',
      'value': stringDate
    },
    {
      'key': 'Dirección',
      'value': event.ubication.direction
    },
    {
      'key': 'Capacidad',
      'value': event.capacity
    }
  ]
}

export default function BasicInfoDisplay({ event, stringDate }) {
  return (
    <Paper elevation={0}>
      <Stack divider={<Divider sx={{ marginLeft: '100px', marginRight: '99px' }} />} spacing={1.5} direction="column" useFlexGap flexWrap="wrap" padding='10px'>
         {basicInfoData(event, stringDate).map((data) => {
            return (
              <Grid container justifyContent={'center'} spacing={2}>
                <Grid item xs={4} sx={{ justifyContent: 'right', display: 'flex' }}>
                  <Typography variant='body2' sx={{ fontWeight: 100 }} >
                    {data.key}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant='body2'>
                    {data.value}
                  </Typography>
                </Grid>
              </Grid>
            )
          })}
      </Stack>
    </Paper>
  )
  // return (
  //   <Paper elevation={0}>
  //     <Stack justifyContent="center" divider={<Divider sx={{ marginLeft: '100px', marginRight: '100px' }} />} spacing={1.5} direction="column" useFlexGap flexWrap="wrap" padding='15px'>
  //       {agenda.map((item, key) => {
  //         return (
  //           <Grid container justifyContent={'center'} spacing={2}>
  //             <Grid item xs={5} sx={{ justifyContent: 'right', display: 'flex' }}>
  //               <Typography variant='body2' sx={{ fontWeight: 100 }} >
  //                 {item.time}
  //               </Typography>
  //             </Grid>
  //             <Grid item xs={5}>
  //               <Typography variant='body2'>
  //                 {item.description}
  //               </Typography>
  //             </Grid>
  //           </Grid>
  //         )
  //       })}
  //     </Stack>
  //   </Paper>
  // )
}