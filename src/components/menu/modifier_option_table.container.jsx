import React from "react";
import moment from 'moment';
import TableWrapperComponent from "../table_wrapper.component";
import { Edit, DeleteOutline } from "@mui/icons-material";

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
        { title: "Name", field: "item.display_name" },
        { title: "Price", field: "item.price.amount", render: rowData => `$${Number(rowData.item.price.amount / 100).toFixed(2)}` },
        { title: "Shortcode", field: "item.shortcode" },
        { title: "Description", field: "item.description" },
        { title: "Ordinal", field: "ordinal", defaultSort: "asc" },
        { title: "FFactor", field: "metadata.flavor_factor" },
        { title: "BFactor", field: "metadata.bake_factor" },
        { title: "Can Split?", field: "metadata.can_split" },
        { title: "EnableFxn", field: "enable_function.name" },
        { title: "Disabled", field: "item.disabled", render: rowData => rowData.item.disabled ? (rowData.item.disabled.start > rowData.item.disabled.end ? "True" : `${moment(rowData.item.disabled.start).format("MMMM DD, Y hh:mm A")} to  ${moment(rowData.item.disabled.end).format("MMMM DD, Y hh:mm A")}`) : "False" },
      ]}
      data={modifier_types_map[modifier_type._id].options}
    />
  );
};

export default ModifierOptionTableContainer;
