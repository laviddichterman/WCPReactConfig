import { useCallback, useState } from "react";

import { AddBox, Edit, DeleteOutline, LibraryAdd } from "@mui/icons-material";
import { GridActionsCellItem, GridRowParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid-pro";
import { Tooltip, IconButton } from '@mui/material';
import ModifierOptionTableContainer from "../modifier_option/modifier_option_table.container";
import TableWrapperComponent from "../../table_wrapper.component";
import { IOptionType, CatalogModifierEntry } from "@wcp/wcpshared";
import { useAppSelector } from "../../../../hooks/useRedux";
import { DialogContainer } from "@wcp/wario-ux-shared";
import ModifierOptionAddContainer from "../modifier_option/modifier_option.add.container";
import ModifierTypeAddContainer from "./modifier_type.add.container";
import ModifierTypeDeleteContainer from "./modifier_type.delete.container";
import ModifierTypeEditContainer from "./modifier_type.edit.container";
import ModifierTypeCopyContainer from "./modifier_type.copy.container";

type ValueGetterRow = GridValueGetterParams<any, CatalogModifierEntry>;

const ModifierTypeTableContainer = () => {
  const modifiers = useAppSelector(s => s.ws.catalog?.modifiers ?? {});
  const apiRef = useGridApiRef();

  const [isModifierTypeAddOpen, setIsModifierTypeAddOpen] = useState(false);
  const [isModifierTypeEditOpen, setIsModifierTypeEditOpen] = useState(false);
  const [isModifierTypeCopyOpen, setIsModifierTypeCopyOpen] = useState(false);
  const [isModifierTypeDeleteOpen, setIsModifierTypeDeleteOpen] = useState(false);
  const [isModifierOptionAddOpen, setIsModifierOptionAddOpen] = useState(false);
  const [modifierTypeToEdit, setModifierTypeToEdit] = useState<IOptionType | null>(null);

  const editModifierType = (id: string) => () => {
    setIsModifierTypeEditOpen(true);
    setModifierTypeToEdit(modifiers[id].modifierType);
  };

  const copyModifierType = (id: string) => () => {
    setIsModifierTypeCopyOpen(true);
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

  const getDetailPanelHeight = useCallback((p: GridRowParams<CatalogModifierEntry>) => p.row.options.length ? (41 + (p.row.options.length * 36)) : 0, []);

  const getDetailPanelContent = useCallback((p: GridRowParams<CatalogModifierEntry>) => p.row.options.length ? (
    <ModifierOptionTableContainer
      modifierType={p.row.modifierType}
    />
  ) : '', []);

  return (<>
    <DialogContainer
      maxWidth={"xl"}
      title={`Add Modifier Option for Type: ${modifierTypeToEdit?.name ?? ""}`}
      onClose={() => setIsModifierOptionAddOpen(false)}
      open={isModifierOptionAddOpen}
      innerComponent={
        modifierTypeToEdit !== null &&
        <ModifierOptionAddContainer
          onCloseCallback={() => setIsModifierOptionAddOpen(false)}
          modifierType={modifierTypeToEdit}
        />
      }
    />
    <DialogContainer
      title={"Add Modifier Type"}
      onClose={() => setIsModifierTypeAddOpen(false)}
      open={isModifierTypeAddOpen}
      innerComponent={
        <ModifierTypeAddContainer
          onCloseCallback={() => setIsModifierTypeAddOpen(false)}
        />
      }
    />
    <DialogContainer
      title={"Edit Modifier Type"}
      onClose={() => setIsModifierTypeEditOpen(false)}
      open={isModifierTypeEditOpen}
      innerComponent={
        modifierTypeToEdit !== null &&
        <ModifierTypeEditContainer
          onCloseCallback={() => setIsModifierTypeEditOpen(false)}
          modifier_type={modifierTypeToEdit}
        />
      }
    />
    <DialogContainer
      title={"Copy Modifier Type"}
      maxWidth={"xl"}
      onClose={() => setIsModifierTypeCopyOpen(false)}
      open={isModifierTypeCopyOpen}
      innerComponent={
        modifierTypeToEdit !== null &&
        <ModifierTypeCopyContainer
          onCloseCallback={() => setIsModifierTypeCopyOpen(false)}
          modifierType={modifierTypeToEdit}
        />
      }
    />
    <DialogContainer
      title={"Delete Modifier Type"}
      onClose={() => setIsModifierTypeDeleteOpen(false)}
      open={isModifierTypeDeleteOpen}
      innerComponent={
        modifierTypeToEdit !== null &&
        <ModifierTypeDeleteContainer
          onCloseCallback={() => setIsModifierTypeDeleteOpen(false)}
          modifier_type={modifierTypeToEdit}
        />
      }
    />

    <TableWrapperComponent
      sx={{ minWidth: '750px' }}
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
              placeholder
              icon={<Tooltip title="Edit Modifier Type"><Edit /></Tooltip>}
              label="Edit Modifier Type"
              onClick={editModifierType(params.id.toString())}
              key="EDITMT" />,
            <GridActionsCellItem
              placeholder
              icon={<Tooltip title="Add Modifier Option"><AddBox /></Tooltip>}
              label="Add Modifier Option"
              onClick={addModifierOption(params.id.toString())}
              showInMenu
              key="ADDMO" />,
            <GridActionsCellItem
              placeholder
              icon={<Tooltip title="Copy Modifier Type"><LibraryAdd /></Tooltip>}
              label="Copy Modifier Type"
              onClick={copyModifierType(params.id.toString())}
              showInMenu
              key="COPYMT" />,
            <GridActionsCellItem
              placeholder
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
        { headerName: "Min/Max Selected", sortable: false, hideable: false, field: "min_max", valueGetter: (v: ValueGetterRow) => `${v.row.modifierType.min_selected}/${v.row.modifierType.max_selected ?? ""}`, flex: 2 },
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
  </>
  );
};

export default ModifierTypeTableContainer;
