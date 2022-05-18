import React, {useCallback} from "react";

import TableWrapperComponent from "../table_wrapper.component";
import ModifierOptionTableContainer from "./modifier_option_table.container";
import { AddBox, Edit, DeleteOutline } from "@mui/icons-material";
import {GridActionsCellItem}  from "@mui/x-data-grid";
import Tooltip from '@mui/material/Tooltip';

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
  //const apiRef = useGridApiContext();

  const editModifierType = (id) => () => {
    setIsModifierTypeEditOpen(true);
    setModifierTypeToEdit(modifier_types_map[id].modifier_type);
  };

  const addModifierOption = (id) => () => {
    setIsModifierOptionAddOpen(true);
    setModifierTypeToEdit(modifier_types_map[id].modifier_type);
  };

  const deleteModifierType = (id) => () => {
    setIsModifierTypeDeleteOpen(true);
    setModifierTypeToEdit(modifier_types_map[id].modifier_type);
  };

const getDetailPanelContent = useCallback(({ row }) => row.options.length ? (
  <ModifierOptionTableContainer
    modifier_type={row.modifier_type}
    modifier_types_map={modifier_types_map}
    setModifierOptionToEdit={setModifierOptionToEdit}
    setIsModifierOptionEditOpen={setIsModifierOptionEditOpen}
    setIsModifierOptionDeleteOpen={setIsModifierOptionDeleteOpen}
  />
) : (
  ""
), [modifier_types_map, setIsModifierOptionDeleteOpen, setIsModifierOptionEditOpen, setModifierOptionToEdit]);
    
  return (
    <TableWrapperComponent
      title="Modifier Types / Modifier Type Option"
      disableSelectionOnClick
      getRowId={(row) => row.modifier_type._id}
      columns={[
        {
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params) => [
            <GridActionsCellItem
              icon={<Tooltip title="Edit Modifier Type"><Edit/></Tooltip>}
              label="Edit Modifier Type"
              onClick={editModifierType(params.id)}
            />,
            <GridActionsCellItem
              icon={<Tooltip title="Add Modifier Option"><AddBox/></Tooltip>}
              label="Add Modifier Option"
              onClick={addModifierOption(params.id)}
              showInMenu
            />,
            <GridActionsCellItem
              icon={<Tooltip title="Delete Modifier Type"><DeleteOutline/></Tooltip>}
              label="Delete Modifier Type"
              onClick={deleteModifierType(params.id)}
              showInMenu
            />
          ]
        },
        { headerName: "Name", field: "modifier_type.name", valueGetter: v => v.row.modifier_type.name },
        { headerName: "Ordinal", field: "ordinal", valueGetter: v => v.row.modifier_type.ordinal,  defaultSort: "asc" },
        { headerName: "Min Selected", field: "min_selected", valueGetter: v => v.row.modifier_type.min_selected, },
        { headerName: "Max Selected", field: "max_selected", valueGetter: v => v.row.modifier_type.max_selected  },
        { headerName: "Display Name", field: "display_name", valueGetter: v => v.row.modifier_type.display_name},
      ]}
      actions={[
        {
          icon: AddBox,
          tooltip: "Add Modifier Type",
          onClick: (event, rowData) => {
            setIsModifierTypeAddOpen(true);
          },
          isFreeAction: true,
        }
      ]}
      rows={Object.values(modifier_types_map)}
      onRowClick={(row, event, details) => {console.log(row); /*apiRef.current.toggleDetailPanel(row)*/}}
      getDetailPanelContent={getDetailPanelContent}
    />
  );
};

export default ModifierTypeTableContainer;
