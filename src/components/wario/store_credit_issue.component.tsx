import { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { addDays, parseISO } from "date-fns";
import { TextField, IconButton, Button, Grid, Card, CardHeader, Divider } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { DatePicker } from '@mui/x-date-pickers';

import { CURRENCY, IMoney, IssueStoreCreditRequest, StoreCreditType, WDateUtils } from "@wcp/wcpshared";
import { HOST_API } from "../../config";
import { useAppSelector } from "../../hooks/useRedux";
import { IMoneyPropertyComponent } from "./property-components/IMoneyPropertyComponent";

const DEFAULT_MONEY = { amount: 500, currency: CURRENCY.USD };
const StoreCreditIssueComponent = () => {
  const CURRENT_TIME = useAppSelector(s => s.ws.currentTime);
  const [amount, setAmount] = useState<IMoney>(DEFAULT_MONEY);
  const [addedBy, setAddedBy] = useState("");
  const [reason, setReason] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientEmailError, setRecipientEmailError] = useState(false);
  const [expiration, setExpiration] = useState<string | null>(WDateUtils.formatISODate(addDays(CURRENT_TIME, 60)));
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();


  const validateRecipientEmail = () => {
    //setRecipientEmailError(recipientEmail.length >= 1 && !EMAIL_REGEX.test(recipientEmail))
    // TODO: use yup.isEmail
  }

  const handleSubmit = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "edit:store_credit" });
        const body: IssueStoreCreditRequest = {
          amount,
          addedBy,
          reason,
          expiration,
          creditType: StoreCreditType.DISCOUNT,
          recipientEmail,
          recipientNameFirst: firstName,
          recipientNameLast: lastName
        };
        const response = await fetch(`${HOST_API}/api/v1/payments/storecredit/discount`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        setAddedBy("");
        setAmount(DEFAULT_MONEY);
        setReason("");
        setFirstName("");
        setLastName("");
        setRecipientEmail("");
        setRecipientEmailError(false);
        setExpiration(WDateUtils.formatISODate(addDays(CURRENT_TIME, 60)))
        setIsProcessing(false);
      } catch (error) {
        console.error(error);
        setIsProcessing(false);
      }
    }
  }
  return (
    <Card>
      <CardHeader title="Issue a store credit for a customer"
        subheader="Note: purchased store credit MUST be done through our website!"
      />
      <Divider />
      <Grid sx={{ p: 2 }} container spacing={3} justifyContent="center">
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
            onChange={e => { setRecipientEmail(e.target.value); }}
            onBlur={() => validateRecipientEmail()}
          />
        </Grid>
        <Grid item xs={2}>
          <IMoneyPropertyComponent
            disabled={isProcessing}
            label="Dollar Amount"
            min={1.00}
            max={500.00}
            value={amount}
            setValue={setAmount}
          />
        </Grid>
        <Grid item xs={4}>
          <DatePicker
            renderInput={(props) => <TextField sx={{ height: '10%' }} {...props} />}
            disableMaskedInput
            showToolbar={false}
            minDate={addDays(CURRENT_TIME, 30)}
            label="Expiration"
            value={expiration ? parseISO(expiration) : null}
            onChange={(date) => { setExpiration(date ? WDateUtils.formatISODate(date) : null) }}
            inputFormat={WDateUtils.ServiceDateDisplayFormat}
          />
          <IconButton
            sx={{ p: 2 }}
            edge="end"
            size="medium"
            aria-label="delete"
            onClick={() => setExpiration(null)}
          >
            <HighlightOffIcon />
          </IconButton>
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Added by"
            type="text"
            inputProps={{ size: 5 }}
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
            onClick={handleSubmit}
            disabled={!(!isProcessing && amount.amount >= 1 && addedBy.length >= 2 && firstName.length >= 2 && lastName.length >= 2 && reason.length > 2 && recipientEmail.length > 3)}
          >
            Generate
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default StoreCreditIssueComponent;
