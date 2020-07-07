import React from "react";

import TableWrapperComponent from "../table_wrapper.component";
import { Edit, DeleteOutline } from "@material-ui/icons";

const ModifierOptionTableContainer = ({
  modifier_type,
  modifier_types_map,
  setModifierOptionToEdit,
  setIsModifierOptionEditOpen,
  setIsModifierOptionDeleteOpen
}) => {
  return (
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
        paging: false,
      }}
      actions={[
        {
          icon: Edit,
          tooltip: "Edit Modifier Option",
          onClick: (event, rowData) => {
            setIsModifierOptionEditOpen(true);
            setModifierOptionToEdit(rowData);
          },
        },
        {
          icon: DeleteOutline,
          tooltip: 'Delete Modifier Option',
          onClick: (event, rowData) => {
            setIsModifierOptionDeleteOpen(true);
            setModifierOptionToEdit(rowData);
          },
        }
      ]}
      columns={[
        { title: "Name", field: "catalog_item.display_name" },
        { title: "Price", field: "catalog_item.price.amount" },
        { title: "Shortcode", field: "catalog_item.shortcode" },
        { title: "Description", field: "catalog_item.description" },
        { title: "Ordinal", field: "ordinal" },
        { title: "FFactor", field: "metadata.flavor_factor" },
        { title: "BFactor", field: "metadata.bake_factor" },
        { title: "Can Split?", field: "metadata.can_split" },
        { title: "EnableFxn", field: "enable_function_name" },
        {
          title: "EXID: Revel",
          field: "catalog_item.externalIDs.revelID",
        },
        {
          title: "EXID: Square",
          field: "catalog_item.externalIDs.squareID",
        },
        { title: "Disabled", field: "catalog_item.disabled" },
      ]}
      data={modifier_types_map[modifier_type._id].options}
    />
  );
};

export default ModifierOptionTableContainer;
