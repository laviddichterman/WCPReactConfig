import { useState } from "react";
import { getTime, endOfDay } from 'date-fns';
import { useAuth0 } from '@auth0/auth0-react';
import Grid from "@mui/material/Grid";

import { ElementActionComponent } from "../element.action.component";
import { HOST_API } from "../../../../config";
import { useAppSelector } from "../../../../hooks/useRedux";
import { ModifierOptionQuickActionProps } from "./modifier_option.delete.container";
import { IOption } from "@wcp/wcpshared";
import { useSnackbar } from "notistack";

const ModifierOptionDisableUntilEodContainer = ({ modifier_option, onCloseCallback }: ModifierOptionQuickActionProps) => {
  const { enqueueSnackbar } = useSnackbar();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const CURRENT_TIME = useAppSelector(s=>s.ws.currentTime);
  const { getAccessTokenSilently } = useAuth0();
  const editModifierOption = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const body: IOption = {
          ...modifier_option,
          disabled: { start: CURRENT_TIME, end: getTime(endOfDay(CURRENT_TIME)) }
        };
        const response = await fetch(`${HOST_API}/api/v1/menu/option/${modifier_option.modifierTypeId}/${modifier_option.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.status === 200) {
          enqueueSnackbar(`Disabled modifier option: ${modifier_option.displayName} until EOD.`);
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to update modifier option: ${modifier_option.displayName}. Got error ${JSON.stringify(error)}`, { variant: 'error' });
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <ElementActionComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={editModifierOption}
      isProcessing={isProcessing}
      disableConfirmOn={isProcessing}
      confirmText="Confirm"
      body={
        <Grid item xs={12}>
          Are you sure you'd like to disable {modifier_option.displayName} until end-of-day?
        </Grid>
      }
    />
  );
};

export default ModifierOptionDisableUntilEodContainer;