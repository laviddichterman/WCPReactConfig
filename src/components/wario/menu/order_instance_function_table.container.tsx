import React, { Dispatch, SetStateAction } from "react";

import { GridActionsCellItem } from "@mui/x-data-grid-premium";
import { AddBox, Edit, DeleteOutline } from "@mui/icons-material";
import { Tooltip, IconButton } from '@mui/material';
import { OrderFunctional, OrderInstanceFunction } from "@wcp/wcpshared";
import TableWrapperComponent from "../table_wrapper.component";
import { useAppSelector } from "../../../hooks/useRedux";
import { getModifierOptionById, getModifierTypeEntryById, getOrderInstanceFunctions } from "@wcp/wario-ux-shared";
interface OIFTableContainerProps {
  setIsOrderInstanceFunctionEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsOrderInstanceFunctionDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setIsOrderInstanceFunctionAddOpen: Dispatch<SetStateAction<boolean>>;
  setOrderInstanceFunctionToEdit: Dispatch<SetStateAction<OrderInstanceFunction>>;
}
const OrderInstanceFunctionTableContainer = (props: OIFTableContainerProps) => {
  const modifierTypeSelector = useAppSelector(s => (id: string) => getModifierTypeEntryById(s.ws.modifierEntries, id));
  const modifierOptionSelector = useAppSelector(s => (id: string) => getModifierOptionById(s.ws.modifierOptions, id));
  const orderInstanceFunctions = useAppSelector(s => getOrderInstanceFunctions(s.ws.orderInstanceFunctions))

  const catalog = useAppSelector(s => s.ws.catalog!);
  const editOrderFunction = (row: OrderInstanceFunction) => () => {
    props.setIsOrderInstanceFunctionEditOpen(true);
    props.setOrderInstanceFunctionToEdit(row);
  };

  const deleteOrderFunction = (row: OrderInstanceFunction) => () => {
    props.setIsOrderInstanceFunctionDeleteOpen(true);
    props.setOrderInstanceFunctionToEdit(row);
  };
  return (
    <TableWrapperComponent
    sx={{minWidth: "750px"}}
      disableToolbar={false}
      disableRowSelectionOnClick
      title="Order Instance Functions"
      toolbarActions={[{
        size: 1,
        elt:
          <Tooltip key="AddNew" title="Add Order Function"><IconButton onClick={() => props.setIsOrderInstanceFunctionAddOpen(true)}><AddBox /></IconButton></Tooltip>
      }]}
      rows={Object.values(catalog.orderInstanceFunctions)}
      getRowId={(row : OrderInstanceFunction) => row.id}
      columns={[
        {
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params) => [
            <GridActionsCellItem
              icon={<Tooltip title="Edit Order Function"><Edit /></Tooltip>}
              label="Edit Order Function"
              onClick={editOrderFunction(params.row)}
              key="EditPF"
            />,
            <GridActionsCellItem
              icon={<Tooltip title="Delete Order Function"><DeleteOutline /></Tooltip>}
              label="Delete Order Function"
              onClick={deleteOrderFunction(params.row)}
              key="DelPF"
            />
          ]
        },
        { headerName: "Name", field: "name", valueGetter: (v: {row: OrderInstanceFunction}) => v.row.name, flex: 1 },
        { headerName: "Function", field: "expression", valueGetter: (v: {row: OrderInstanceFunction}) => OrderFunctional.AbstractOrderExpressionStatementToString(v.row.expression, { modifierEntry: modifierTypeSelector, option: modifierOptionSelector }), flex: 3 },
      ]}
    />
  );
};

export default OrderInstanceFunctionTableContainer;
