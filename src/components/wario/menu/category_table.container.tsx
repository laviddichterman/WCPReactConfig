import React, { Dispatch, SetStateAction, useCallback, useState } from "react";

import { GridActionsCellItem } from "@mui/x-data-grid";
import { useGridApiRef, GRID_TREE_DATA_GROUPING_FIELD, GRID_DETAIL_PANEL_TOGGLE_COL_DEF, GridDetailPanelToggleCell } from "@mui/x-data-grid-pro";
import { AddBox, DeleteOutline, Edit } from "@mui/icons-material";
import { FormControlLabel, Tooltip, Switch, IconButton } from '@mui/material';
import { CatalogCategoryEntry, ICategory, IProduct, IProductInstance } from "@wcp/wcpshared";
import ProductTableContainer from "./product_table.container";
import TableWrapperComponent from "../table_wrapper.component";
import { useAppSelector } from "../../../hooks/useRedux";

export interface CategoryTableContainerProps {
  setCategoryToEdit: Dispatch<SetStateAction<ICategory>>;
  setProductToEdit: Dispatch<SetStateAction<IProduct>>;
  setProductInstanceToEdit: Dispatch<SetStateAction<IProductInstance>>;
  setIsCategoryInterstitialOpen: Dispatch<SetStateAction<boolean>>;
  setIsCategoryEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsCategoryDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductCopyOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductDisableOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductDisableUntilEodOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductEnableOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductInstanceAddOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductInstanceEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductInstanceDeleteOpen: Dispatch<SetStateAction<boolean>>;
}

const CategoryTableContainer = ({
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
} : CategoryTableContainerProps) => {
  const products = useAppSelector(s=>s.ws.catalog?.products ?? {});
  const categories = useAppSelector(s=>s.ws.catalog?.categories ?? {});

  const apiRef = useGridApiRef();

  const [panelsExpandedSize, setPanelsExpandedSize] = useState<Record<string, number>>({});
  const [hideDisabled, setHideDisabled] = useState(true);

  const setPanelsExpandedSizeForRow = useCallback((row : string) => (size : number) => {
    const obj = JSON.parse(JSON.stringify(panelsExpandedSize));
    obj[row] = size;
    setPanelsExpandedSize(obj)
  }, [panelsExpandedSize]);

  const getProductsInCategory = useCallback((category_id : string) => Object.values(products).filter((x) =>
    x.product.category_ids.includes(category_id) && 
    (!hideDisabled || 
      (hideDisabled && (!x.product.disabled || x.product.disabled.start <= x.product.disabled.end)))
  ), [products, hideDisabled])

  const getDetailPanelHeight = useCallback(({ row } : {row:CatalogCategoryEntry}) => 
    getProductsInCategory(row.category.id).length ? 
      ((Object.hasOwn(panelsExpandedSize, row.category.id) ? panelsExpandedSize[row.category.id] : 0) + 
      41 + 
      (getProductsInCategory(row.category.id).length * 36)) : 0, [getProductsInCategory, panelsExpandedSize]);

  const getDetailPanelContent = useCallback(({ row }: {row:CatalogCategoryEntry}) => getProductsInCategory(row.category.id).length ? (
    <ProductTableContainer
      products={getProductsInCategory(row.category.id)}
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
      setPanelsExpandedSize={setPanelsExpandedSizeForRow(row.category.id)}
    />) : "",
    [getProductsInCategory, 
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
      setPanelsExpandedSizeForRow]);

  const DeriveTreePath : (row: CatalogCategoryEntry) => string[] = useCallback((row) => 
    row.category.parent_id !== null ? 
      [...DeriveTreePath(categories[row.category.parent_id]), row.category.name] : 
      [row.category.name],
    [categories]);

  const editCategory = (row : CatalogCategoryEntry) => () => {
    setIsCategoryEditOpen(true);
    setCategoryToEdit(row.category);
  };

  const deleteCategory = (row : CatalogCategoryEntry) => () => {
    setIsCategoryDeleteOpen(true);
    setCategoryToEdit(row.category);
  };

  return (
    <TableWrapperComponent
      title="Catalog Tree View"
      apiRef={apiRef}
      treeData
      getTreeDataPath={(row : CatalogCategoryEntry) => DeriveTreePath(row)}
      columns={[{
        ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
        type: "string",
        renderCell: (params) => getProductsInCategory(params.id as string).length > 0 ? <GridDetailPanelToggleCell {...params} /> : <></>
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
            key={`EDIT${params.row._id}`} />,
          <GridActionsCellItem
            icon={<Tooltip title="Delete Category"><DeleteOutline /></Tooltip>}
            label="Delete Category"
            onClick={deleteCategory(params.row)}
            key={`DELETE${params.row._id}`} />
        ]
      },
      {
        field: GRID_TREE_DATA_GROUPING_FIELD,
        minWidth: 400,
        flex: 400
      },
      { headerName: "Ordinal", field: "ordinal", valueGetter: (v: { row: CatalogCategoryEntry }) => v.row.category.ordinal, width: 30 },
      { headerName: "Call Line Name", field: "category.display_flags.call_line_name", valueGetter: (v: { row: CatalogCategoryEntry }) => v.row.category.display_flags.call_line_name },
      { headerName: "Description", field: "category.description", valueGetter: (v: { row: CatalogCategoryEntry }) => v.row.category.description },
      { headerName: "Subheading", field: "category.subheading", valueGetter: (v: { row: CatalogCategoryEntry }) => v.row.category.subheading },
      { headerName: "Footnotes", field: "category.footnotes", valueGetter: (v: { row: CatalogCategoryEntry }) => v.row.category.footnotes },
      ]}
      toolbarActions={[
        {
          size: 3,
          elt: <FormControlLabel
            sx={{ mr: 2 }}
            key="HIDE"
            control={<Switch
              checked={hideDisabled}
              onChange={e => setHideDisabled(e.target.checked)}
              name="Hide Disabled" />}
            labelPlacement="end"
            label="Hide Disabled" />
        },
        {
          size: 1,
          elt: <Tooltip key="AddNew" title="Add new..."><IconButton onClick={() => setIsCategoryInterstitialOpen(true)}><AddBox /></IconButton></Tooltip>
        }
      ]}
      rows={Object.values(categories)}
      getRowId={(row : {
        category: ICategory;
        children: string[];
        products: string[];
    }) => row.category.id}
      getDetailPanelContent={getDetailPanelContent}
      getDetailPanelHeight={getDetailPanelHeight}
      rowThreshold={0}
      onRowClick={(params) => {
        // if there are children categories and this row's children are not expanded, then expand the children, 
        // otherwise if there are products in this category, toggle the detail panel, else collapse the children categories
        if (params.row.children.length && !apiRef.current.getCellParams(params.id, "ordinal").rowNode.childrenExpanded) {
          apiRef.current.setRowChildrenExpansion(params.id, true);
        } else if (getProductsInCategory(params.id as string).length) {
          apiRef.current.toggleDetailPanel(params.id);
        } else {
          apiRef.current.setRowChildrenExpansion(params.id, false);
        }
      } } 
      disableToolbar={false}    
    />
  );
};

export default CategoryTableContainer;
