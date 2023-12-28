import React, { useState } from "react";

import { GridActionsCellItem, GridRowParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid-pro";
import { AddBox, DeleteOutline, Edit } from "@mui/icons-material";
import { Tooltip, IconButton } from '@mui/material';
import { PrinterGroup } from "@wcp/wcpshared";
import TableWrapperComponent from "../../table_wrapper.component";
import { useAppSelector } from "../../../../hooks/useRedux";
import { getPrinterGroups } from "src/redux/slices/PrinterGroupSlice";
import { DialogContainer } from "@wcp/wario-ux-shared";

type ValueGetterRow = GridValueGetterParams<any, PrinterGroup>;

const PrinterGroupTableContainer = () => {
  const printerGroups = useAppSelector(s => getPrinterGroups(s.printerGroup.printerGroups));
  const [isPrinterGroupAddOpen, setIsPrinterGroupAddOpen] = useState(false);
  const [isPrinterGroupDeleteOpen, setIsPrinterGroupDeleteOpen] = useState(false);
  const [isPrinterGroupEditOpen, setIsPrinterGroupEditOpen] = useState(false);
  const [printerGroupToEdit, setPrinterGroupToEdit] = useState<PrinterGroup | null>(null);
  const apiRef = useGridApiRef();

  const editPrinterGroup = (row: PrinterGroup) => () => {
    setIsPrinterGroupEditOpen(true);
    setPrinterGroupToEdit(row);
  };

  const deletePrinterGroup = (row: PrinterGroup) => () => {
    setIsPrinterGroupDeleteOpen(true);
    setPrinterGroupToEdit(row);
  };

  return (
    <>
      <TableWrapperComponent
        sx={{ minWidth: '750px' }}
        title="Printer Group View"
        apiRef={apiRef}
        columns={[
          {
            headerName: "Actions",
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams<PrinterGroup>) => [
              <GridActionsCellItem
                placeholder
                icon={<Tooltip title="Edit Printer Group"><Edit /></Tooltip>}
                label="Edit Printer Group"
                onClick={editPrinterGroup(params.row)}
                key={`EDIT${params.id}`} />,
              <GridActionsCellItem
                placeholder
                icon={<Tooltip title="Delete Printer Group"><DeleteOutline /></Tooltip>}
                label="Delete Printer Group"
                onClick={deletePrinterGroup(params.row)}
                key={`DELETE${params.id}`} />
            ]
          },
          { headerName: "Name", field: "name", valueGetter: (v: ValueGetterRow) => v.row.name, flex: 4 },
          { headerName: "Single Item Per Ticket", field: "row.singleItemPerTicket", valueGetter: (v: ValueGetterRow) => v.row.singleItemPerTicket, flex: 3 },
          { headerName: "Is Expo", field: "row.isExpo", valueGetter: (v: ValueGetterRow) => v.row.isExpo, flex: 2 },
        ]}
        toolbarActions={[{
          size: 1,
          elt: <Tooltip key="ADDNEW" title="Add Printer Group"><IconButton onClick={() => setIsPrinterGroupAddOpen(true)}><AddBox /></IconButton></Tooltip>
        }]}
        rows={Object.values(printerGroups)}
        getRowId={(row: PrinterGroup) => row.id}
        rowThreshold={0}
        disableToolbar={false}
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Add Printer Group"}
        onClose={() => setIsPrinterGroupAddOpen(false)}
        open={isPrinterGroupAddOpen}
        innerComponent={
          <PrinterGroupAddContainer
            onCloseCallback={() => setIsPrinterGroupAddOpen(false)}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Printer Group"}
        onClose={() => setIsPrinterGroupEditOpen(false)}
        open={isPrinterGroupEditOpen}
        innerComponent={
          printerGroupToEdit !== null &&
          <PrinterGroupEditContainer
            onCloseCallback={() => setIsPrinterGroupEditOpen(false)}
            printerGroup={printerGroupToEdit}
          />
        }
      />
      <DialogContainer
        title={"Delete Printer Group"}
        onClose={() => {
          setIsPrinterGroupDeleteOpen(false);
        }}
        open={isPrinterGroupDeleteOpen}
        innerComponent={
          printerGroupToEdit !== null &&
          <PrinterGroupDeleteContainer
            onCloseCallback={() => {
              setIsPrinterGroupDeleteOpen(false);
            }}
            printerGroup={printerGroupToEdit}
          />
        }
      />
    </>
  );
};

export default PrinterGroupTableContainer;

const PrinterGroupDeleteContainer = React.lazy(() => import("./PrinterGroupDeleteContainer"));
const PrinterGroupEditContainer = React.lazy(() => import("./PrinterGroupEditContainer"));
const PrinterGroupAddContainer = React.lazy(() => import("./PrinterGroupAddContainer"));
