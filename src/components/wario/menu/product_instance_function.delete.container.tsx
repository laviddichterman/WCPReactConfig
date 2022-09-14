import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ElementDeleteComponent from "./element.delete.component";
import { HOST_API } from "../../../config";
import { useAppSelector } from "../../../hooks/useRedux";
import { getProductInstanceFunctionById } from "@wcp/wario-ux-shared";

export interface ProductInstanceFunctionQuickActionProps {
  pifId: string;
  onCloseCallback: VoidFunction;
}

const ProductInstanceFunctionDeleteContainer = ({ pifId, onCloseCallback }: ProductInstanceFunctionQuickActionProps) => {
  const productInstanceFunction = useAppSelector(s=> getProductInstanceFunctionById(s.ws.productInstanceFunctions, pifId))
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const deletePIF = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "delete:catalog" });
        const response = await fetch(`${HOST_API}/api/v1/query/language/productinstancefunction/${pifId}`, {
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

  return productInstanceFunction ?
    <ElementDeleteComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={deletePIF}
      name={productInstanceFunction.name}
      isProcessing={isProcessing}
    />
  : <></>;
};

export default ProductInstanceFunctionDeleteContainer;
