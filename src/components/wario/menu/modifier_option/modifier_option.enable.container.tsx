import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { Grid } from "@mui/material";
import { getModifierOptionById } from "@wcp/wario-ux-shared";
import { IOption } from "@wcp/wcpshared";
import { useSnackbar } from "notistack";
import { HOST_API } from "../../../../config";
import { useAppSelector } from "../../../../hooks/useRedux";
import { ElementActionComponent } from "../element.action.component";
import { ModifierOptionQuickActionProps } from "./modifier_option.delete.container";


const ModifierOptionEnableContainer = ({ modifier_option_id, onCloseCallback }: ModifierOptionQuickActionProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const modifier_option = useAppSelector(s => getModifierOptionById(s.ws.modifierOptions, modifier_option_id)!);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const editModifierOption = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ authorizationParams: { scope: "write:catalog" } });
        const body: IOption = {
          ...modifier_option,
          disabled: null
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
          enqueueSnackbar(`Enabled modifier option: ${modifier_option.displayName}.`);
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to update modifier option: ${modifier_option.displayName}. Got error ${JSON.stringify(error, null, 2)}`, { variant: 'error' });
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
          Are you sure you'd like to enable {modifier_option.displayName}?
        </Grid>
      }
    />
  );
};

export default ModifierOptionEnableContainer;