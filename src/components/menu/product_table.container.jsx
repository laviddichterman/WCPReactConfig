import React from "react";

import TableWrapperComponent from "../table_wrapper.component";
import { AddBox, Edit } from "@material-ui/icons";

const ProductTableContainer = ({
  product,
  category_map,
  product_map,
  setProductToEdit,
  setIsProductEditOpen,
  setIsProductInstanceAddOpen,
  setIsProductInstanceEditOpen,
  setProductInstanceToEdit
}) => {
  return (
    <TableWrapperComponent
      options={{
        showTitle: false,
        showEmptyDataSourceMessage: false,
        sorting: false,
        draggable: false,
        search: false,
        rowStyle: {
          padding: 0,
        },
        toolbar: false,
        paging: category_map[product._id].products.length > 5,
      }}
      actions={[
        {
          icon: Edit,
          tooltip: "Edit Product",
          onClick: (event, rowData) => {
            setIsProductEditOpen(true);
            setProductToEdit(rowData.product);
          },
        },
        {
          icon: AddBox,
          tooltip: "Add Product Instance",
          onClick: (event, rowData) => {
            setIsProductInstanceAddOpen(true);
            setProductToEdit(rowData.product);
          },
        },
      ]}
      columns={[
        { title: "Name", field: "product.item.display_name" },
        { title: "Price", field: "product.item.price.amount" },
        { title: "Shortcode", field: "product.item.shortcode" },
        { title: "Description", field: "product.item.description" },
        { title: "EXID: Revel", field: "product.item.externalIDs.revelID" },
        { title: "EXID: Square", field: "product.item.externalIDs.squareID" },
        { title: "Disabled", field: "product.item.disabled" },
      ]}
      data={Object.values(product_map).filter((x) =>
        x.product.category_ids.includes(product._id)
      )}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
      detailPanel={[
        {
          render: (rowData) => {
            return product_map[rowData.product._id].instances.length ? (
            <TableWrapperComponent
              options={{
                showTitle: false,
                showEmptyDataSourceMessage: false,
                sorting: false,
                draggable: false,
                search: false,
                rowStyle: {
                  padding: 0,
                },
                toolbar: false,
                paging: product_map[rowData.product._id].instances.length > 5
              }}
              actions={[
                {
                  icon: Edit,
                  tooltip: 'Edit Product Instance',
                  onClick: (event, rowData) => {
                    setIsProductInstanceEditOpen(true);
                    setProductInstanceToEdit(rowData);
                  },
                }
              ]}
              columns={[
                { title: "Name", field: "item.display_name" },
                { title: "Price", field: "item.price.amount" },
                { title: "Shortcode", field: "item.shortcode" },
                { title: "Description", field: "item.description" },
                { title: "EXID: Revel", field: "item.externalIDs.revelID" },
                { title: "EXID: Square", field:  "item.externalIDs.squareID" },
                { title: "Disabled", field: "item.disabled" },
              ]}
              data={product_map[rowData.product._id].instances}
               />) : JSON.stringify(product_map[rowData.product._id])
          },
          icon: ()=> { return null }
        }
      ]}
    />
  );
};

export default ProductTableContainer;
