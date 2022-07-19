import { RoundToTwoDecimalPlaces } from '@wcp/wcpshared';

import { useState, useEffect } from "react";

import QrScanner from 'qr-scanner';
import { OneOffQrScanner } from "react-webcam-qr-scanner.ts";

import ErrorOutline from "@mui/icons-material/ErrorOutline";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Button, Card, CardHeader, Grid, IconButton, List, ListItem, Typography, TextField } from "@mui/material";
import DialogContainer from "./dialog.container";
import { HOST_API } from "../../config";
import { CheckedNumericInput } from "./CheckedNumericTextInput";

const US_MONEY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface ValidateResponse {
  enc: string;
  iv: string;
  auth: string;
  validated: boolean;
  amount: number;
  credit_type: "MONEY" | "DISCOUNT"
 }

type StoreCreditDebitSuccessResponse = {
  success: true;
  balance: number;
}
type StoreCreditDebitFailureResponse = {
  success: false;
  result: {errors: [{detail: "Unable to debit store credit."}]}
}
type StoreCreditDebitResponse = StoreCreditDebitSuccessResponse | StoreCreditDebitFailureResponse;

const StoreCreditValidateAndSpendComponent = () => {
  const [creditCode, setCreditCode] = useState("");
  const [scanCode, setScanCode] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [validationResponse, setValidationResponse] = useState<ValidateResponse|null>(null);
  const [amount, setAmount] = useState(0);
  const [processedBy, setProcessedBy] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [debitResponse, setDebitResponse] = useState<StoreCreditDebitResponse|null>(null);

  useEffect(() => {
    const CheckForCamera = async () => {
      const cam = await QrScanner.hasCamera();
      setHasCamera(cam);
    };
    CheckForCamera();
  }, []);

  const onScanned = async (qrCode: string) => {
    setCreditCode(qrCode);
    setScanCode(false);
    if (qrCode.length === 19) {
      await validateCode(qrCode);
    }
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
  const validateCode = async (code: string) => {
    if (!isProcessing) {
      setValidationResponse(null);
      setIsProcessing(true);
      try {
        const response = await fetch(
          `${HOST_API}/api/v1/payments/storecredit/validate/?code=${encodeURIComponent(
            code
          )}`,
          { method: "GET" }
        );
        const response_data = await response.json();
        setValidationResponse(response_data);
        setIsProcessing(false);
      } catch (error) {
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  const processDebit = async () => {
    if (!isProcessing && validationResponse !== null ) {
      setIsProcessing(true);
      try {
        const response = await fetch(
          `${HOST_API}/api/v1/payments/storecredit/spend`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code: creditCode,
              amount,
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
  const scanHTML = hasCamera ? (<>
    <DialogContainer
      title={"Scan Store Credit Code"}
      onClose={() => {
        setScanCode(false);
      }}
      open={scanCode}
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
        disabled={isProcessing || (validationResponse !== null && validationResponse.validated)}
        size="large">
        <PhotoCamera />
      </IconButton>
    </Grid></>) : "";

  return (
    <Card>
      <CardHeader title={"Redeem Store Credit"} subtitle={"Tool to debit store credit with instructions"} />
      <Grid sx={{ m: 1 }} container spacing={3} justifyContent="center">
        <Grid item xs={hasCamera ? 6 : 9}>
          <TextField
            label="Credit Code"
            type="text"
            fullWidth
            inputProps={{ size: 19 }}
            disabled={isProcessing || (validationResponse !== null && validationResponse.validated)}
            value={creditCode}
            size="small"
            onChange={(e) => setCreditCode(e.target.value)}
          />
        </Grid>
        {scanHTML}
        <Grid item xs={3}>
          {validationResponse !== null ? (
            <Button
              onClick={clearLookup}
              disabled={isProcessing}
            >
              Clear
            </Button>
          ) : (
            <Button
              onClick={() => validateCode(creditCode)}
              disabled={
                isProcessing ||
                creditCode.length !== 19
              }
            >
              Validate
            </Button>
          )}
        </Grid>

        {validationResponse !== null ? (
          !validationResponse.validated ?
            (<Grid item xs={12}>
              <ErrorOutline />
              FAILED TO FIND
              <ErrorOutline />
              <br />
              This generally means the code was mis-entered, has expired, or was already redeemed.
            </Grid>) : (
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
                  <CheckedNumericInput
                    type="number"
                    fullWidth
                    label="Amount to debit"
                    inputProps={{ inputMode: 'numeric', min: 0.01, max: validationResponse.amount, pattern: '[0-9]+([.,][0-9]+)?', step: .25 }}
                    value={amount}
                    className="form-control"
                    disabled={isProcessing || debitResponse !== null}
                    onChange={(e) => setAmount(e)}
                    parseFunction={(e) => RoundToTwoDecimalPlaces(parseFloat(e === null ? "0" : e))}
                    allowEmpty={false} />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Debited by"
                    type="text"
                    disabled={isProcessing || debitResponse !== null}
                    inputProps={{ size: 10 }}
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
            )) : ("")}
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
        ) : ("")}
      </Grid>
    </Card>
  );
};

export default StoreCreditValidateAndSpendComponent;
