import React, {useCallback} from "react";

import TableWrapperComponent from "../table_wrapper.component";
import {GridActionsCellItem}  from "@mui/x-data-grid";
import ProductTableContainer from "./product_table.container";
import { AddBox, DeleteOutline, Edit } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';

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
  setIsProductInstanceAddOpen,
  setIsProductInstanceEditOpen,
  setIsProductInstanceDeleteOpen,
  setProductInstanceToEdit
}) => {
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
      setIsProductInstanceAddOpen={setIsProductInstanceAddOpen}   
      setIsProductInstanceEditOpen={setIsProductInstanceEditOpen}   
      setIsProductInstanceDeleteOpen={setIsProductInstanceDeleteOpen}
      setProductInstanceToEdit={setProductInstanceToEdit}
      
       />) : "", [catalog, setIsProductCopyOpen, setIsProductDeleteOpen, setIsProductEditOpen, setIsProductInstanceAddOpen, setIsProductInstanceDeleteOpen, setIsProductInstanceEditOpen, setProductInstanceToEdit, setProductToEdit]);
  
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
          onClick: (event, rowData) => {
            setIsCategoryInterstitialOpen(true);
          },
          isFreeAction: true
        }
      ]}
      rows={Object.values(catalog.categories)}
      getRowId={(row) => row.category._id}
      getDetailPanelContent={getDetailPanelContent}
    />
  );
};

export default CategoryTableContainer;
