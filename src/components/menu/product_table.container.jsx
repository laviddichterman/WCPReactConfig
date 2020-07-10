import React from "react";

import TableWrapperComponent from "../table_wrapper.component";
import { AddBox, DeleteOutline, Edit } from "@material-ui/icons";

const ProductTableContainer = ({
  tableTitle,
  products,
  catalog,
  setProductToEdit,
  setIsProductEditOpen,
  setIsProductDeleteOpen,
  setIsProductInstanceAddOpen,
  setIsProductInstanceEditOpen,
  setIsProductInstanceDeleteOpen,
  setProductInstanceToEdit
}) => {
  return (
    <TableWrapperComponent
      title={tableTitle}
      options={{
        showTitle: tableTitle && tableTitle.length > 0,
        showEmptyDataSourceMessage: false,
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
          icon: AddBox,
          tooltip: "Add Product Instance",
          onClick: (event, rowData) => {
            setIsProductInstanceAddOpen(true);
            setProductToEdit(rowData.product);
          },
        },
        {
          icon: Edit,
          tooltip: "Edit Product",
          onClick: (event, rowData) => {
            setIsProductEditOpen(true);
            setProductToEdit(rowData.product);
          },
        },
        {
          icon: DeleteOutline,
          tooltip: 'Delete Product',
          onClick: (event, rowData) => {
            setIsProductDeleteOpen(true);
            setProductToEdit(rowData.product);
          },
        }
      ]}
      columns={[
        { title: "Name", field: "product.item.display_name" },
        { title: "Price", field: "product.item.price.amount" },
        { title: "Shortcode", field: "product.item.shortcode" },
        { title: "Description", field: "product.item.description" },
        { title: "Ordinal", field: "product.ordinal", defaultSort: "asc" },
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
                },
                {
                  icon: DeleteOutline,
                  tooltip: 'Delete Product Instance',
                  onClick: (event, instanceRowData) => {
                    setIsProductInstanceDeleteOpen(true);
                    setProductInstanceToEdit(instanceRowData);
                  },
                }
              ]}
              columns={[
                { title: "Name", field: "item.display_name" },
                { title: "Price", field: "item.price.amount" },
                { title: "Shortcode", field: "item.shortcode" },
                { title: "Description", field: "item.description" },
                { title: "Ordinal", field: "ordinal", defaultSort: "asc" },
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
