import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { PrinterGroup } from "@wcp/wcpshared";
import PrinterGroupComponent, { PrinterGroupEditProps } from "./PrinterGroupComponent";
import { HOST_API } from "../../../../config";
import { useSnackbar } from "notistack";
import { useAppDispatch } from "../../../../hooks/useRedux";
import { queryPrinterGroups } from '../../../../redux/slices/PrinterGroupSlice';

const PrinterGroupEditContainer = ({ printerGroup, onCloseCallback }: PrinterGroupEditProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const [name, setName] = useState(printerGroup.name);
  const [singleItemPerTicket, setSingleItemPerTicket] = useState(printerGroup.singleItemPerTicket);
  const [externalIds, setExternalIds] = useState(printerGroup.externalIDs);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const editCategory = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const body : Omit<PrinterGroup, "id"> = {
          name,
          externalIDs: externalIds,
          singleItemPerTicket
        };
        const response = await fetch(`${HOST_API}/api/v1/menu/printergroup/${printerGroup.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.status === 200) {
          enqueueSnackbar(`Updated printer group: ${name}.`);
          dispatch(queryPrinterGroups(token));
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to update printer group: ${name}. Got error ${JSON.stringify(error, null, 2)}`, { variant: 'error' });
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <PrinterGroupComponent
      confirmText="Save"
      onCloseCallback={onCloseCallback}
      onConfirmClick={editCategory}
      isProcessing={isProcessing}
      name={name}
      setName={setName}
      singleItemPerTicket={singleItemPerTicket}
      setSingleItemPerTicket={setSingleItemPerTicket}
      externalIds={externalIds}
      setExternalIds={setExternalIds}
    />
  );
};

export default PrinterGroupEditContainer;
