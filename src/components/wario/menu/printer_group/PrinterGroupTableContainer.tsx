import React, { Dispatch, SetStateAction, useCallback, useState } from "react";

import { GridActionsCellItem, GridRenderCellParams, GridRowParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useGridApiRef, GRID_TREE_DATA_GROUPING_FIELD, GRID_DETAIL_PANEL_TOGGLE_COL_DEF, GridDetailPanelToggleCell } from "@mui/x-data-grid-pro";
import { AddBox, DeleteOutline, Edit } from "@mui/icons-material";
import { FormControlLabel, Tooltip, Switch, IconButton } from '@mui/material';
import { CatalogCategoryEntry, ICategory, IProduct, IProductInstance, PrinterGroup } from "@wcp/wcpshared";
import TableWrapperComponent from "../../table_wrapper.component";
import { useAppSelector } from "../../../../hooks/useRedux";

type ValueGetterRow = GridValueGetterParams<any, PrinterGroup>;

export interface PrinterGroupTableContainerProps {
  setPrinterGroupToEdit: Dispatch<SetStateAction<PrinterGroup>>;
  setIsPrinterGroupEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsPrinterGroupDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setIsPrinterGroupAddOpn: Dispatch<SetStateAction<boolean>>;
}

const PrinterGroupTableContainer = (props: PrinterGroupTableContainerProps) => {
  const products = useAppSelector(s => s.ws.catalog?.products ?? {});
  const categories = useAppSelector(s => s.ws.catalog?.categories ?? {});

  const apiRef = useGridApiRef();

  const [panelsExpandedSize, setPanelsExpandedSize] = useState<Record<string, number>>({});
  const [hideDisabled, setHideDisabled] = useState(true);

  const editPrinterGroup = (row: PrinterGroup) => () => {
    props.setIsPrinterGroupEditOpen(true);
    props.setPrinterGroupToEdit(row);
  };

  const deletePrinterGroup = (row: PrinterGroup) => () => {
    props.setIsPrinterGroupDeleteOpen(true);
    props.setPrinterGroupToEdit(row);
  };

  return (
    <TableWrapperComponent
      sx={{minWidth: '750px'}}
      title="Printer Group View"
      apiRef={apiRef}
      treeData
      columns={[
      {
        headerName: "Actions",
        field: 'actions',
        type: 'actions',
        getActions: (params : GridRowParams<PrinterGroup>) => [
          <GridActionsCellItem
            icon={<Tooltip title="Edit Printer Group"><Edit /></Tooltip>}
            label="Edit Printer Group"
            onClick={deletePrinterGroup(params.row)}
            key={`EDIT${params.id}`} />,
          <GridActionsCellItem
            icon={<Tooltip title="Delete Printer Group"><DeleteOutline /></Tooltip>}
            label="Delete Printer Group"
            onClick={deletePrinterGroup(params.row)}
            key={`DELETE${params.id}`} />
        ]
      },
      { headerName: "Name", field: "name", valueGetter: (v: ValueGetterRow) => v.row.name, flex: 3 },
      { headerName: "Single Item Per Ticket", field: "category.display_flags.call_line_name", valueGetter: (v: ValueGetterRow) => v.row.singleItemPerTicket, flex: 3 },
      ]}
      rows={Object.values(categories)}
      getRowId={(row: PrinterGroup) => row.id}
      rowThreshold={0}
      disableToolbar={false}
    />
  );
};

export default PrinterGroupTableContainer;
