import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import PrinterGroupComponent from "./PrinterGroupComponent";
import { HOST_API } from "../../../../config";
import { KeyValue, PrinterGroup } from "@wcp/wcpshared";
import { useSnackbar } from "notistack";

export interface PrinterGroupAddContainerProps {
  onCloseCallback: VoidFunction;
}

const PrinterGroupAddContainer = ({ onCloseCallback }: PrinterGroupAddContainerProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState("");
  const [singleItemPerTicket, setSingleItemPerTicket] = useState(false);
  const [externalIds, setExternalIds] = useState<KeyValue[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const addPrinterGroup = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const body : Omit<PrinterGroup, "id"> = {
          name,
          externalIDs: externalIds,
          singleItemPerTicket
        };
        const response = await fetch(`${HOST_API}/api/v1/menu/printergroup`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.status === 201) {
          enqueueSnackbar(`Added new printer group: ${name}.`);
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to add printer group: ${name}. Got error: ${JSON.stringify(error)}.`, { variant: "error" });
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <PrinterGroupComponent
      confirmText="Add"
      onCloseCallback={onCloseCallback}
      onConfirmClick={addPrinterGroup}
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

export default PrinterGroupAddContainer;
