import { Dispatch, SetStateAction, useCallback } from "react";

import { AddBox, Edit, DeleteOutline } from "@mui/icons-material";
import { GridActionsCellItem, GridRowParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid-pro";
import { Tooltip, IconButton } from '@mui/material';
import ModifierOptionTableContainer from "../modifier_option/modifier_option_table.container";
import TableWrapperComponent from "../../table_wrapper.component";
import { IOption, IOptionType, CatalogModifierEntry } from "@wcp/wcpshared";
import { useAppSelector } from "../../../../hooks/useRedux";

type ValueGetterRow = GridValueGetterParams<any, CatalogModifierEntry>;

export interface ModifierTypeTableContainerProps {
  setIsModifierTypeEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsModifierTypeDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setModifierTypeToEdit: Dispatch<SetStateAction<IOptionType>>;
  setIsModifierTypeAddOpen: Dispatch<SetStateAction<boolean>>;
  setModifierOptionToEdit: Dispatch<SetStateAction<IOption>>;
  setIsModifierOptionAddOpen: Dispatch<SetStateAction<boolean>>;
  setIsModifierOptionDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setIsModifierOptionEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsModifierOptionEnableOpen: Dispatch<SetStateAction<boolean>>;
  setIsModifierOptionDisableOpen: Dispatch<SetStateAction<boolean>>;
  setIsModifierOptionDisableUntilEodOpen: Dispatch<SetStateAction<boolean>>;
}

const ModifierTypeTableContainer = (props: ModifierTypeTableContainerProps) => {
  const modifiers = useAppSelector(s => s.ws.catalog?.modifiers ?? {});
  const apiRef = useGridApiRef();

  const editModifierType = (id: string) => () => {
    props.setIsModifierTypeEditOpen(true);
    props.setModifierTypeToEdit(modifiers[id].modifierType);
  };

  const addModifierOption = (id: string) => () => {
    props.setIsModifierOptionAddOpen(true);
    props.setModifierTypeToEdit(modifiers[id].modifierType);
  };

  const deleteModifierType = (id: string) => () => {
    props.setIsModifierTypeDeleteOpen(true);
    props.setModifierTypeToEdit(modifiers[id].modifierType);
  };

  const getDetailPanelHeight = useCallback((p : GridRowParams<CatalogModifierEntry>) => p.row.options.length ? (41 + (p.row.options.length * 36)) : 0, []);

  const getDetailPanelContent = useCallback((p : GridRowParams<CatalogModifierEntry>) => p.row.options.length ? (
    <ModifierOptionTableContainer
      {...props}
      modifierType={p.row.modifierType}
    />
  ) : (
    ""
  ), [props]);

  return (
    <TableWrapperComponent
      sx={{minWidth: '750px'}}
      title="Modifier Types & Options"
      apiRef={apiRef}
      getRowId={(row: CatalogModifierEntry) => row.modifierType.id}
      columns={[
        {
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params: GridRowParams<CatalogModifierEntry>) => [
            <GridActionsCellItem
              icon={<Tooltip title="Edit Modifier Type"><Edit /></Tooltip>}
              label="Edit Modifier Type"
              onClick={editModifierType(params.id.toString())}
              key="EDITMT" />,
            <GridActionsCellItem
              icon={<Tooltip title="Add Modifier Option"><AddBox /></Tooltip>}
              label="Add Modifier Option"
              onClick={addModifierOption(params.id.toString())}
              showInMenu
              key="ADDMO" />,
            <GridActionsCellItem
              icon={<Tooltip title="Delete Modifier Type"><DeleteOutline /></Tooltip>}
              label="Delete Modifier Type"
              onClick={deleteModifierType(params.id.toString())}
              showInMenu
              key="DELMT" />
          ]
        },
        { headerName: "Name", sortable: false, field: "Modifier Name", valueGetter: (v: ValueGetterRow) => v.row.modifierType.name, flex: 10 },
        { headerName: "Display Name", field: "displayName", valueGetter: (v: ValueGetterRow) => v.row.modifierType.displayName, flex: 3 },
        { headerName: "Ordinal", field: "ordinal", valueGetter: (v: ValueGetterRow) => v.row.modifierType.ordinal, flex: 1 },
        { headerName: "Min/Max Selected", sortable: false, hideable: false, field: "min_max", valueGetter: (v: ValueGetterRow) => `${v.row.modifierType.min_selected}/${v.row.modifierType.max_selected ?? "" }`, flex: 2 },
      ]}
      toolbarActions={[{
        size: 1,
        elt: <Tooltip key="ADDNEW" title="Add Modifier Type"><IconButton onClick={() => props.setIsModifierTypeAddOpen(true)}><AddBox /></IconButton></Tooltip>
      }]}
      rows={Object.values(modifiers)}
      onRowClick={(params) => apiRef.current.toggleDetailPanel(params.id)}
      getDetailPanelContent={getDetailPanelContent}
      getDetailPanelHeight={getDetailPanelHeight}
      disableToolbar={false}
    />
  );
};

export default ModifierTypeTableContainer;
