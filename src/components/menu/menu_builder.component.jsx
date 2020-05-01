import React, { useState } from "react";

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import Button from '@material-ui/core/Button';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Toolbar from '@material-ui/core/Toolbar';
import moment from 'moment';
import MomentUtils from "@date-io/moment";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Container from '@material-ui/core/Container';
import { ListItemText } from "@material-ui/core";



const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  title: {
    flexGrow: 1,
  },
  listLevel0: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  listLevel1: {
    paddingLeft: theme.spacing(4),
  },
}));




const MenuBuilderComponent = ({
}) => {
  const classes = useStyles();
  const [ can_submit, setCanSubmit ] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!isProcessing) {
    //   setIsProcessing(true);
    //   try {
    //     const token = await getTokenSilently();
    //     const response = await fetch(`${ENDPOINT}/api/v1/payments/storecredit/discount`, {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({ 
    //         amount: amount,
    //         recipient_name_first: firstName,
    //         recipient_name_last: lastName,
    //         recipient_email: recipientEmail,
    //         added_by: addedBy,
    //         reason: reason,
    //         expiration: expiration && expiration.isValid() ? expiration.format(WDateUtils.DATE_STRING_INTERNAL_FORMAT) : ""
    //       })
    //     });  
    //     console.log(JSON.stringify(response));
    //     setAddedBy("");
    //     setReason("");
    //     setFirstName("");
    //     setLastName("");
    //     setRecipientEmail("");
    //     setRecipientEmailError(false);
    //     setIsProcessing(false);
    //   } catch (error) {
    //     console.error(error);
    //     setIsProcessing(false);
    //   }
    //}
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
      <Grid container spacing={3} justify="center">
        <Grid item xs={12}>
        <AppBar position="static">
          <Toolbar>
        <Typography variant="subtitle1" className={classes.title}>
        SOmething menuy:
          </Typography>
          </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={8}>
          <Grid container></Grid>
        </Grid>
        <Grid item xs={4}>
        
        </Grid>
        <Grid item xs={5}>
        
        </Grid>
        <Grid item xs={5}>
        
        </Grid>
        <Grid item xs={2}><Button className="btn btn-light" onClick={handleSubmit} disabled={!can_submit}>Add</Button></Grid>
      </Grid>
      </Paper>
      <Grid container justify="center" spacing={3}>
      </Grid>
    <br />
    </div>
  )
}

export default MenuBuilderComponent;