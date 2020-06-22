import React from "react";

import TableWrapperComponent from "../table_wrapper.component";
import ModifierOptionTableContainer from "./modifier_option_table.container";
import { AddBox, Edit } from "@material-ui/icons";

const ModifierTypeTableContainer = ({
  option_types,
  modifier_types_map,
  setIsModifierTypeEditOpen,
  setModifierTypeToEdit,
  setIsModifierInterstitialOpen,
  setModifierOptionToEdit,
  setIsModifierOptionEditOpen
}) => {
  return (
    <TableWrapperComponent
      title="Modifier Types / Modifier Type Option"
      columns={[
        { title: "Name", field: "name" },
        { title: "Selection Type", field: "selection_type" },
        { title: "Ordinal", field: "ordinal" },
        { title: "EXID: Revel", field: "externalIDs.revelID" },
        { title: "EXID: Square", field: "externalIDs.squareID" },
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
          icon: Edit,
          tooltip: "Edit Modifier Type",
          onClick: (event, rowData) => {
            setIsModifierTypeEditOpen(true);
            setModifierTypeToEdit(rowData);
          },
        },
      ]}
      data={option_types}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
      detailPanel={[
        {
          render: (rowData) => {
            return modifier_types_map[rowData._id].options.length ? (
              <ModifierOptionTableContainer
                modifier_type={rowData}
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
