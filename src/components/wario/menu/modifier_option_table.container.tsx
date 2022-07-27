import React, { Dispatch, SetStateAction } from "react";
import { format } from 'date-fns'
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, DeleteOutline, BedtimeOff, CheckCircle, Cancel } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import { DisableDataCheck, IOption, IOptionType } from '@wcp/wcpshared';
import TableWrapperComponent from "../table_wrapper.component";
import { useAppSelector } from "../../../hooks/useRedux";

export interface ModifierOptionTableContainerProps {
  modifier_type: IOptionType;
  setModifierOptionToEdit: Dispatch<SetStateAction<IOption>>;
  setIsModifierOptionEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsModifierOptionDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setIsModifierOptionEnableOpen: Dispatch<SetStateAction<boolean>>;
  setIsModifierOptionDisableOpen: Dispatch<SetStateAction<boolean>>;
  setIsModifierOptionDisableUntilEodOpen: Dispatch<SetStateAction<boolean>>;
};

const ModifierOptionTableContainer = ({
  modifier_type,
  setModifierOptionToEdit,
  setIsModifierOptionEditOpen,
  setIsModifierOptionDeleteOpen,
  setIsModifierOptionEnableOpen,
  setIsModifierOptionDisableOpen,
  setIsModifierOptionDisableUntilEodOpen
}: ModifierOptionTableContainerProps) => {
  const modifier_types_map = useAppSelector(s => s.ws.catalog?.modifiers ?? {});
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
    <TableWrapperComponent
      disableToolbar
      autoHeight={false}
      rowThreshold={0}
      columns={[
        {
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params) => {
            const title = params.row.item.display_name ? params.row.item.display_name : "Modifier Option";
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
            return !DisableDataCheck(params.row.item.disabled, new Date()) ? [EDIT_MODIFIER_OPTION, ENABLE_MODIFIER_OPTION, DELETE_MODIFIER_OPTION] : [EDIT_MODIFIER_OPTION, DISABLE_MODIFIER_OPTION_UNTIL_EOD, DISABLE_MODIFIER_OPTION, DELETE_MODIFIER_OPTION];
          }
        },
        { headerName: "Name", field: "item.display_name", valueGetter: v => v.row.item.display_name, flex: 1 },
        { headerName: "Price", field: "item.price.amount", valueGetter: v => `$${Number(v.row.item.price.amount / 100).toFixed(2)}` },
        { headerName: "Shortcode", field: "item.shortcode", valueGetter: v => v.row.item.shortcode, },
        { headerName: "Description", field: "item.description", valueGetter: v => v.row.item.description, },
        { headerName: "Ordinal", field: "ordinal", valueGetter: v => v.row.ordinal },
        { headerName: "FFactor", field: "metadata.flavor_factor", valueGetter: v => v.row.metadata.flavor_factor },
        { headerName: "BFactor", field: "metadata.bake_factor", valueGetter: v => v.row.metadata.bake_factor },
        { headerName: "Can Split?", field: "metadata.can_split", valueGetter: v => v.row.metadata.can_split },
        { headerName: "EnableFxn", field: "enable_function.name", valueGetter: v => v.row.enable_function ? v.row.enable_function.name : "" },
        // eslint-disable-next-line no-nested-ternary
        { headerName: "Disabled", field: "item.disabled", valueGetter: v => (!DisableDataCheck(v.row.item.disabled, new Date()) ? (v.row.item.disabled.start > v.row.item.disabled.end ? "True" : `${format(v.row.item.disabled.start, "MMMM dd, y hh:mm a")} to ${format(v.row.item.disabled.end, "MMMM dd, y hh:mm a")}`) : "False") },
      ]}
      getRowId={(row) => row._id}
      rows={modifier_types_map[modifier_type.id].options}
    />
  );
};

export default ModifierOptionTableContainer;
