import React, { useState } from "react";
import CheckedInputComponent from "./checked_input.component";
import { useAuth0 } from '@auth0/auth0-react';

import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Toolbar from "@material-ui/core/Toolbar";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import { WDateUtils, EMAIL_REGEX } from "@wcp/wcpshared";


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  title: {
    flexGrow: 1,
  },
  listLevel0: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  listLevel1: {
    paddingLeft: theme.spacing(4),
  },
}));

const StoreCreditIssueComponent = ({ ENDPOINT }) => {
  const classes = useStyles();
  const [amount, setAmount] = useState(5.00);
  const [addedBy, setAddedBy] = useState("");
  const [reason, setReason] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientEmailError, setRecipientEmailError] = useState(false);
  const [expiration, setExpiration] = useState(moment().add(60, "days"));
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();


  const validateRecipientEmail = () => {
    setRecipientEmailError(recipientEmail.length >= 1 && !EMAIL_REGEX.test(recipientEmail))
  }

  const handleSubmit = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/payments/storecredit/discount`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            amount: amount,
            recipient_name_first: firstName,
            recipient_name_last: lastName,
            recipient_email: recipientEmail,
            added_by: addedBy,
            reason: reason,
            expiration: expiration && expiration.isValid() ? expiration.format(WDateUtils.DATE_STRING_INTERNAL_FORMAT) : ""
          })
        });  
        console.log(JSON.stringify(response));
        setAddedBy("");
        setAmount(5.00);
        setReason("");
        setFirstName("");
        setLastName("");
        setRecipientEmail("");
        setRecipientEmailError(false);
        setExpiration(moment().add(60, "days"))
        setIsProcessing(false);
      } catch (error) {
        console.error(error);
        setIsProcessing(false);
      }
    }
  }
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h5" className={classes.title}>
                  Issue a store credit for a customer
                </Typography>
              </Toolbar>
              <Typography variant="subtitle1">Note: purchased store credit MUST be done through our website!</Typography>
              <Typography variant="subtitle1">People kept on giving out discounts that didn't expire, so now they all have to expire.</Typography>
            </AppBar>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="First Name"
              type="text"
              inputProps={{ size: 30 }}
              value={firstName}
              size="small"
              onChange={e => setFirstName(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Last Name"
              type="text"
              inputProps={{ size: 30 }}
              value={lastName}
              size="small"
              onChange={e => setLastName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Customer E-mail"
              type="email"
              error={recipientEmailError}
              inputProps={{ size: 60 }}
              value={recipientEmail}
              size="small"
              onChange={e => { setRecipientEmail(e.target.value); } }
              onBlur={e => validateRecipientEmail()}
            />
          </Grid>
          <Grid item xs={2}>
            <CheckedInputComponent
              label="Dollar Amount"
              className="form-control"
              type="number"
              fullWidth
              parseFunction={(e) => parseFloat(e).toFixed(2)}
              value={amount}
              inputProps={{min:1.00, max:500.00}}
              onFinishChanging={(e) => setAmount(e)}
            />
          </Grid>
          <Grid item xs={4}>
            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
              <DatePicker
                inputProps={{ size: 28 }}
                variant="inline"
                autoOk
                placeholder={"Select Date"}
                disableToolbar
                disablePast
                minDate={moment().add(30, "days")}
                label="Expiration"
                value={expiration}
                onChange={(date) => setExpiration(date)}
                format="dddd, MMMM DD, Y"
              />
              {/* <IconButton
                edge="end"
                size="medium"
                aria-label="delete"
                onClick={() => setExpiration(null)}
              >
                <HighlightOffIcon />
              </IconButton> */}
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Added by"
              type="text"
              inputProps={{ size: 5 }}
              //className={className}
              value={addedBy}
              size="small"
              onChange={e => setAddedBy(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Reason"
              type="text"
              fullWidth
              value={reason}
              size="small"
              onChange={e => setReason(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              className="btn btn-light"
              onClick={handleSubmit}
              disabled={!(!isProcessing && amount >= 1 && addedBy.length >= 2 && firstName.length >= 2 && lastName.length >= 2 && reason.length > 2 && recipientEmail.length > 3 && EMAIL_REGEX.test(recipientEmail))}
            >
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <br />
    </div>
  );
};

export default StoreCreditIssueComponent;
