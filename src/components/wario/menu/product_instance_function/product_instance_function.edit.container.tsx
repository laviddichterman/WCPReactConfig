import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { HOST_API } from "../../../../config";
import ProductInstanceFunctionComponent from "./product_instance_function.component";

import { IProductInstanceFunction } from "@wcp/wario-shared";
import { getProductInstanceFunctionById } from "@wcp/wario-ux-shared";
import { useSnackbar } from "notistack";
import { useAppSelector } from "../../../../hooks/useRedux";
import { ProductInstanceFunctionQuickActionProps } from './product_instance_function.delete.container';

const ProductInstanceFunctionEditContainer = ({ pifId, onCloseCallback }: ProductInstanceFunctionQuickActionProps) => {
  const { enqueueSnackbar } = useSnackbar();

  // todo: look into the assertion of truthy, maybe the caller of this container should process the selection and confirm non-falsy?
  const productInstanceFunction = useAppSelector(s => getProductInstanceFunctionById(s.ws.productInstanceFunctions, pifId)!)

  const [functionName, setFunctionName] = useState(productInstanceFunction.name);
  const [expression, setExpression] = useState(productInstanceFunction.expression);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const editProductInstanceFunction = async () => {
    if (!isProcessing && functionName && expression) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ authorizationParams: { scope: "write:catalog" } });
        const body: Omit<IProductInstanceFunction, "id"> = {
          name: functionName,
          expression
        };
        const response = await fetch(`${HOST_API}/api/v1/query/language/productinstancefunction/${pifId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.status === 200) {
          enqueueSnackbar(`Updated product instance function: ${functionName}.`);
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to edit product instance function: ${functionName}. Got error ${JSON.stringify(error, null, 2)}`, { variant: 'error' });
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <ProductInstanceFunctionComponent
      confirmText="Save"
      onCloseCallback={onCloseCallback}
      onConfirmClick={editProductInstanceFunction}
      isProcessing={isProcessing}
      functionName={functionName}
      setFunctionName={setFunctionName}
      expression={expression}
      setExpression={setExpression}
    />
  );
};

export default ProductInstanceFunctionEditContainer;
