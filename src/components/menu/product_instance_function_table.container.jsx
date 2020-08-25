import React from "react";

import TableWrapperComponent from "../table_wrapper.component";
import { AddBox, Edit, DeleteOutline } from "@material-ui/icons";

const ProductInstanceFunctionTableContainer = ({
  product_instance_functions,
  setIsProductInstanceFunctionEditOpen,
  setIsProductInstanceFunctionDeleteOpen,
  setIsProductInstanceFunctionAddOpen,
  setProductInstanceFunctionToEdit,
}) => {
  return (
    <TableWrapperComponent
      title="Product Instance Functions"
      columns={[
        { title: "Name", field: "name" },
      ]}
      options={{
        detailPanelType: "single",
        draggable: false,
        paging: false,
      }}
      actions={[
        {
          icon: AddBox,
          tooltip: "Add Product Function",
          onClick: (event, rowData) => {
            setIsProductInstanceFunctionAddOpen(true);
          },
          isFreeAction: true,
        },
        {
          icon: Edit,
          tooltip: "Edit Product Function",
          onClick: (event, rowData) => {
            setIsProductInstanceFunctionEditOpen(true);
            setProductInstanceFunctionToEdit(rowData);
          },
        },
        {
          icon: DeleteOutline,
          tooltip: 'Delete Product Function',
          onClick: (event, rowData) => {
            setIsProductInstanceFunctionDeleteOpen(true);
            setProductInstanceFunctionToEdit(rowData);
          },
        }
      ]}
      data={product_instance_functions}
    />
  );
};

export default ProductInstanceFunctionTableContainer;
