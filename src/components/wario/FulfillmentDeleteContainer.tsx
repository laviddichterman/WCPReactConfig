import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ElementDeleteComponent from "./menu/element.delete.component";
import { HOST_API } from "../../config";
import { FulfillmentConfig } from "@wcp/wcpshared";

export interface FulfillmentQuickActionProps {
  fulfillment: FulfillmentConfig;
  onCloseCallback: VoidFunction;
}
const FulfillmentDeleteContainer = ({ fulfillment, onCloseCallback }: FulfillmentQuickActionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const deleteFulfillment = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "delete:catalog" });
        const response = await fetch(`${HOST_API}/api/v1/config/fulfillment/${fulfillment.id}`, {
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
      onConfirmClick={deleteFulfillment}
      name={fulfillment.displayName}
      isProcessing={isProcessing}
    />
  );
};

export default FulfillmentDeleteContainer;
