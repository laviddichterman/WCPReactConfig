import React, { Dispatch, SetStateAction } from "react";

import { GridActionsCellItem } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid-pro";
import { AddBox, DeleteOutline, Edit } from "@mui/icons-material";
import { Tooltip, IconButton } from '@mui/material';
import TableWrapperComponent from "./table_wrapper.component";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { FulfillmentConfig } from "@wcp/wcpshared";

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
  const dispatch = useAppDispatch();
  const fulfillments = useAppSelector(s=>s.ws.fulfillments ?? {});
  const apiRef = useGridApiRef();


  // WE LAST LEFT OFF WE... NEEDED TO ADD POPUP DIALOGUES FOR ADDING/EDITING/DELETING fulfillments
  // maybe the new UX stuff we have offers an easy soluton with redux state

  const editFulfillment = (fId : string) => () => {
    setIsFulfillmentEditOpen(true);
    setFulfillmentToEdit(fulfillments[fId]);
  };

  const deleteFulfillment = (fId : string) => () => {
    setIsFulfillmentDeleteOpen(true);
    setFulfillmentToEdit(fulfillments[fId]);
  };

  return (
    <TableWrapperComponent
      title="Fulfillment Config"
      apiRef={apiRef}
      columns={[
      {
        headerName: "Actions",
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
          <GridActionsCellItem
            icon={<Tooltip title="Edit Fulfillment"><Edit /></Tooltip>}
            label="Edit Fulfillment"
            onClick={editFulfillment(params.row.id)}
            key={`EDIT${params.row.id}`} />,
          <GridActionsCellItem
            icon={<Tooltip title="Delete Fulfillment"><DeleteOutline /></Tooltip>}
            label="Delete Fulfillment"
            onClick={deleteFulfillment(params.row)}
            key={`DELETE${params.row.id}`} />
        ]
      },
      { headerName: "Display Name", field: "displayName", valueGetter: (v: { row: FulfillmentConfig }) => v.row.displayName, width: 60 },
      { headerName: "Ordinal", field: "ordinal", valueGetter: (v: { row: FulfillmentConfig }) => v.row.ordinal, width: 3 },
      { headerName: "FulfillmentType", field: "fulfillment", valueGetter: (v: { row: FulfillmentConfig }) => v.row.service },
      ]}
      toolbarActions={[{
        size: 1,
        elt: <Tooltip key="ADDNEW" title="Add Fulfillment"><IconButton onClick={() => setIsFulfillmentAddOpen(true)}><AddBox /></IconButton></Tooltip>
      }]}
      rows={Object.values(fulfillments)}
      rowThreshold={0}
      disableToolbar={false}    
    />
  );
};

export default FulfillmentTableContainer;
