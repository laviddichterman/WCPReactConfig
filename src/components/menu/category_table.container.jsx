import React from "react";

import TableWrapperComponent from "../table_wrapper.component";
import ProductTableContainer from "./product_table.container";
import { AddBox, Edit } from "@material-ui/icons";

const CategoryTableContainer = ({
  categories,
  category_map,
  product_map,
  setIsCategoryInterstitialOpen,
  setIsCategoryEditOpen,
  setCategoryToEdit,
  setProductToEdit,
  setIsProductEditOpen,
  setIsProductInstanceAddOpen,
  setIsProductInstanceEditOpen,
  setProductInstanceToEdit
}) => {
  return (
    <TableWrapperComponent
      title="Catalog Tree View"
      parentChildData={(row, rows) =>
        rows.find((a) => a._id === row.parent_id)
      }
      columns={[
        { title: "Name", field: "name" },
        { title: "Description", field: "description" },
      ]}
      options={{
        detailPanelType: "single",
        draggable: false,
        paging: false
      }}
      actions={[
        {
          icon: AddBox,
          tooltip: 'Add new...',
          onClick: (event, rowData) => {
            setIsCategoryInterstitialOpen(true);
          },
          isFreeAction: true
        },
        {
          icon: Edit,
          tooltip: 'Edit Category',
          onClick: (event, rowData) => {
            setIsCategoryEditOpen(true);
            setCategoryToEdit(rowData);
          },
        }
      ]}
      data={categories}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
      detailPanel={[
        {
          render: (rowData) => {
            return category_map[rowData._id].products.length ? (
            <ProductTableContainer
              product={rowData}
              category_map={category_map}
              product_map={product_map}
              setProductToEdit={setProductToEdit}            
              setIsProductEditOpen={setIsProductEditOpen}            
              setIsProductInstanceAddOpen={setIsProductInstanceAddOpen}   
              setIsProductInstanceEditOpen={setIsProductInstanceEditOpen}   
              setProductInstanceToEdit={setProductInstanceToEdit}
               />) : ""
          },
          icon: ()=> { return null }
        }
      ]}
    />
  );
};

export default CategoryTableContainer;
