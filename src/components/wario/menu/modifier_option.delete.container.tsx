import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ElementDeleteComponent from "./element.delete.component";
import { HOST_API } from "../../../config";
import { IOption } from "@wcp/wcpshared";

export interface ModifierOptionQuickActionProps {
  modifier_option: IOption;
  onCloseCallback: VoidFunction;
}
const ModifierOptionDeleteContainer = ({ modifier_option, onCloseCallback }: ModifierOptionQuickActionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const deleteModifierOption = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "delete:catalog" });
        const response = await fetch(`${HOST_API}/api/v1/menu/option/${modifier_option.modifierTypeId}/${modifier_option.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        if (response.status === 200) {
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <ElementDeleteComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={deleteModifierOption}
      name={modifier_option.displayName}
      isProcessing={isProcessing}
    />
  );
};

export default ModifierOptionDeleteContainer;
