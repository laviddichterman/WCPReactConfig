import React, { forwardRef } from "react";
import { DataGridPro } from '@mui/x-data-grid-pro';
import {
  GridToolbarContainer,
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import Grid from "@mui/material/Grid";

import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { LicenseInfo } from '@mui/x-license-pro';

import { MUI_LICENSE } from '../../config';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  ExpandLess: forwardRef((props, ref) => <ExpandLess {...props} ref={ref} />),
  ExpandMore: forwardRef((props, ref) => <ExpandMore {...props} ref={ref} />),
};

LicenseInfo.setLicenseKey(MUI_LICENSE);

function CustomToolbar({quickFilterProps, title, actions}) {
  return (
    <GridToolbarContainer >
      <Grid container  item xs={12}>
        <Grid item xs={6}>{title}</Grid>
        <Grid item container xs={6}>
          <Grid item xs={12-actions?.length} >
            <GridToolbarQuickFilter {...quickFilterProps} />
          </Grid>
          {actions.length ? actions.map((action, idx)=>(<Grid item xs={1} key={idx}>{action}</Grid>)) : ""}
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
}


const TableWrapperComponent = ({
  disableToolbar,
  title,
  toolbarActions,
  ...forwardParams
}) => (
    <DataGridPro
      componentsProps={{
        toolbar: {
          title,
          actions: toolbarActions || [],
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
      components={disableToolbar ? {} : {
        Toolbar: CustomToolbar,
      }}
      density="compact"
      hideFooter
      autoHeight
      disableColumnReorder
      {...forwardParams}
      icons={tableIcons}
      />
  
  );

export default TableWrapperComponent;
