import { useAuth0 } from '@auth0/auth0-react';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Button, Card, CardHeader, Divider, Grid, IconButton } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { addDays, parseISO } from "date-fns";
import { useState } from "react";

import { SelectDateFnsAdapter } from "@wcp/wario-ux-shared";
import { CURRENCY, IMoney, IssueStoreCreditRequest, MoneyToDisplayString, StoreCreditType, WDateUtils } from "@wcp/wcpshared";
import { useSnackbar } from "notistack";
import { HOST_API } from "../../config";
import { useAppSelector } from "../../hooks/useRedux";
import { IMoneyPropertyComponent } from "./property-components/IMoneyPropertyComponent";
import { StringPropertyComponent } from "./property-components/StringPropertyComponent";
import { ToggleBooleanPropertyComponent } from './property-components/ToggleBooleanPropertyComponent';

const DEFAULT_MONEY = { amount: 500, currency: CURRENCY.USD };

export const StoreCreditIssueComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { getAccessTokenSilently } = useAuth0();

  const CURRENT_TIME = useAppSelector(s => s.ws.currentTime);
  const DateAdapter = useAppSelector(s => SelectDateFnsAdapter(s));
  const [amount, setAmount] = useState<IMoney>(DEFAULT_MONEY);
  const [creditType, setCreditType] = useState(StoreCreditType.DISCOUNT);
  const [addedBy, setAddedBy] = useState("");
  const [reason, setReason] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientEmailError, setRecipientEmailError] = useState(false);
  const [expiration, setExpiration] = useState<string | null>(WDateUtils.formatISODate(addDays(CURRENT_TIME, 60)));
  const [isProcessing, setIsProcessing] = useState(false);

  const validateRecipientEmail = () => {
    //setRecipientEmailError(recipientEmail.length >= 1 && !EMAIL_REGEX.test(recipientEmail))
    // TODO: use yup.isEmail
  }

  const handleSubmit = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ authorizationParams: { scope: "edit:store_credit" } });
        const body: IssueStoreCreditRequest = {
          amount,
          addedBy,
          reason,
          expiration,
          creditType,
          recipientEmail,
          recipientNameFirst: firstName,
          recipientNameLast: lastName
        };
        const response = await fetch(`${HOST_API}/api/v1/payments/storecredit/issue`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        enqueueSnackbar(`Successfully sent ${firstName} ${lastName} ${creditType} credit for ${MoneyToDisplayString(amount, true)}.`)
        setAddedBy("");
        setAmount(DEFAULT_MONEY);
        setCreditType(StoreCreditType.DISCOUNT);
        setReason("");
        setFirstName("");
        setLastName("");
        setRecipientEmail("");
        setRecipientEmailError(false);
        setExpiration(WDateUtils.formatISODate(addDays(CURRENT_TIME, 60)))
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to issue store credit. Got error: ${JSON.stringify(error)}.`, { variant: "error" });
        console.error(error);
        setIsProcessing(false);
      }
    }
  }
  return (
    <Card>
      <CardHeader title="Issue a store credit for a customer"
        subheader="Note: purchased store credit MUST be done through our website!"
        sx={{ pb: 1 }}
      />
      <Divider />
      <Grid sx={{ p: 1 }} container spacing={1.5} justifyContent="center">
        <Grid item xs={5} md={3}>
          <StringPropertyComponent
            disabled={isProcessing}
            label="First Name"
            value={firstName}
            setValue={setFirstName}
          />
        </Grid>
        <Grid item xs={7} md={3}>
          <StringPropertyComponent
            disabled={isProcessing}
            label="Last Name"
            value={lastName}
            setValue={setLastName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StringPropertyComponent
            disabled={isProcessing}
            label="Customer E-mail"
            error={recipientEmailError}
            value={recipientEmail}
            setValue={setRecipientEmail}
          />
        </Grid>
        <Grid item xs={4} md={2}>
          <IMoneyPropertyComponent
            disabled={isProcessing}
            label="Dollar Amount"
            min={1.00}
            max={500.00}
            value={amount}
            setValue={setAmount}
          />
        </Grid>
        <Grid item xs={8} md={4}>
          <StringPropertyComponent
            disabled={isProcessing}
            label="Added by"
            value={addedBy}
            setValue={setAddedBy}
          />
        </Grid>
        <Grid item xs={10} md={5}>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              sx={{ height: '10%' }}
              minDate={addDays(CURRENT_TIME, 30)}
              label="Expiration"
              value={expiration ? parseISO(expiration) : null}
              onChange={(date) => { setExpiration(date ? WDateUtils.formatISODate(date) : null) }}
              format={WDateUtils.ServiceDateDisplayFormat}
              slotProps={{
                textField: { fullWidth: true },
                toolbar: {
                  hidden: true,
                },
              }} />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={2} md={1} sx={{ my: 'auto' }}>
          <IconButton
            sx={{ m: 'auto' }}
            edge="start"
            size="medium"
            aria-label="delete"
            onClick={() => setExpiration(null)}
          >
            <HighlightOffIcon />
          </IconButton>
        </Grid>

        <Grid item xs={6} md={8}>
          <StringPropertyComponent
            disabled={isProcessing}
            label="Reason"
            value={reason}
            setValue={setReason}
          />
        </Grid>
        <Grid item xs={3} md={3}>
          <ToggleBooleanPropertyComponent
            disabled={isProcessing}
            label="Is Discount?"
            setValue={(x) => setCreditType(x ? StoreCreditType.DISCOUNT : StoreCreditType.MONEY)}
            value={creditType === StoreCreditType.DISCOUNT}
            labelPlacement={'end'}
          />
        </Grid>
        <Grid item xs={3} md={1} sx={{ my: 'auto', width: "100%" }}>
          <Button
            sx={{ m: 'auto', width: "100%" }}
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
