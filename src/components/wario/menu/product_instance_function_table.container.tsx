import React, { Dispatch, SetStateAction } from "react";

import { GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import { AddBox, Edit, DeleteOutline } from "@mui/icons-material";
import { Tooltip, IconButton } from '@mui/material';
import { IProductInstanceFunction, WFunctional } from "@wcp/wcpshared";
import TableWrapperComponent from "../table_wrapper.component";
import { useAppSelector } from "../../../hooks/useRedux";
import { getModifierTypeEntryById, getModifierOptionById, getProductInstanceFunctions } from "@wcp/wario-ux-shared";
interface PIFTableContainerProps {
  setIsProductInstanceFunctionEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductInstanceFunctionDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductInstanceFunctionAddOpen: Dispatch<SetStateAction<boolean>>;
  setPifIdToEdit: Dispatch<SetStateAction<string>>;
}
const ProductInstanceFunctionTableContainer = (props: PIFTableContainerProps) => {
  const modifierTypeSelector = useAppSelector(s => (id: string) => getModifierTypeEntryById(s.ws.modifierEntries, id));
  const modifierOptionSelector = useAppSelector(s => (id: string) => getModifierOptionById(s.ws.modifierOptions, id));
  const productInstanceFunctions = useAppSelector(s => getProductInstanceFunctions(s.ws.productInstanceFunctions))
  const editProductFunction = (row: IProductInstanceFunction) => () => {
    props.setIsProductInstanceFunctionEditOpen(true);
    props.setPifIdToEdit(row.id);
  };

  const deleteProductFunction = (row: IProductInstanceFunction) => () => {
    props.setIsProductInstanceFunctionDeleteOpen(true);
    props.setPifIdToEdit(row.id);
  };
  return (
    <TableWrapperComponent
      sx={{ minWidth: "750px" }}
      disableToolbar={false}
      title="Product Instance Functions"
      toolbarActions={[{
        size: 1,
        elt:
          <Tooltip key="AddNew" title="Add Product Function"><IconButton onClick={() => props.setIsProductInstanceFunctionAddOpen(true)}><AddBox /></IconButton></Tooltip>
      }]}
      rows={productInstanceFunctions}
      getRowId={(row: IProductInstanceFunction) => row.id}
      columns={[
        {
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params: GridRowParams<IProductInstanceFunction>) => [
            <GridActionsCellItem
              icon={<Tooltip title="Edit Product Function"><Edit /></Tooltip>}
              label="Edit Product Function"
              onClick={editProductFunction(params.row)}
              key="EditPF"
            />,
            <GridActionsCellItem
              icon={<Tooltip title="Delete Product Function"><DeleteOutline /></Tooltip>}
              label="Delete Product Function"
              onClick={deleteProductFunction(params.row)}
              key="DelPF"
            />
          ]
        },
        { headerName: "Name", field: "name", valueGetter: (v: { row: IProductInstanceFunction }) => v.row.name, flex: 1 },
        { headerName: "Function", field: "expression", valueGetter: (v: { row: IProductInstanceFunction }) => WFunctional.AbstractExpressionStatementToString(v.row.expression, { modifierEntry: modifierTypeSelector, option: modifierOptionSelector }), flex: 3 },
      ]}
    />
  );
};

export default ProductInstanceFunctionTableContainer;
