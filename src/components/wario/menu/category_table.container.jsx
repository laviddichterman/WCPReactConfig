import React, { useCallback, useState } from "react";

import { GridActionsCellItem } from "@mui/x-data-grid";
import { useGridApiRef, GRID_TREE_DATA_GROUPING_FIELD, GRID_DETAIL_PANEL_TOGGLE_COL_DEF, GridDetailPanelToggleCell } from "@mui/x-data-grid-pro";
import { AddBox, DeleteOutline, Edit } from "@mui/icons-material";
import { FormControlLabel, Tooltip, Switch, IconButton } from '@mui/material';
import ProductTableContainer from "./product_table.container";
import TableWrapperComponent from "../table_wrapper.component";

const CategoryTableContainer = ({
  catalog,
  setIsCategoryInterstitialOpen,
  setIsCategoryEditOpen,
  setIsCategoryDeleteOpen,
  setCategoryToEdit,
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
  setProductInstanceToEdit
}) => {
  const apiRef = useGridApiRef();

  const [panelsExpandedSize, setPanelsExpandedSize] = useState({});
  const [hideDisabled, setHideDisabled] = useState(true);

  const setPanelsExpandedSizeForRow = useCallback((row) => (size) => {
    const obj = JSON.parse(JSON.stringify(panelsExpandedSize));
    obj[row] = size;
    setPanelsExpandedSize(obj)
  }, [panelsExpandedSize]);

  const getProductsInCategory = useCallback((category_id) => Object.values(catalog.products).filter((x) =>
  x.product.category_ids.includes(category_id) && (!hideDisabled || (hideDisabled && !x.product.disabled || x.product.disabled.start <= x.product.disabled.end))
  ), [catalog.products, hideDisabled])

  const getDetailPanelHeight = useCallback(({ row }) => getProductsInCategory(row.category._id).length ? ((Object.hasOwn(panelsExpandedSize, row.category._id) ? panelsExpandedSize[row.category._id] : 0) + 41 + (getProductsInCategory(row.category._id).length * 36)) : 0, [getProductsInCategory, panelsExpandedSize]);

  const getDetailPanelContent = useCallback(({ row }) => getProductsInCategory(row.category._id).length ? (
    <ProductTableContainer
      products={getProductsInCategory(row.category._id)}
      catalog={catalog}
      setProductToEdit={setProductToEdit}
      setIsProductEditOpen={setIsProductEditOpen}
      setIsProductCopyOpen={setIsProductCopyOpen}
      setIsProductDeleteOpen={setIsProductDeleteOpen}
      setIsProductDisableOpen={setIsProductDisableOpen}
      setIsProductDisableUntilEodOpen={setIsProductDisableUntilEodOpen}
      setIsProductEnableOpen={setIsProductEnableOpen}
      setIsProductInstanceAddOpen={setIsProductInstanceAddOpen}
      setIsProductInstanceEditOpen={setIsProductInstanceEditOpen}
      setIsProductInstanceDeleteOpen={setIsProductInstanceDeleteOpen}
      setProductInstanceToEdit={setProductInstanceToEdit}
      setPanelsExpandedSize={setPanelsExpandedSizeForRow(row.category._id)}
    />) : "",
    [catalog, getProductsInCategory, setProductToEdit, setIsProductEditOpen, setIsProductCopyOpen, setIsProductDeleteOpen, setIsProductDisableOpen, setIsProductDisableUntilEodOpen, setIsProductEnableOpen, setIsProductInstanceAddOpen, setIsProductInstanceEditOpen, setIsProductInstanceDeleteOpen, setProductInstanceToEdit, setPanelsExpandedSizeForRow]);

  const DeriveTreePath = useCallback(
    (row) => row.category.parent_id ? [...DeriveTreePath(catalog.categories[row.category.parent_id]), row.category.name] : [row.category.name],
    [catalog.categories]);

  const editCategory = (row) => () => {
    setIsCategoryEditOpen(true);
    setCategoryToEdit(row.category);
  };

  const deleteCategory = (row) => () => {
    setIsCategoryDeleteOpen(true);
    setCategoryToEdit(row.category);
  };

  return (
    <TableWrapperComponent
      title="Catalog Tree View"
      apiRef={apiRef}
      treeData
      getTreeDataPath={(row) => DeriveTreePath(row)}
      columns={[{
          ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
          type: "string", // this shouldn't be needed
          renderCell: (params) => getProductsInCategory(params.id).length > 0 ? <GridDetailPanelToggleCell {...params} /> : <></>
        },
        {
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params) => [
            <GridActionsCellItem
              icon={<Tooltip title="Edit Category"><Edit /></Tooltip>}
              label="Edit Category"
              onClick={editCategory(params.row)}
              key={`EDIT${params.row._id}`}
            />,
            <GridActionsCellItem
              icon={<Tooltip title="Delete Category"><DeleteOutline /></Tooltip>}
              label="Delete Category"
              onClick={deleteCategory(params.row)}
              key={`DELETE${params.row._id}`}
            />
          ]
        },
        {
          field: GRID_TREE_DATA_GROUPING_FIELD,
          minWidth: 400,
          flex: 400
        },
        { headerName: "Ordinal", field: "ordinal", valueGetter: v => v.row.category.ordinal, defaultSort: "asc", width: 30 },
        { headerName: "Call Line Name", field: "category.display_flags.call_line_name", valueGetter: v => v.row.category.display_flags.call_line_name },
        { headerName: "Description", field: "category.description", valueGetter: v => v.row.category.description },
        { headerName: "Subheading", field: "category.subheading", valueGetter: v => v.row.category.subheading },
        { headerName: "Footer", field: "category.footer", valueGetter: v => v.row.category.footer },
      ]}
      toolbarActions={[
        {
          size: 3, 
          elt:
            <FormControlLabel
              sx={{ mr: 2 }}
              key="HIDE"
              control={
                <Switch
                  checked={hideDisabled}
                  onChange={e => setHideDisabled(e.target.checked)}
                  name="Hide Disabled"
                />
              }
              labelPlacement="end"
              label="Hide Disabled"
            />
        },
        {
          size: 1, 
          elt:
            <Tooltip key="ADDNEW" title="Add new..."><IconButton onClick={() => setIsCategoryInterstitialOpen(true)}><AddBox /></IconButton></Tooltip>
        }

      ]}
      rows={Object.values(catalog.categories)}
      getRowId={(row) => row.category._id}
      getDetailPanelContent={getDetailPanelContent}
      getDetailPanelHeight={getDetailPanelHeight}
      rowThreshold={0}
      onRowClick={(params,) => {
        // if there are children categories and this row's children are not expanded, then expand the children, 
        // otherwise if there are products in this category, toggle the detail panel, else collapse the children categories
        if (params.row.children.length && !apiRef.current.getCellParams(params.id, "ordinal").rowNode.childrenExpanded) {
          apiRef.current.setRowChildrenExpansion(params.id, true);
        } else if (getProductsInCategory(params.id).length) {
          apiRef.current.toggleDetailPanel(params.id);
        } else {
          apiRef.current.setRowChildrenExpansion(params.id, false);
        }
      }}
    />
  );
};

export default CategoryTableContainer;
