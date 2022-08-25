import { Dispatch, SetStateAction, useCallback } from "react";

import { AddBox, Edit, DeleteOutline } from "@mui/icons-material";
import { GridActionsCellItem, GridRowParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid-pro";
import { Tooltip, IconButton } from '@mui/material';
import ModifierOptionTableContainer from "./modifier_option_table.container";
import TableWrapperComponent from "../table_wrapper.component";
import { IOption, IOptionType, CatalogModifierEntry } from "@wcp/wcpshared";
import { useAppSelector } from "../../../hooks/useRedux";

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

const ModifierTypeTableContainer = ({
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
}: ModifierTypeTableContainerProps) => {
  const modifiers = useAppSelector(s => s.ws.catalog?.modifiers ?? {});
  const apiRef = useGridApiRef();

  const editModifierType = (id: string) => () => {
    setIsModifierTypeEditOpen(true);
    setModifierTypeToEdit(modifiers[id].modifierType);
  };

  const addModifierOption = (id: string) => () => {
    setIsModifierOptionAddOpen(true);
    setModifierTypeToEdit(modifiers[id].modifierType);
  };

  const deleteModifierType = (id: string) => () => {
    setIsModifierTypeDeleteOpen(true);
    setModifierTypeToEdit(modifiers[id].modifierType);
  };

  const getDetailPanelHeight = useCallback(({ row }: { row: CatalogModifierEntry }) => row.options.length ? (41 + (row.options.length * 36)) : 0, []);

  const getDetailPanelContent = useCallback(({ row }: { row: CatalogModifierEntry }) => row.options.length ? (
    <ModifierOptionTableContainer
      modifierType={row.modifierType}
      setModifierOptionToEdit={setModifierOptionToEdit}
      setIsModifierOptionEditOpen={setIsModifierOptionEditOpen}
      setIsModifierOptionDeleteOpen={setIsModifierOptionDeleteOpen}
      setIsModifierOptionEnableOpen={setIsModifierOptionEnableOpen}
      setIsModifierOptionDisableOpen={setIsModifierOptionDisableOpen}
      setIsModifierOptionDisableUntilEodOpen={setIsModifierOptionDisableUntilEodOpen}
    />
  ) : (
    ""
  ), [setModifierOptionToEdit, setIsModifierOptionEditOpen, setIsModifierOptionDeleteOpen, setIsModifierOptionEnableOpen, setIsModifierOptionDisableOpen, setIsModifierOptionDisableUntilEodOpen]);

  return (
    <TableWrapperComponent
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
              onClick={editModifierType(params.id as string)}
              key="EDITMT" />,
            <GridActionsCellItem
              icon={<Tooltip title="Add Modifier Option"><AddBox /></Tooltip>}
              label="Add Modifier Option"
              onClick={addModifierOption(params.id as string)}
              showInMenu
              key="ADDMO" />,
            <GridActionsCellItem
              icon={<Tooltip title="Delete Modifier Type"><DeleteOutline /></Tooltip>}
              label="Delete Modifier Type"
              onClick={deleteModifierType(params.id as string)}
              showInMenu
              key="DELMT" />
          ]
        },
        { headerName: "Name", field: "modifierType.name", valueGetter: (v: ValueGetterRow) => v.row.modifierType.name, flex: 1 },
        { headerName: "Ordinal", field: "ordinal", valueGetter: (v: ValueGetterRow) => v.row.modifierType.ordinal },
        { headerName: "Min Selected", field: "min_selected", valueGetter: (v: ValueGetterRow) => v.row.modifierType.min_selected, },
        { headerName: "Max Selected", field: "max_selected", valueGetter: (v: ValueGetterRow) => v.row.modifierType.max_selected },
        { headerName: "Display Name", field: "display_name", valueGetter: (v: ValueGetterRow) => v.row.modifierType.displayName },
      ]}
      toolbarActions={[{
        size: 1,
        elt: <Tooltip key="ADDNEW" title="Add Modifier Type"><IconButton onClick={() => setIsModifierTypeAddOpen(true)}><AddBox /></IconButton></Tooltip>
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
