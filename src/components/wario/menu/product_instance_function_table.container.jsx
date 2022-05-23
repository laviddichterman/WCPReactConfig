import React from "react";

import {GridActionsCellItem}  from "@mui/x-data-grid";
import { AddBox, Edit, DeleteOutline } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
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

      actions={[
        {
          icon: AddBox,
          tooltip: "Add Product Function",
          onClick: (event, rowData) => {
            setIsProductInstanceFunctionAddOpen(true);
          },
          isFreeAction: true,
        }
      ]}
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
            />,
            <GridActionsCellItem
              icon={<Tooltip title="Delete Product Function"><DeleteOutline/></Tooltip>}
              label="Delete Product Function"
              onClick={deleteProductFunction(params.row)}
            />
          ]
        },
        { headerName: "Name", field: "name", valueGetter: v => v.row.name, defaultSort: "asc"},
        { headerName: "Function", field: "expression", valueGetter: v => WFunctional.AbstractExpressionStatementToString(v.row.expression, modifier_types)},
      ]}
    />
  );
};

export default ProductInstanceFunctionTableContainer;
