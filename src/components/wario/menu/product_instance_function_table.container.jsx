import React from "react";

import {GridActionsCellItem}  from "@mui/x-data-grid";
import { AddBox, Edit, DeleteOutline } from "@mui/icons-material";
import { Tooltip, IconButton } from '@mui/material';
import { WFunctional } from "@wcp/wcpshared";
import TableWrapperComponent from "../table_wrapper.component";

const ProductInstanceFunctionTableContainer = ({
  product_instance_functions,
  modifier_types,
  setIsProductInstanceFunctionEditOpen,
  setIsProductInstanceFunctionDeleteOpen,
  setIsProductInstanceFunctionAddOpen,
  setProductInstanceFunctionToEdit,
}) => {
  const editProductFunction = (row) => () => {
    setIsProductInstanceFunctionEditOpen(true);
    setProductInstanceFunctionToEdit(row);
  };

  const deleteProductFunction = (row) => () => {
    setIsProductInstanceFunctionDeleteOpen(true);
    setProductInstanceFunctionToEdit(row);
  };
  return (
    <TableWrapperComponent
      title="Product Instance Functions"
      toolbarActions={[{
        size: 1, 
        elt:
          <Tooltip key="ADDNEW" title="Add Product Function"><IconButton onClick={() => setIsProductInstanceFunctionAddOpen(true)}><AddBox /></IconButton></Tooltip>
      }]}
      rows={product_instance_functions}
      getRowId={(row) => row._id}
      columns={[
        {
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params) => [
            <GridActionsCellItem
              icon={<Tooltip title="Edit Product Function"><Edit/></Tooltip>}
              label="Edit Product Function"
              onClick={editProductFunction(params.row)}
              key="EDITPF"
            />,
            <GridActionsCellItem
              icon={<Tooltip title="Delete Product Function"><DeleteOutline/></Tooltip>}
              label="Delete Product Function"
              onClick={deleteProductFunction(params.row)}
              key="DELPF"
            />
          ]
        },
        { headerName: "Name", field: "name", valueGetter: v => v.row.name, defaultSort: "asc", flex: 1},
        { headerName: "Function", field: "expression", valueGetter: v => WFunctional.AbstractExpressionStatementToString(v.row.expression, modifier_types), flex: 3},
      ]}
    />
  );
};

export default ProductInstanceFunctionTableContainer;
