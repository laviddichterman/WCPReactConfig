import React, { Dispatch, SetStateAction } from "react";

import { GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import { AddBox, Edit, DeleteOutline } from "@mui/icons-material";
import { Tooltip, IconButton } from '@mui/material';
import { IProductInstanceFunction, WFunctional } from "@wcp/wcpshared";
import TableWrapperComponent from "../table_wrapper.component";
import { useAppSelector } from "../../../hooks/useRedux";
interface PIFTableContainerProps {
  setIsProductInstanceFunctionEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductInstanceFunctionDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductInstanceFunctionAddOpen: Dispatch<SetStateAction<boolean>>;
  setProductInstanceFunctionToEdit: Dispatch<SetStateAction<IProductInstanceFunction>>;
}
const ProductInstanceFunctionTableContainer = (props: PIFTableContainerProps) => {

  const catalog = useAppSelector(s => s.ws.catalog!);
  const editProductFunction = (row: IProductInstanceFunction) => () => {
    props.setIsProductInstanceFunctionEditOpen(true);
    props.setProductInstanceFunctionToEdit(row);
  };

  const deleteProductFunction = (row: IProductInstanceFunction) => () => {
    props.setIsProductInstanceFunctionDeleteOpen(true);
    props.setProductInstanceFunctionToEdit(row);
  };
  return (
    <TableWrapperComponent
    sx={{minWidth: "750px"}}
      disableToolbar={false}
      title="Product Instance Functions"
      toolbarActions={[{
        size: 1,
        elt:
          <Tooltip key="AddNew" title="Add Product Function"><IconButton onClick={() => props.setIsProductInstanceFunctionAddOpen(true)}><AddBox /></IconButton></Tooltip>
      }]}
      rows={Object.values(catalog.productInstanceFunctions)}
      getRowId={(row : IProductInstanceFunction) => row.id}
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
        { headerName: "Name", field: "name", valueGetter: (v: {row: IProductInstanceFunction}) => v.row.name, flex: 1 },
        { headerName: "Function", field: "expression", valueGetter: (v: {row: IProductInstanceFunction}) => WFunctional.AbstractExpressionStatementToString(v.row.expression, catalog), flex: 3 },
      ]}
    />
  );
};

export default ProductInstanceFunctionTableContainer;
