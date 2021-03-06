import React, { useState, useEffect } from "react";
import CheckedInputComponent from "./checked_input.component";
import DialogContainer from "./dialog.container";

import QrScanner from 'qr-scanner'; 
import { OneOffQrScanner } from "react-webcam-qr-scanner.ts";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const US_MONEY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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
const StoreCreditValidateAndSpendComponent = ({ ENDPOINT }) => {
  const classes = useStyles();
  const [creditCode, setCreditCode] = useState("");
  const [scanCode, setScanCode] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [validationResponse, setValidationResponse] = useState(null);
  const [amount, setAmount] = useState(0);
  const [processedBy, setProcessedBy] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [debitResponse, setDebitResponse] = useState(null);

  useEffect(() => {
    const CheckForCamera = async () => {
      const cam = await QrScanner.hasCamera();
      setHasCamera(cam);
    };
    CheckForCamera();
  }, []);
  const onScanned = (qrCode) => {
      setCreditCode(qrCode);
      setScanCode(false);
  };

  const clearLookup = () => {
    setIsProcessing(true);
    setCreditCode("");
    setScanCode(false);
    setValidationResponse(null);
    setAmount(0);
    setProcessedBy("");
    setIsProcessing(false);
    setDebitResponse(null);
  };
  const validateCode = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        //const token = await getAccessTokenSilently();
        const response = await fetch(
          `${ENDPOINT}/api/v1/payments/storecredit/validate/?code=${encodeURIComponent(
            creditCode
          )}`,
          {
            method: "GET",
            // headers: {
            //   Authorization: `Bearer ${token}`,
            //   'Content-Type': 'application/json'
            // },
          }
        );
        if (response.status === 200) {
          const response_data = await response.json();
          setValidationResponse(response_data);
        } else {
        }
        setIsProcessing(false);
      } catch (error) {
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  const processDebit = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        //const token = await getAccessTokenSilently();
        const response = await fetch(
          `${ENDPOINT}/api/v1/payments/storecredit/spend`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code: creditCode,
              amount: amount,
              lock: {
                iv: validationResponse.iv,
                enc: validationResponse.enc,
                auth: validationResponse.auth,
              },
              processed_by: processedBy,
            }),
          }
        );
        const response_data = await response.json();
        setDebitResponse(response_data);
        setIsProcessing(false);
      } catch (error) {
        console.error(error);
        setIsProcessing(false);
      }
    }
  };
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h5" className={classes.title}>
                  Redeem Store Credit
                </Typography>
              </Toolbar>
              <Typography variant="subtitle1">
                Tool to debit store credit with instructions
              </Typography>
            </AppBar>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Credit Code"
              type="text"
              fullWidth
              inputProps={{ size: 19 }}
              disabled={isProcessing || validationResponse !== null}
              value={creditCode}
              size="small"
              onChange={(e) => setCreditCode(e.target.value)}
            />
          </Grid>
          {hasCamera ? (<>
          <DialogContainer
            title={"Scan Store Credit Code"}
            onClose={() => {
              setScanCode(false);
            }}
            isOpen={scanCode}
            inner_component={
              <OneOffQrScanner
                onQrCode={onScanned}
                hidden={false}
              />
            }
          />
          <Grid item xs={3}>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={() => setScanCode(true)}
              disabled={isProcessing || validationResponse !== null}>
              <PhotoCamera />
            </IconButton>
          </Grid></>) : "" }
          <Grid item xs={hasCamera ? 3 : 6}>
            {validationResponse !== null ? (
              <Button
                className="btn btn-light"
                onClick={clearLookup}
                disabled={isProcessing}
              >
                Clear
              </Button>
            ) : (
              <Button
                className="btn btn-light"
                onClick={validateCode}
                disabled={
                  isProcessing ||
                  validationResponse !== null ||
                  creditCode.length !== 19
                }
              >
                Validate
              </Button>
            )}
          </Grid>

          {validationResponse !== null ? (
            <>
              <Grid item xs={12}>
                <Typography variant="h5">
                  Found a credit code of type {validationResponse.credit_type}{" "}
                  with balance{" "}
                  {US_MONEY_FORMATTER.format(validationResponse.amount)}
                </Typography>
                {validationResponse.credit_type === "MONEY" ? (
                  <List>
                    <ListItem>
                      Redeem this credit against the AFTER-TAX total of the
                      order.
                    </ListItem>
                    <ListItem>
                      If the after-tax total of the order is less than{" "}
                      {US_MONEY_FORMATTER.format(validationResponse.amount)},
                      ask the customer how much of their credit they would like
                      to apply as tip. Enter the sum of their after-tax total
                      and the applied tip below to debit the credit code. Apply
                      their after-tax total to the order on the POS as store
                      credit. Enter the tip into the tip log spreadsheet under
                      "In person GC redeem"
                    </ListItem>
                    <ListItem>
                      If the after-tax total of the order is greater than{" "}
                      {US_MONEY_FORMATTER.format(validationResponse.amount)},
                      split the order into two payments: the first for{" "}
                      {US_MONEY_FORMATTER.format(validationResponse.amount)}{" "}
                      paid with store credit, and the second for the remainder.
                      Enter{" "}
                      {US_MONEY_FORMATTER.format(validationResponse.amount)}{" "}
                      below to debit the full amount of the credit.
                    </ListItem>
                  </List>
                ) : (
                  <List>
                    <ListItem>
                      Before closing, we need to apply a discount to the order.
                    </ListItem>
                    <ListItem>
                      So, if the pre-tax total of the order is less than{" "}
                      {US_MONEY_FORMATTER.format(validationResponse.amount)},
                      enter the pre-tax total below to debit that amount.
                    </ListItem>
                    <ListItem>
                      If the pre-tax total of the order is greater than or equal
                      to {US_MONEY_FORMATTER.format(validationResponse.amount)},
                      enter{" "}
                      {US_MONEY_FORMATTER.format(validationResponse.amount)}{" "}
                      below.
                    </ListItem>
                    <ListItem>
                      Apply the debited amount to the order as a discount.
                    </ListItem>
                  </List>
                )}
              </Grid>
              <Grid item xs={4}>
                <CheckedInputComponent
                  label="Amount to debit"
                  className="form-control"
                  type="number"
                  fullWidth
                  disabled={isProcessing || debitResponse !== null}
                  parseFunction={(e) => parseFloat(e).toFixed(2)}
                  value={amount}
                  inputProps={{ min: 0.01, max: validationResponse.amount }}
                  onFinishChanging={(e) => setAmount(e)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Debited by"
                  type="text"
                  disabled={isProcessing || debitResponse !== null}
                  inputProps={{ size: 10 }}
                  //className={className}
                  value={processedBy}
                  size="small"
                  onChange={(e) => setProcessedBy(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  className="btn btn-light"
                  onClick={processDebit}
                  disabled={
                    isProcessing ||
                    debitResponse !== null ||
                    processedBy.length === 0 ||
                    amount <= 0
                  }
                >
                  Debit {US_MONEY_FORMATTER.format(amount)}
                </Button>
              </Grid>
            </>
          ) : (
            ""
          )}
          {debitResponse !== null ? (
            debitResponse.success ? (
              <Grid item xs={12}>
                Successfully debited {US_MONEY_FORMATTER.format(amount)}.
                Balance remaining:{" "}
                {US_MONEY_FORMATTER.format(debitResponse.balance)}
              </Grid>
            ) : (
              <Grid item xs={12}>
                <ErrorOutline />
                FAILED TO DEBIT
                <ErrorOutline />
                <br />
                This generally means there was some shenannigans.
              </Grid>
            )
          ) : (
            ""
          )}
        </Grid>
      </Paper>
      <br />
    </div>
  );
};

export default StoreCreditValidateAndSpendComponent;
