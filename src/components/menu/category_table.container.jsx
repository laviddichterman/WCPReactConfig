import React from "react";

import TableWrapperComponent from "../table_wrapper.component";
import ProductTableContainer from "./product_table.container";
import { AddBox, DeleteOutline, Edit } from "@material-ui/icons";

const CategoryTableContainer = ({
  categories,
  catalog_map,
  setIsCategoryInterstitialOpen,
  setIsCategoryEditOpen,
  setIsCategoryDeleteOpen,
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
        },
        {
          icon: DeleteOutline,
          tooltip: 'Delete Category',
          onClick: (event, rowData) => {
            setIsCategoryDeleteOpen(true);
            setCategoryToEdit(rowData);
          },
        }
      ]}
      data={categories}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
      detailPanel={[
        {
          render: (rowData) => {
            return catalog_map.category_map[rowData._id].products.length ? (
            <ProductTableContainer
              product={rowData}
              catalog_map={catalog_map}
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
