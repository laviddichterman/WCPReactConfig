import React from "react";

import TableWrapperComponent from "../table_wrapper.component";
import ProductTableContainer from "./product_table.container";
import { AddBox, DeleteOutline, Edit } from "@material-ui/icons";

const CategoryTableContainer = ({
  catalog,
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
        rows.find((a) => a.category._id === row.category.parent_id)
      }
      columns={[
        { title: "Name", field: "category.name" },
        { title: "Description", field: "category.description" },
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
            setCategoryToEdit(rowData.category);
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
      data={Object.values(catalog.categories)}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
      detailPanel={[
        {
          render: (rowData) => {
            return catalog.categories[rowData.category._id].products.length ? (
            <ProductTableContainer
              category={rowData.category}
              catalog={catalog}
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
