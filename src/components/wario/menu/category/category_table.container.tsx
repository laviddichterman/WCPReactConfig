import { useCallback, useMemo, useState } from "react";

import { GridActionsCellItem, GridRenderCellParams, GridRowParams, GridValueGetterParams } from "@mui/x-data-grid-premium";
import { useGridApiRef, GRID_TREE_DATA_GROUPING_FIELD, GRID_DETAIL_PANEL_TOGGLE_COL_DEF, GridDetailPanelToggleCell } from "@mui/x-data-grid-premium";
import { AddBox, DeleteOutline, Edit } from "@mui/icons-material";
import { FormControlLabel, Tooltip, Switch, IconButton } from '@mui/material';
import { CatalogCategoryEntry } from "@wcp/wcpshared";
import ProductTableContainer from "../product/product_table.container";
import TableWrapperComponent from "../../table_wrapper.component";
import { useAppDispatch, useAppSelector } from "../../../../hooks/useRedux";
import { openCategoryDelete, openCategoryEdit, openCategoryInterstitial, setEnableCategoryTreeView, setHideDisabled } from '../../../../redux/slices/CatalogSlice';


type ValueGetterRow = GridValueGetterParams<CatalogCategoryEntry>;

const CategoryTableContainer = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(s => s.ws.catalog?.products ?? {});
  const categories = useAppSelector(s => s.ws.catalog?.categories ?? {});
  const hideDisabled = useAppSelector(s => s.catalog.hideDisabledProducts);
  const enableCategoryTreeView = useAppSelector(s => s.catalog.enableCategoryTreeView);
  const apiRef = useGridApiRef();

  const [panelsExpandedSize, setPanelsExpandedSize] = useState<Record<string, number>>({});

  const toolbarActions = useMemo(() => [
    {
      size: 4,
      elt: <FormControlLabel
        sx={{ mx: 2 }}
        key="HIDE"
        control={<Switch
          checked={hideDisabled}
          onChange={e => dispatch(setHideDisabled(e.target.checked))}
          name="Hide Disabled" />}
        labelPlacement="end"
        label="Hide Disabled" />
    },
    {
      size: 4,
      elt: <FormControlLabel
        sx={{ mx: 2 }}
        key="TOGGLECAT"
        control={<Switch
          checked={enableCategoryTreeView}
          onChange={e => dispatch(setEnableCategoryTreeView(e.target.checked))}
          name="Category Tree View" />}
        labelPlacement="end"
        label="Category Tree View" />
    },
    {
      size: 1,
      elt: <Tooltip key="AddNew" title="Add new..."><IconButton onClick={() => dispatch(openCategoryInterstitial())}><AddBox /></IconButton></Tooltip>
    }
  ], [dispatch, enableCategoryTreeView, hideDisabled]);

  const setPanelsExpandedSizeForRow = useCallback((row: string) => (size: number) => {
    setPanelsExpandedSize({ ...panelsExpandedSize, [row]: size });
  }, [panelsExpandedSize]);

  const productsAfterDisableFilter = useMemo(() => !hideDisabled ? Object.values(products) : Object.values(products).filter((x) =>
    (!x.product.disabled || x.product.disabled.start <= x.product.disabled.end)),
    [products, hideDisabled]);

  const getProductsInCategory = useCallback((categoryId: string) => Object.values(productsAfterDisableFilter).filter((x) =>
    x.product.category_ids.includes(categoryId)), [productsAfterDisableFilter]);

  const getDetailPanelHeight = useCallback(({ row }: { row: CatalogCategoryEntry }) =>
    getProductsInCategory(row.category.id).length ?
      ((Object.hasOwn(panelsExpandedSize, row.category.id) ? panelsExpandedSize[row.category.id] : 0) +
        41 +
        (getProductsInCategory(row.category.id).length * 36)) : 0, [getProductsInCategory, panelsExpandedSize]);

  const onRowClick = useCallback((params: GridRowParams<CatalogCategoryEntry>) => {
    // if there are children categories and this row's children are not expanded, then expand the children, 
    // otherwise if there are products in this category, toggle the detail panel, else collapse the children categories
    const rowNode = apiRef.current.getRowNode(params.id);
    const isGroupNode = (rowNode && rowNode.type === 'group');
    console.log({rowNode});
    if (params.row.children.length && isGroupNode) {
      apiRef.current.setRowChildrenExpansion(params.id, !rowNode.childrenExpanded);
    } else if (getProductsInCategory(params.id as string).length) {
      apiRef.current.toggleDetailPanel(params.id);
    }
  }, [apiRef]);

  const getDetailPanelContent = useCallback(({ row }: { row: CatalogCategoryEntry }) => getProductsInCategory(row.category.id).length ? (
    <ProductTableContainer
      disableToolbar={true}
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

  return (enableCategoryTreeView ?
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
            onClick={() => dispatch(openCategoryEdit(params.row.category.id))}
            key={`EDIT${params.id}`} />,
          <GridActionsCellItem
            icon={<Tooltip title="Delete Category"><DeleteOutline /></Tooltip>}
            label="Delete Category"
            onClick={() => dispatch(openCategoryDelete(params.row.category.id))}
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
      toolbarActions={toolbarActions}
      rows={Object.values(categories)}
      getRowId={(row: CatalogCategoryEntry) => row.category.id}
      getDetailPanelContent={getDetailPanelContent}
      getDetailPanelHeight={getDetailPanelHeight}
      rowThreshold={0}
      onRowClick={onRowClick}
      disableToolbar={false}
    /> :
    <ProductTableContainer
      title="Product Table View"
      disableToolbar={false}
      pagination={true}
      toolbarActions={toolbarActions}
      products={productsAfterDisableFilter}
      setPanelsExpandedSize={() => (0)} // no need for the panels expanded size here... i don't think
    />

  );
};

export default CategoryTableContainer;
