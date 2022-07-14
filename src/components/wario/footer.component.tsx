import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const FooterComponent = (props) => (
    <div>
      <Paper>
        <Grid container spacing={3} justifyContent="center">
          {props.children}    
        </Grid>
      </Paper>
    </div>
  )
export default FooterComponent;