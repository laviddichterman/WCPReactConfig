import { Dispatch, SetStateAction } from "react";

// import { GridActionsCellItem } from "@mui/x-data-grid";
import { GridActionsCellItem, useGridApiRef } from "@mui/x-data-grid-premium";
import { AddBox, DeleteOutline, Edit } from "@mui/icons-material";
import { Tooltip, IconButton } from '@mui/material';
import TableWrapperComponent from "./table_wrapper.component";
import { useAppSelector } from "../../hooks/useRedux";
import { FulfillmentConfig } from "@wcp/wcpshared";
import { getFulfillments } from "@wcp/wario-ux-shared";

export interface FulfillmentTableContainerProps {
  setIsFulfillmentEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsFulfillmentDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setIsFulfillmentAddOpen: Dispatch<SetStateAction<boolean>>;
  setFulfillmentToEdit: Dispatch<SetStateAction<FulfillmentConfig>>;
}
const FulfillmentTableContainer = ({
  setIsFulfillmentEditOpen,
  setIsFulfillmentDeleteOpen,
  setIsFulfillmentAddOpen,
  setFulfillmentToEdit
}: FulfillmentTableContainerProps) => {
  const fulfillments = useAppSelector(s=>getFulfillments(s.ws.fulfillments));
  const apiRef = useGridApiRef();

  const editFulfillment = (fulfillment : FulfillmentConfig) => () => {
    setIsFulfillmentEditOpen(true);
    setFulfillmentToEdit(fulfillment);
  };

  const deleteFulfillment = (fulfillment : FulfillmentConfig) => () => {
    setIsFulfillmentDeleteOpen(true);
    setFulfillmentToEdit(fulfillment);
  };

  return (
    <TableWrapperComponent
      title="Fulfillment Config"
      apiRef={apiRef}
      enableSearch={false}
      columns={[
      {
        headerName: "Actions",
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
          <GridActionsCellItem
            icon={<Tooltip title="Edit Fulfillment"><Edit /></Tooltip>}
            label="Edit Fulfillment"
            onClick={editFulfillment(params.row)}
            key={`EDIT${params.row.id}`} />,
          <GridActionsCellItem
            icon={<Tooltip title="Delete Fulfillment"><DeleteOutline /></Tooltip>}
            label="Delete Fulfillment"
            onClick={deleteFulfillment(params.row)}
            key={`DELETE${params.row.id}`} />
        ]
      },
      { headerName: "Display Name", field: "displayName", flex: 4 },
      { headerName: "Ordinal", field: "ordinal", flex: 1 },
      { headerName: "FulfillmentType", field: "service", flex: 2 },
      ]}
      toolbarActions={[{
        size: 1,
        elt: <Tooltip key="ADDNEW" title="Add Fulfillment"><IconButton onClick={() => setIsFulfillmentAddOpen(true)}><AddBox /></IconButton></Tooltip>
      }]}
      rows={fulfillments}
      disableRowSelectionOnClick
    />
  );
};

export default FulfillmentTableContainer;
