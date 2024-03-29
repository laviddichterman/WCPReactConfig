import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ElementDeleteComponent from "../element.delete.component";
import { HOST_API } from "../../../../config";
import { ModifierTypeModifyUiProps } from "./modifier_type.component";
import { useSnackbar } from "notistack";
import { useAppSelector } from "../../../../hooks/useRedux";
import { getModifierTypeEntryById } from "@wcp/wario-ux-shared";

const ModifierTypeDeleteContainer = ({ modifier_type_id, onCloseCallback }: ModifierTypeModifyUiProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const modifier_type = useAppSelector(s=> getModifierTypeEntryById(s.ws.modifierEntries, modifier_type_id)!.modifierType);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const deleteModifierType = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ authorizationParams: { scope: "delete:catalog" } });
        const response = await fetch(`${HOST_API}/api/v1/menu/option/${modifier_type_id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        if (response.status === 200) {
          enqueueSnackbar(`Deleted modifier type: ${modifier_type.name}.`);
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to delete modifier type: ${modifier_type.name}. Got error ${JSON.stringify(error, null, 2)}`, { variant: 'error' });
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <ElementDeleteComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={deleteModifierType}
      name={modifier_type.name}
      isProcessing={isProcessing}
    />
  );
};

export default ModifierTypeDeleteContainer;
