import React from "react";
import moment from 'moment';
import TableWrapperComponent from "../table_wrapper.component";
import {GridActionsCellItem}  from "@mui/x-data-grid";
import { Edit, DeleteOutline, BedtimeOff, CheckCircle, Cancel } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';

const ModifierOptionTableContainer = ({
  modifier_type,
  modifier_types_map,
  setModifierOptionToEdit,
  setIsModifierOptionEditOpen,
  setIsModifierOptionDeleteOpen,
  setIsModifierOptionEnableOpen,
  setIsModifierOptionDisableOpen,
  setIsModifierOptionDisableUntilEodOpen
}) => {

  const editModifierOption = (row) => () => {
    setIsModifierOptionEditOpen(true);
    setModifierOptionToEdit(row);
  };

  const deleteModifierOption = (row) => () => {
    setIsModifierOptionDeleteOpen(true);
    setModifierOptionToEdit(row);
  };

  const disableOptionUntilEOD = (row) => () => { 
    setIsModifierOptionDisableUntilEodOpen(true);
    setModifierOptionToEdit(row);
  };
  const disableOption = (row) => () => { 
    setIsModifierOptionDisableOpen(true);
    setModifierOptionToEdit(row);
  };
  const enableOption = (row) => () => { 
    setIsModifierOptionEnableOpen(true);
    setModifierOptionToEdit(row);
  };

  return (
    <TableWrapperComponent
      disableToolbar
      columns={[
        {
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params) => {
            const title = params.row.item.display_name ? params.row.item.display_name : "Modifier Option";
            const EDIT_MODIFIER_OPTION = (<GridActionsCellItem
              icon={<Tooltip title={`Edit ${title}`}><Edit/></Tooltip>}
              label={`Edit ${title}`}
              onClick={editModifierOption(params.row)}
            />);
            const DELETE_MODIFIER_OPTION = (<GridActionsCellItem
              icon={<Tooltip title={`Delete ${title}`}><DeleteOutline/></Tooltip>}
              label={`Delete ${title}`}
              onClick={deleteModifierOption(params.row)}
              showInMenu
            />);
            const ENABLE_MODIFIER_OPTION = (<GridActionsCellItem
              icon={<Tooltip title={`Enable ${title}`}><CheckCircle/></Tooltip>}
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
            return params.row.item.disabled ? [EDIT_MODIFIER_OPTION, ENABLE_MODIFIER_OPTION, DELETE_MODIFIER_OPTION] : [EDIT_MODIFIER_OPTION, DISABLE_MODIFIER_OPTION_UNTIL_EOD, DISABLE_MODIFIER_OPTION, DELETE_MODIFIER_OPTION];
          }
        },
        { headerName: "Name", field: "item.display_name", valueGetter: v => v.row.item.display_name },
        { headerName: "Price", field: "item.price.amount", valueGetter: v => `$${Number(v.row.item.price.amount / 100).toFixed(2)}`},
        { headerName: "Shortcode", field: "item.shortcode", valueGetter: v => v.row.item.shortcode, },
        { headerName: "Description", field: "item.description", valueGetter: v => v.row.item.description, },
        { headerName: "Ordinal", field: "ordinal", valueGetter: v => v.row.ordinal, defaultSort: "asc"},
        { headerName: "FFactor", field: "metadata.flavor_factor", valueGetter: v => v.row.metadata.flavor_factor},
        { headerName: "BFactor", field: "metadata.bake_factor", valueGetter: v => v.row.metadata.bake_factor},
        { headerName: "Can Split?", field: "metadata.can_split", valueGetter: v => v.row.metadata.can_split},
        { headerName: "EnableFxn", field: "enable_function.name", valueGetter: v => v.row.enable_function ? v.row.enable_function.name : ""},
        { headerName: "Disabled", field: "item.disabled", valueGetter: v => (v.row.item.disabled ? (v.row.item.disabled.start > v.row.item.disabled.end ? "True" : `${moment(v.row.item.disabled.start).format("MMMM DD, Y hh:mm A")} to  ${moment(v.row.item.disabled.end).format("MMMM DD, Y hh:mm A")}`) : "False" )},
      ]}
      getRowId={(row) => row._id}
      rows={modifier_types_map[modifier_type._id].options}
    />
  );
};

export default ModifierOptionTableContainer;
