import React, {useCallback} from "react";
import moment from 'moment';

import TableWrapperComponent from "../table_wrapper.component";
import {GridActionsCellItem}  from "@mui/x-data-grid";
import { AddBox, DeleteOutline, Edit, LibraryAdd } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';

const ProductTableContainer = ({
  tableTitle,
  products,
  catalog,
  setProductToEdit,
  setIsProductEditOpen,
  setIsProductCopyOpen,
  setIsProductDeleteOpen,
  setIsProductInstanceAddOpen,
  setIsProductInstanceEditOpen,
  setIsProductInstanceDeleteOpen,
  setProductInstanceToEdit
}) => {
  const addProductInstance = (row) => () => {
    setIsProductInstanceAddOpen(true);
    setProductToEdit(row.product);
  };
  const editProduct = (row) => () => {
    setIsProductEditOpen(true);
    setProductToEdit(row.product);
  };
  const deleteProduct = (row) => () => {
    setIsProductDeleteOpen(true);
    setProductToEdit(row.product);
  };
  const copyProduct = (row) => () => {
    setIsProductCopyOpen(true);
    setProductToEdit(row.product);
  };

  const getDetailPanelContent = useCallback(({ row }) => catalog.products[row.product._id].instances.length ? (
    <TableWrapperComponent
              options={{
                showTitle: false,
                showEmptyDataSourceMessage: false,
              }}
              columns={[
                {
                  headerName: "Actions",
                  field: 'actions',
                  type: 'actions',
                  getActions: (params) => [
                    <GridActionsCellItem
                      icon={<Tooltip title="Edit Product Instance"><Edit/></Tooltip>}
                      label="Edit Product Instance"
                      onClick={(() => {
                        setIsProductInstanceEditOpen(true);
                        setProductToEdit(row.product);
                        setProductInstanceToEdit(params.row);
                      })}
                    />,
                    <GridActionsCellItem
                      icon={<Tooltip title="Delete Product Instance"><DeleteOutline/></Tooltip>}
                      label="Delete Product Instance"
                      onClick={(() => {
                        setIsProductInstanceDeleteOpen(true);
                        setProductInstanceToEdit(params.row)
                      })}
                    />
                  ]
                },
                { headerName: "Name", field: "item.display_name", valueGetter: v => v.row.item.display_name },
                { headerName: "Price", field: "item.price.amount", valueGetter: v => `$${Number(v.row.item.price.amount / 100).toFixed(2)}` },
                { headerName: "Shortcode", field: "item.shortcode", valueGetter: v => v.row.item.shortcode },
                { headerName: "Description", field: "item.description", valueGetter: v => v.row.item.description },
                { headerName: "Ordinal", field: "ordinal", valueGetter: v => v.row.ordinal, defaultSort: "asc" },
                { headerName: "Disabled", field: "item.disabled", valueGetter: v => v.row.item.disabled ? (v.row.item.disabled.start > v.row.item.disabled.end ? "True" : `${moment(v.row.item.disabled.start).format("MMMM DD, Y hh:mm A")} to  ${moment(v.row.item.disabled.end).format("MMMM DD, Y hh:mm A")}`) : "False" },
              ]}
              rows={catalog.products[row.product._id].instances}
              getRowId={(row_inner) => row_inner._id}
               />) : (
    ""
  ), [catalog.products, setIsProductInstanceDeleteOpen, setIsProductInstanceEditOpen, setProductInstanceToEdit, setProductToEdit]);
      

  return (
    <TableWrapperComponent
      title={tableTitle}
      options={{
        showTitle: tableTitle && tableTitle.length > 0,
        showEmptyDataSourceMessage: false,
        search: false,
        rowStyle: {
          padding: 0,
        },
        toolbar: tableTitle && tableTitle.length > 0,
      }}
      columns={[
        {
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params) => [
            <GridActionsCellItem
              icon={<Tooltip title="Add Product Instance"><AddBox/></Tooltip>}
              label="Add Product Instance"
              onClick={addProductInstance(params.row)}
            />,
            <GridActionsCellItem
              icon={<Tooltip title="Copy Product"><LibraryAdd/></Tooltip>}
              label="Copy Product"
              onClick={copyProduct(params.row)}
              showInMenu
            />,
            <GridActionsCellItem
              icon={<Tooltip title="Edit Product"><Edit/></Tooltip>}
              label="Edit Product"
              onClick={editProduct(params.row)}
            />,
            <GridActionsCellItem
              icon={<Tooltip title="Delete Product"><DeleteOutline/></Tooltip>}
              label="Delete Product"
              onClick={deleteProduct(params.row)}
              showInMenu
            />
          ]
        },
        { headerName: "Name", field: "product.item.display_name", valueGetter: v => v.row.product.item.display_name, defaultSort: "asc" },
        { headerName: "Modifiers", field: "product.modifiers", valueGetter: v => v.row.product.modifiers ? v.row.product.modifiers.map(x=>catalog.modifiers[x.mtid].modifier_type.name).join(", ") : "" },
      ]}
      rows={products}
      getRowId={(row) => row.product._id}
      getDetailPanelContent={getDetailPanelContent}
      //onRowClick={(event, rowData, togglePanel) => togglePanel()}
    />
  );
};

export default ProductTableContainer;
