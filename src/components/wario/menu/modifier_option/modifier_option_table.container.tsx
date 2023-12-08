import React, { useState } from "react";
import { format } from 'date-fns'
import { GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import { Edit, DeleteOutline, BedtimeOff, CheckCircle, Cancel } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import { DisableDataCheck, DISABLE_REASON, IOption, IOptionType } from '@wcp/wcpshared';
import TableWrapperComponent from "../../table_wrapper.component";
import { useAppSelector } from "../../../../hooks/useRedux";
import { DialogContainer } from "@wcp/wario-ux-shared";
import ModifierOptionDeleteContainer from "./modifier_option.delete.container";
import ModifierOptionDisableContainer from "./modifier_option.disable.container";
import ModifierOptionDisableUntilEodContainer from "./modifier_option.disable_until_eod.container";
import ModifierOptionEditContainer from "./modifier_option.edit.container";
import ModifierOptionEnableContainer from "./modifier_option.enable.container";

export interface ModifierOptionTableContainerProps {
  modifierType: IOptionType;
};

const ModifierOptionTableContainer = ({
  modifierType
}: ModifierOptionTableContainerProps) => {
  const modifier_types_map = useAppSelector(s => s.ws.catalog!.modifiers);
  const modifierOptionsMap = useAppSelector(s => s.ws.catalog!.options);
  const CURRENT_TIME = useAppSelector(s => s.ws.currentTime);
  const productInstanceFunctions = useAppSelector(s => s.ws.catalog!.productInstanceFunctions!);
  const [modifierOptionToEdit, setModifierOptionToEdit] = useState<IOption | null>(null);
  const [isModifierOptionEditOpen, setIsModifierOptionEditOpen] = useState(false);
  const [isModifierOptionDeleteOpen, setIsModifierOptionDeleteOpen] = useState(false);
  const [isModifierOptionEnableOpen, setIsModifierOptionEnableOpen] = useState(false);
  const [isModifierOptionDisableOpen, setIsModifierOptionDisableOpen] = useState(false);
  const [isModifierOptionDisableUntilEodOpen, setIsModifierOptionDisableUntilEodOpen] = useState(false);

  const editModifierOption = (row: IOption) => () => {
    setIsModifierOptionEditOpen(true);
    setModifierOptionToEdit(row);
  };

  const deleteModifierOption = (row: IOption) => () => {
    setIsModifierOptionDeleteOpen(true);
    setModifierOptionToEdit(row);
  };

  const disableOptionUntilEOD = (row: IOption) => () => {
    setIsModifierOptionDisableUntilEodOpen(true);
    setModifierOptionToEdit(row);
  };
  const disableOption = (row: IOption) => () => {
    setIsModifierOptionDisableOpen(true);
    setModifierOptionToEdit(row);
  };
  const enableOption = (row: IOption) => () => {
    setIsModifierOptionEnableOpen(true);
    setModifierOptionToEdit(row);
  };

  return (
    <>

      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Modifier Option"}
        onClose={() => setIsModifierOptionEditOpen(false)}
        open={isModifierOptionEditOpen}
        innerComponent={
          modifierOptionToEdit !== null &&
          <ModifierOptionEditContainer
            onCloseCallback={() => setIsModifierOptionEditOpen(false)}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        title={"Disable Modifier Option Until End-of-Day"}
        onClose={() => setIsModifierOptionDisableUntilEodOpen(false)}
        open={isModifierOptionDisableUntilEodOpen}
        innerComponent={
          modifierOptionToEdit !== null &&
          <ModifierOptionDisableUntilEodContainer
            onCloseCallback={() => setIsModifierOptionDisableUntilEodOpen(false)}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        title={"Disable Modifier Option"}
        onClose={() => setIsModifierOptionDisableOpen(false)}
        open={isModifierOptionDisableOpen}
        innerComponent={
          modifierOptionToEdit !== null &&
          <ModifierOptionDisableContainer
            onCloseCallback={() => setIsModifierOptionDisableOpen(false)}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        title={"Enable Modifier Option"}
        onClose={() => setIsModifierOptionEnableOpen(false)}
        open={isModifierOptionEnableOpen}
        innerComponent={
          modifierOptionToEdit !== null &&
          <ModifierOptionEnableContainer
            onCloseCallback={() => setIsModifierOptionEnableOpen(false)}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        title={"Delete Modifier Option"}
        onClose={() => setIsModifierOptionDeleteOpen(false)}
        open={isModifierOptionDeleteOpen}
        innerComponent={
          modifierOptionToEdit !== null &&
          <ModifierOptionDeleteContainer
            onCloseCallback={() => setIsModifierOptionDeleteOpen(false)}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <TableWrapperComponent
        disableToolbar
        autoHeight={false}
        rowThreshold={0}
        columns={[
          {
            headerName: "Actions",
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams<IOption>) => {
              const title = params.row.displayName ? params.row.displayName : "Modifier Option";
              const EDIT_MODIFIER_OPTION = (<GridActionsCellItem
                icon={<Tooltip title={`Edit ${title}`}><Edit /></Tooltip>}
                label={`Edit ${title}`}
                onClick={editModifierOption(params.row)}
              />);
              const DELETE_MODIFIER_OPTION = (<GridActionsCellItem
                icon={<Tooltip title={`Delete ${title}`}><DeleteOutline /></Tooltip>}
                label={`Delete ${title}`}
                onClick={deleteModifierOption(params.row)}
                showInMenu
              />);
              const ENABLE_MODIFIER_OPTION = (<GridActionsCellItem
                icon={<Tooltip title={`Enable ${title}`}><CheckCircle /></Tooltip>}
                label={`Enable ${title}`}
                onClick={enableOption(params.row)}
                showInMenu
              />);
              const DISABLE_MODIFIER_OPTION_UNTIL_EOD = (<GridActionsCellItem
                icon={<Tooltip title={`Disable ${title} Until End-of-Day`}><BedtimeOff /></Tooltip>}
                label={`Disable ${title} Until EOD`}
                onClick={disableOptionUntilEOD(params.row)}
                showInMenu
              />)
              const DISABLE_MODIFIER_OPTION = (<GridActionsCellItem
                icon={<Tooltip title={`Disable ${title}`}><Cancel /></Tooltip>}
                label={`Disable ${title}`}
                onClick={disableOption(params.row)}
                showInMenu
              />)
              return DisableDataCheck(params.row.disabled, params.row.availability, CURRENT_TIME).enable !== DISABLE_REASON.ENABLED ? [EDIT_MODIFIER_OPTION, ENABLE_MODIFIER_OPTION, DELETE_MODIFIER_OPTION] : [EDIT_MODIFIER_OPTION, DISABLE_MODIFIER_OPTION_UNTIL_EOD, DISABLE_MODIFIER_OPTION, DELETE_MODIFIER_OPTION];
            }
          },
          { headerName: "Name", field: "item.display_name", valueGetter: (v: { row: IOption }) => v.row.displayName, flex: 1 },
          { headerName: "Price", field: "item.price.amount", valueGetter: (v: { row: IOption }) => `$${Number(v.row.price.amount / 100).toFixed(2)}` },
          { headerName: "Shortcode", field: "item.shortcode", valueGetter: (v: { row: IOption }) => v.row.shortcode, },
          { headerName: "Description", field: "item.description", valueGetter: (v: { row: IOption }) => v.row.description, },
          { headerName: "Ordinal", field: "ordinal", valueGetter: (v: { row: IOption }) => v.row.ordinal },
          { headerName: "FFactor", field: "metadata.flavor_factor", valueGetter: (v: { row: IOption }) => v.row.metadata.flavor_factor },
          { headerName: "BFactor", field: "metadata.bake_factor", valueGetter: (v: { row: IOption }) => v.row.metadata.bake_factor },
          { headerName: "Can Split?", field: "metadata.can_split", valueGetter: (v: { row: IOption }) => v.row.metadata.can_split },
          { headerName: "EnableFxn", field: "enable_function.name", valueGetter: (v: { row: IOption }) => v.row.enable ? productInstanceFunctions[v.row.enable].name : "" },
          // eslint-disable-next-line no-nested-ternary
          { headerName: "Disabled", field: "item.disabled", valueGetter: (v: { row: IOption }) => (v.row.disabled !== null && DisableDataCheck(v.row.disabled, v.row.availability, CURRENT_TIME).enable !== DISABLE_REASON.ENABLED ? (v.row.disabled.start > v.row.disabled.end ? "True" : `${format(v.row.disabled.start, "MMMM dd, y hh:mm a")} to ${format(v.row.disabled.end, "MMMM dd, y hh:mm a")}`) : "False") },
        ]}
        getRowId={(row) => row._id}
        rows={modifier_types_map[modifierType.id].options.map(x => modifierOptionsMap[x]).sort((a,b)=>a.ordinal - b.ordinal)}
      />
    </>
  );
};

export default ModifierOptionTableContainer;
