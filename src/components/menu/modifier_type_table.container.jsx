import React from "react";

import TableWrapperComponent from "../table_wrapper.component";
import ModifierOptionTableContainer from "./modifier_option_table.container";
import { AddBox, Edit } from "@material-ui/icons";

const ModifierTypeTableContainer = ({
  modifier_types_map,
  setIsModifierTypeEditOpen,
  setModifierTypeToEdit,
  setIsModifierInterstitialOpen,
  setIsModifierOptionAddOpen,
  setModifierOptionToEdit,
  setIsModifierOptionEditOpen
}) => {
  return (
    <TableWrapperComponent
      title="Modifier Types / Modifier Type Option"
      columns={[
        { title: "Name", field: "modifier_type.name" },
        { title: "Selection Type", field: "modifier_type.selection_type" },
        { title: "Ordinal", field: "modifier_type.ordinal" },
        { title: "EXID: Revel", field: "modifier_type.externalIDs.revelID" },
        { title: "EXID: Square", field: "modifier_type.externalIDs.squareID" },
      ]}
      options={{
        detailPanelType: "single",
        draggable: false,
        paging: false,
      }}
      actions={[
        {
          icon: AddBox,
          tooltip: "Add new...",
          onClick: (event, rowData) => {
            setIsModifierInterstitialOpen(true);
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
