import React from "react";

import TableWrapperComponent from "../table_wrapper.component";
import ModifierOptionTableContainer from "./modifier_option_table.container";
import { AddBox, Edit, DeleteOutline } from "@material-ui/icons";

const ModifierTypeTableContainer = ({
  modifier_types_map,
  setIsModifierTypeEditOpen,
  setIsModifierTypeDeleteOpen,
  setModifierTypeToEdit,
  setIsModifierTypeAddOpen,
  setIsModifierOptionAddOpen,
  setIsModifierOptionDeleteOpen,
  setModifierOptionToEdit,
  setIsModifierOptionEditOpen
}) => {
  return (
    <TableWrapperComponent
      title="Modifier Types / Modifier Type Option"
      columns={[
        { title: "Name", field: "modifier_type.name" },
        { title: "Ordinal", field: "modifier_type.ordinal", defaultSort: "asc" },
        { title: "Min Selected", field: "modifier_type.min_selected" },
        { title: "Max Selected", field: "modifier_type.max_selected" },
      ]}
      options={{
        detailPanelType: "single",
        draggable: false,
        paging: false,
      }}
      actions={[
        {
          icon: AddBox,
          tooltip: "Add Modifier Type",
          onClick: (event, rowData) => {
            setIsModifierTypeAddOpen(true);
          },
          isFreeAction: true,
        },
        {
          icon: AddBox,
          tooltip: "Add Modifier Option",
          onClick: (event, rowData) => {
            setIsModifierOptionAddOpen(true);
            setModifierTypeToEdit(rowData.modifier_type);
          },
        },
        {
          icon: Edit,
          tooltip: "Edit Modifier Type",
          onClick: (event, rowData) => {
            setIsModifierTypeEditOpen(true);
            setModifierTypeToEdit(rowData.modifier_type);
          },
        },
        {
          icon: DeleteOutline,
          tooltip: 'Delete Modifier Type',
          onClick: (event, rowData) => {
            setIsModifierTypeDeleteOpen(true);
            setModifierTypeToEdit(rowData.modifier_type);
          },
        }
      ]}
      data={Object.values(modifier_types_map)}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
      detailPanel={[
        {
          render: (rowData) => {
            return rowData.options.length ? (
              <ModifierOptionTableContainer
                modifier_type={rowData.modifier_type}
                modifier_types_map={modifier_types_map}
                setModifierOptionToEdit={setModifierOptionToEdit}
                setIsModifierOptionEditOpen={setIsModifierOptionEditOpen}
                setIsModifierOptionDeleteOpen={setIsModifierOptionDeleteOpen}
              />
            ) : (
              ""
            );
          },
          icon: () => {
            return null;
          },
        },
      ]}
    />
  );
};

export default ModifierTypeTableContainer;
