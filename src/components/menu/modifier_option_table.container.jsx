import React from "react";
import moment from 'moment';
import TableWrapperComponent from "../table_wrapper.component";
import {GridActionsCellItem}  from "@mui/x-data-grid";
import { Edit, DeleteOutline } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';

const ModifierOptionTableContainer = ({
  modifier_type,
  modifier_types_map,
  setModifierOptionToEdit,
  setIsModifierOptionEditOpen,
  setIsModifierOptionDeleteOpen
}) => {

  const editModifierOption = (row) => () => {
    setIsModifierOptionEditOpen(true);
    setModifierOptionToEdit(row);
  };

  const deleteModifierOption = (row) => () => {
    setIsModifierOptionDeleteOpen(true);
    setModifierOptionToEdit(row);
  };

  return (
    <TableWrapperComponent
      // options={{
      //   showTitle: false,
      //   showEmptyDataSourceMessage: false,
      //   sorting: false,
      //   search: false,
      //   rowStyle: {
      //     padding: 0,
      //   },
      // }}
      columns={[
        {
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params) => [
            <GridActionsCellItem
              icon={<Tooltip title="Edit Modifier Option"><Edit/></Tooltip>}
              label="Edit Modifier Option"
              onClick={editModifierOption(params.row)}
            />,
            <GridActionsCellItem
              icon={<Tooltip title="Delete Modifier Option"><DeleteOutline/></Tooltip>}
              label="Delete Modifier Option"
              onClick={deleteModifierOption(params.row)}
            />
          ]
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
