import { useCallback, useState } from "react";

import { GridActionsCellItem, GridRenderCellParams, GridRowParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useGridApiRef, GRID_TREE_DATA_GROUPING_FIELD, GRID_DETAIL_PANEL_TOGGLE_COL_DEF, GridDetailPanelToggleCell } from "@mui/x-data-grid-pro";
import { AddBox, DeleteOutline, Edit } from "@mui/icons-material";
import { FormControlLabel, Tooltip, Switch, IconButton } from '@mui/material';
import { CatalogCategoryEntry, ICategory } from "@wcp/wcpshared";
import ProductTableContainer from "../product/product_table.container";
import TableWrapperComponent from "../../table_wrapper.component";
import { useAppSelector } from "../../../../hooks/useRedux";
import { DialogContainer } from "@wcp/wario-ux-shared";
import CategoryEditContainer from "./category.edit.container";
import CategoryDeleteContainer from "./category.delete.container";
import InterstitialDialog from "../../interstitial.dialog.component";
import CategoryAddContainer from "./category.add.container";
import ProductAddContainer from "../product/product.add.container";
import ProductImportContainer from "../product/product.import.container";


type ValueGetterRow = GridValueGetterParams<any, CatalogCategoryEntry>;

const CategoryTableContainer = () => {
  const products = useAppSelector(s => s.ws.catalog?.products ?? {});
  const categories = useAppSelector(s => s.ws.catalog?.categories ?? {});

  const apiRef = useGridApiRef();

  const [panelsExpandedSize, setPanelsExpandedSize] = useState<Record<string, number>>({});
  const [hideDisabled, setHideDisabled] = useState(true);

  const [isCategoryInterstitialOpen, setIsCategoryInterstitialOpen] = useState(false);
  const [isCategoryAddOpen, setIsCategoryAddOpen] = useState(false);
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false);
  const [isCategoryDeleteOpen, setIsCategoryDeleteOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);

  const [isProductAddOpen, setIsProductAddOpen] = useState(false);
  const [isProductImportOpen, setIsProductImportOpen] = useState(false);

  const setPanelsExpandedSizeForRow = useCallback((row: string) => (size: number) => {
    setPanelsExpandedSize({ ...panelsExpandedSize, [row]: size });
  }, [panelsExpandedSize]);

  const getProductsInCategory = useCallback((categoryId: string) => Object.values(products).filter((x) =>
    x.product.category_ids.includes(categoryId) &&
    (!hideDisabled ||
      (hideDisabled && (!x.product.disabled || x.product.disabled.start <= x.product.disabled.end)))
  ), [products, hideDisabled])

  const getDetailPanelHeight = useCallback(({ row }: { row: CatalogCategoryEntry }) =>
    getProductsInCategory(row.category.id).length ?
      ((Object.hasOwn(panelsExpandedSize, row.category.id) ? panelsExpandedSize[row.category.id] : 0) +
        41 +
        (getProductsInCategory(row.category.id).length * 36)) : 0, [getProductsInCategory, panelsExpandedSize]);

  const getDetailPanelContent = useCallback(({ row }: { row: CatalogCategoryEntry }) => getProductsInCategory(row.category.id).length ? (
    <ProductTableContainer
      products={getProductsInCategory(row.category.id)}
      setPanelsExpandedSize={setPanelsExpandedSizeForRow(row.category.id)}
    />) : "",
    [getProductsInCategory,
      setPanelsExpandedSizeForRow]);

  const DeriveTreePath: (row: CatalogCategoryEntry) => string[] = useCallback((row) =>
    row.category.parent_id !== null ?
      [...DeriveTreePath(categories[row.category.parent_id]), row.category.name] :
      [row.category.name],
    [categories]);

  const editCategory = (row: CatalogCategoryEntry) => () => {
    setIsCategoryEditOpen(true);
    setCategoryToEdit(row.category);
  };

  const deleteCategory = (row: CatalogCategoryEntry) => () => {
    setIsCategoryDeleteOpen(true);
    setCategoryToEdit(row.category);
  };

  return (
    <>
    <InterstitialDialog
            dialogTitle={"Add new..."}
            options={[
              {
                title: "Add Category",
                cb: () => {
                  setIsCategoryAddOpen(true);
                },
                open: isCategoryAddOpen,
                onClose: () => setIsCategoryAddOpen(false),
                component: (
                  <CategoryAddContainer
                    onCloseCallback={() => {
                      setIsCategoryAddOpen(false);
                    }}
                  />
                ),
              },
              {
                title: "Add Product",
                cb: () => setIsProductAddOpen(true),
                open: isProductAddOpen,
                onClose: () => setIsProductAddOpen(false),
                component: (
                  <ProductAddContainer
                    onCloseCallback={() => {
                      setIsProductAddOpen(false);
                    }}
                  />
                ),
              },
              {
                title: "Import Products",
                cb: () => setIsProductImportOpen(true),
                open: isProductImportOpen,
                onClose: () => setIsProductImportOpen(false),
                component: (
                  <ProductImportContainer
                    onCloseCallback={() => {
                      setIsProductImportOpen(false);
                    }}
                  />
                ),
              },
            ]}
            onClose={() => setIsCategoryInterstitialOpen(false)}
            open={isCategoryInterstitialOpen}
          />
      <DialogContainer
        title={"Edit Category"}
        onClose={() => setIsCategoryEditOpen(false)}
        open={isCategoryEditOpen}
        innerComponent={
          categoryToEdit !== null &&
          <CategoryEditContainer
            onCloseCallback={() => setIsCategoryEditOpen(false)}
            category={categoryToEdit}
          />
        }
      />
      <DialogContainer
        title={"Delete Category"}
        onClose={() => setIsCategoryDeleteOpen(false)}
        open={isCategoryDeleteOpen}
        innerComponent={
          categoryToEdit !== null &&
          <CategoryDeleteContainer
            onCloseCallback={() => setIsCategoryDeleteOpen(false)}
            category={categoryToEdit}
          />
        }
      />
      <TableWrapperComponent
        sx={{ minWidth: '750px' }}
        title="Catalog Tree View"
        apiRef={apiRef}
        treeData
        getTreeDataPath={(row: CatalogCategoryEntry) => DeriveTreePath(row)}
        columns={[{
          ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
          type: "string",
          renderCell: (params: GridRenderCellParams<CatalogCategoryEntry>) => getProductsInCategory(params.id as string).length > 0 ? <GridDetailPanelToggleCell {...params} /> : <></>
        },
        {
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params: GridRowParams<CatalogCategoryEntry>) => [
            <GridActionsCellItem
              icon={<Tooltip title="Edit Category"><Edit /></Tooltip>}
              label="Edit Category"
              onClick={editCategory(params.row)}
              key={`EDIT${params.id}`} />,
            <GridActionsCellItem
              icon={<Tooltip title="Delete Category"><DeleteOutline /></Tooltip>}
              label="Delete Category"
              onClick={deleteCategory(params.row)}
              key={`DELETE${params.id}`} />
          ]
        },
        {
          field: GRID_TREE_DATA_GROUPING_FIELD,
          flex: 40
        },
        { headerName: "Ordinal", field: "ordinal", valueGetter: (v: ValueGetterRow) => v.row.category.ordinal, flex: 3 },
        { headerName: "Call Line Name", field: "category.display_flags.call_line_name", valueGetter: (v: ValueGetterRow) => v.row.category.display_flags.call_line_name, flex: 3 },
        { headerName: "Description", field: "category.description", valueGetter: (v: ValueGetterRow) => v.row.category.description, flex: 3 },
        { headerName: "Subheading", field: "category.subheading", valueGetter: (v: ValueGetterRow) => v.row.category.subheading, flex: 3 },
        { headerName: "Footnotes", field: "category.footnotes", valueGetter: (v: ValueGetterRow) => v.row.category.footnotes, flex: 3 },
        ]}
        toolbarActions={[
          {
            size: 5,
            elt: <FormControlLabel
              sx={{ mx: 2 }}
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
        getRowId={(row: CatalogCategoryEntry) => row.category.id}
        getDetailPanelContent={getDetailPanelContent}
        getDetailPanelHeight={getDetailPanelHeight}
        rowThreshold={0}
        onRowClick={(params: GridRowParams<CatalogCategoryEntry>) => {
          // if there are children categories and this row's children are not expanded, then expand the children, 
          // otherwise if there are products in this category, toggle the detail panel, else collapse the children categories
          if (params.row.children.length && !apiRef.current.getCellParams(params.id, "ordinal").rowNode.childrenExpanded) {
            apiRef.current.setRowChildrenExpansion(params.id, true);
          } else if (getProductsInCategory(params.id as string).length) {
            apiRef.current.toggleDetailPanel(params.id);
          } else {
            apiRef.current.setRowChildrenExpansion(params.id, false);
          }
        }}
        disableToolbar={false}
      />
    </>
  );
};

export default CategoryTableContainer;
