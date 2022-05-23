import React, {useCallback} from "react";
import moment from 'moment';

import {GridActionsCellItem}  from "@mui/x-data-grid";
import {useGridApiRef} from "@mui/x-data-grid-pro";
import { AddBox, DeleteOutline, Edit, LibraryAdd, BedtimeOff, CheckCircle, Cancel } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import TableWrapperComponent from "../table_wrapper.component";

const ProductTableContainer = ({
  products,
  catalog,
  setProductToEdit,
  setIsProductEditOpen,
  setIsProductCopyOpen,
  setIsProductDeleteOpen,
  setIsProductDisableOpen,
  setIsProductDisableUntilEodOpen,
  setIsProductEnableOpen,
  setIsProductInstanceAddOpen,
  setIsProductInstanceEditOpen,
  setIsProductInstanceDeleteOpen,
  setProductInstanceToEdit,
  setPanelsExpandedSize
}) => {
  const apiRef = useGridApiRef();

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
  const enableProduct = (row) => () => { 
    setIsProductEnableOpen(true);
    setProductToEdit(row.product);
  };
  const disableProductUntilEOD = (row) => () => { 
    setIsProductDisableUntilEodOpen(true);
    setProductToEdit(row.product);
  };
  const disableProduct = (row) => () => { 
    setIsProductDisableOpen(true);
    setProductToEdit(row.product);
  };

  const getDetailPanelHeight = useCallback(({ row }) => catalog.products[row.product._id].instances.length ? (39 + (catalog.products[row.product._id].instances.length * 36) ) : 0, [catalog]);

  const getDetailPanelContent = useCallback(({ row }) => catalog.products[row.product._id].instances.length ? (
    <TableWrapperComponent
      disableToolbar
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
        { headerName: "Name", field: "item.display_name", valueGetter: v => v.row.item.display_name, flex: 1 },
        { headerName: "Ordinal", field: "ordinal", valueGetter: v => v.row.ordinal, defaultSort: "asc" },
        { headerName: "Menu Ordinal", field: "menuOrdinal", valueGetter: v => v.row.display_flags?.menu?.ordinal || 0},
        { headerName: "Order Ordinal", field: "orderOrdinal", valueGetter: v => v.row.display_flags?.order?.ordinal || 0 },
        { headerName: "Price", field: "item.price.amount", valueGetter: v => `$${Number(v.row.item.price.amount / 100).toFixed(2)}` },
        { headerName: "Shortcode", field: "item.shortcode", valueGetter: v => v.row.item.shortcode },
        { headerName: "Description", field: "item.description", valueGetter: v => v.row.item.description },

      ]}
      rows={catalog.products[row.product._id].instances}
      getRowId={(row_inner) => row_inner._id}
    />) : 
    (""), 
    [catalog.products, setIsProductInstanceDeleteOpen, setIsProductInstanceEditOpen, setProductInstanceToEdit, setProductToEdit]);
      
  return (
    <div style={{ height: "100%", overflow: "auto" }}>
    <TableWrapperComponent
      disableToolbar
      apiRef={apiRef}
      columns={[{
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params) => {
            const title = params.row.product.item.display_name ? params.row.product.item.display_name : "Product";
            const ADD_PRODUCT_INSTANCE = (<GridActionsCellItem
              icon={<Tooltip title={`Add Product Instance to ${title}`}><AddBox/></Tooltip>}
              label={`Add Product Instance to ${title}`}
              onClick={addProductInstance(params.row)}
            />);
            const EDIT_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Edit ${title}`}><Edit/></Tooltip>}
              label={`Edit ${title}`}
              onClick={editProduct(params.row)}
            />);
            const ENABLE_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Enable ${title}`}><CheckCircle/></Tooltip>}
              label={`Enable ${title}`}
              onClick={enableProduct(params.row)}
              showInMenu
            />);
            const DISABLE_PRODUCT_UNTIL_EOD = (<GridActionsCellItem
              icon={<Tooltip title={`Disable ${title} Until End-of-Day`}><BedtimeOff /></Tooltip>}
              label={`Disable ${title} Until EOD`}
              onClick={disableProductUntilEOD(params.row)}
              showInMenu
            />);
            const DISABLE_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Disable ${title}`}><Cancel /></Tooltip>}
              label={`Disable ${title}`}
              onClick={disableProduct(params.row)}
              showInMenu
            />);
            const COPY_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Copy ${title}`}><LibraryAdd/></Tooltip>}
              label={`Copy ${title}`}
              onClick={copyProduct(params.row)}
              showInMenu
            />);
            const DELETE_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Delete ${title}`}><DeleteOutline/></Tooltip>}
              label={`Delete ${title}`}
              onClick={deleteProduct(params.row)}
              showInMenu
            />);
            return params.row.product.disabled ? [ADD_PRODUCT_INSTANCE, EDIT_PRODUCT, ENABLE_PRODUCT, COPY_PRODUCT, DELETE_PRODUCT] : [ADD_PRODUCT_INSTANCE, EDIT_PRODUCT, DISABLE_PRODUCT_UNTIL_EOD, DISABLE_PRODUCT, COPY_PRODUCT, DELETE_PRODUCT];
          } 
        },
        { headerName: "Name", field: "product.item.display_name", valueGetter: v => v.row.product.item.display_name, defaultSort: "asc", flex: 1 },
        { headerName: "Modifiers", field: "product.modifiers", valueGetter: v => v.row.product.modifiers ? v.row.product.modifiers.map(x=>catalog.modifiers[x.mtid].modifier_type.name).join(", ") : "" },
        { headerName: "Disabled", field: "product.disabled", valueGetter: v => v.row.product.disabled ? (v.row.product.disabled.start > v.row.product.disabled.end ? "True" : `${moment(v.row.product.disabled.start).format("MMMM DD, Y hh:mm A")} to ${moment(v.row.product.disabled.end).format("MMMM DD, Y hh:mm A")}`) : "False" },
      ]}
      rows={products}
      getRowId={(row) => row.product._id}
      getDetailPanelContent={getDetailPanelContent}
      getDetailPanelHeight={getDetailPanelHeight}
      onDetailPanelExpandedRowIdsChange={(ids) => setPanelsExpandedSize(ids.reduce((acc, rid) => acc + 39 + (catalog.products[rid].instances.length * 36), 0))}
      rowThreshold={0}
      onRowClick={(params, ) => apiRef.current.toggleDetailPanel(params.id)}
    />
    </div>
  );
};

export default ProductTableContainer;
