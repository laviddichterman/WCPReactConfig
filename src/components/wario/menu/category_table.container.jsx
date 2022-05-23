import React, {useCallback} from "react";

import {GridActionsCellItem}  from "@mui/x-data-grid";
import {useGridApiRef} from "@mui/x-data-grid-pro";
import { AddBox, DeleteOutline, Edit } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
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
  setIsProductImportOpen,
  setIsProductInstanceAddOpen,
  setIsProductInstanceEditOpen,
  setIsProductInstanceDeleteOpen,
  setProductInstanceToEdit
}) => {
  const apiRef = useGridApiRef();

  const getDetailPanelContent = useCallback(({ row }) => catalog.categories[row.category._id].products.length ? (
    <ProductTableContainer
      products={Object.values(catalog.products).filter((x) =>
        x.product.category_ids.includes(row.category._id)
      )}
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
      
       />) : "", [catalog, setIsProductCopyOpen, setIsProductDeleteOpen, setIsProductDisableOpen, setIsProductDisableUntilEodOpen, setIsProductEditOpen, setIsProductEnableOpen, setIsProductInstanceAddOpen, setIsProductInstanceDeleteOpen, setIsProductInstanceEditOpen, setProductInstanceToEdit, setProductToEdit]);
  
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
      columns={[
        {
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params) => [
            <GridActionsCellItem
              icon={<Tooltip title="Edit Category"><Edit/></Tooltip>}
              label="Edit Category"
              onClick={editCategory(params.row)}
            />,
            <GridActionsCellItem
              icon={<Tooltip title="Delete Category"><DeleteOutline/></Tooltip>}
              label="Delete Category"
              onClick={deleteCategory(params.row)}
            />
          ]
        },
        { headerName: "Ordinal", field: "ordinal", valueGetter: v => v.row.category.ordinal, defaultSort: "asc"},
        { headerName: "Call Line Name", field: "category.display_flags.call_line_name", valueGetter: v => v.row.category.display_flags.call_line_name},
        { headerName: "Description", field: "category.description", valueGetter: v => v.row.category.description, },
        { headerName: "Subheading", field: "category.ordinal", valueGetter: v => v.row.category.subheading, },
      ]}
      actions={[
        {
          icon: AddBox,
          tooltip: 'Add new...',
          onClick: () => {
            setIsCategoryInterstitialOpen(true);
          },
          isFreeAction: true
        }
      ]}
      rows={Object.values(catalog.categories)}
      getRowId={(row) => row.category._id}
      getDetailPanelContent={getDetailPanelContent}
      onRowClick={(params, ) => {
        // if there are children categories and this row's children are not expanded, then expand the children, 
        // otherwise if there are products in this category, toggle the detail panel, else collapse the children categories
        if (params.row.children.length && !apiRef.current.getCellParams(params.id, "ordinal").rowNode.childrenExpanded) {
          apiRef.current.setRowChildrenExpansion(params.id, true);
        } else if (catalog.categories[params.id].products.length) {
          apiRef.current.toggleDetailPanel(params.id);
        } else {
          apiRef.current.setRowChildrenExpansion(params.id, false);
        }
      }}
    />
  );
};

export default CategoryTableContainer;
