import React from "react";

import TableWrapperComponent from "../table_wrapper.component";
import { AddBox, Edit } from "@material-ui/icons";

const ProductTableContainer = ({
  tableTitle,
  products,
  catalog,
  setProductToEdit,
  setIsProductEditOpen,
  setIsProductInstanceAddOpen,
  setIsProductInstanceEditOpen,
  setProductInstanceToEdit
}) => {
  return (
    <TableWrapperComponent
      title={tableTitle}
      options={{
        showTitle: tableTitle && tableTitle.length > 0,
        showEmptyDataSourceMessage: false,
        sorting: false,
        draggable: false,
        search: false,
        rowStyle: {
          padding: 0,
        },
        toolbar: false,
        paging: false,
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
      data={products}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
      detailPanel={[
        {
          render: (rowData) => {
            return catalog.products[rowData.product._id].instances.length ? (
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
                paging: false
              }}
              actions={[
                {
                  icon: Edit,
                  tooltip: 'Edit Product Instance',
                  onClick: (event, instanceRowData) => {
                    setIsProductInstanceEditOpen(true);
                    setProductToEdit(rowData.product);
                    setProductInstanceToEdit(instanceRowData);
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
              data={catalog.products[rowData.product._id].instances}
               />) : ""
          },
          icon: ()=> { return null }
        }
      ]}
    />
  );
};

export default ProductTableContainer;
