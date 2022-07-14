import React, {useCallback} from "react";

import { AddBox, Edit, DeleteOutline } from "@mui/icons-material";
import {GridActionsCellItem}  from "@mui/x-data-grid";
import {useGridApiRef} from "@mui/x-data-grid-pro";
import {Tooltip, IconButton} from '@mui/material';
import ModifierOptionTableContainer from "./modifier_option_table.container";
import TableWrapperComponent from "../table_wrapper.component";

const ModifierTypeTableContainer = ({
  modifier_types_map,
  setIsModifierTypeEditOpen,
  setIsModifierTypeDeleteOpen,
  setModifierTypeToEdit,
  setIsModifierTypeAddOpen,
  setModifierOptionToEdit,
  setIsModifierOptionAddOpen,
  setIsModifierOptionDeleteOpen,
  setIsModifierOptionEditOpen,
  setIsModifierOptionEnableOpen,
  setIsModifierOptionDisableOpen,
  setIsModifierOptionDisableUntilEodOpen
}) => {
  const apiRef = useGridApiRef();

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

  const getDetailPanelHeight = useCallback(({ row }) => row.options.length ? (41 + (row.options.length * 36)) : 0, []);

  const getDetailPanelContent = useCallback(({ row }) => row.options.length ? (
    <ModifierOptionTableContainer
      modifier_type={row.modifier_type}
      modifier_types_map={modifier_types_map}
      setModifierOptionToEdit={setModifierOptionToEdit}
      setIsModifierOptionEditOpen={setIsModifierOptionEditOpen}
      setIsModifierOptionDeleteOpen={setIsModifierOptionDeleteOpen}
      setIsModifierOptionEnableOpen={setIsModifierOptionEnableOpen}
      setIsModifierOptionDisableOpen={setIsModifierOptionDisableOpen}
      setIsModifierOptionDisableUntilEodOpen={setIsModifierOptionDisableUntilEodOpen}
    />
  ) : (
    ""
  ), [modifier_types_map, setIsModifierOptionDeleteOpen, setIsModifierOptionDisableOpen, setIsModifierOptionDisableUntilEodOpen, setIsModifierOptionEditOpen, setIsModifierOptionEnableOpen, setModifierOptionToEdit]);
      
  return (
    <TableWrapperComponent
      title="Modifier Types / Modifier Type Option"
      apiRef={apiRef}
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
              key="EDITMT"
            />,
            <GridActionsCellItem
              icon={<Tooltip title="Add Modifier Option"><AddBox/></Tooltip>}
              label="Add Modifier Option"
              onClick={addModifierOption(params.id)}
              showInMenu
              key="ADDMO"
            />,
            <GridActionsCellItem
              icon={<Tooltip title="Delete Modifier Type"><DeleteOutline/></Tooltip>}
              label="Delete Modifier Type"
              onClick={deleteModifierType(params.id)}
              showInMenu
              key="DELMT"
            />
          ]
        },
        { headerName: "Name", field: "modifier_type.name", valueGetter: v => v.row.modifier_type.name, flex: 1 },
        { headerName: "Ordinal", field: "ordinal", valueGetter: v => v.row.modifier_type.ordinal,  defaultSort: "asc" },
        { headerName: "Min Selected", field: "min_selected", valueGetter: v => v.row.modifier_type.min_selected, },
        { headerName: "Max Selected", field: "max_selected", valueGetter: v => v.row.modifier_type.max_selected  },
        { headerName: "Display Name", field: "display_name", valueGetter: v => v.row.modifier_type.display_name},
      ]}
      toolbarActions={[{
        size: 1, 
        elt:
          <Tooltip key="ADDNEW" title="Add Modifier Type"><IconButton onClick={() => setIsModifierTypeAddOpen(true)}><AddBox /></IconButton></Tooltip>
      }]}
      rows={Object.values(modifier_types_map)}
      onRowClick={(params, ) => apiRef.current.toggleDetailPanel(params.id)}
      getDetailPanelContent={getDetailPanelContent}
      getDetailPanelHeight={getDetailPanelHeight}
    />
  );
};

export default ModifierTypeTableContainer;
