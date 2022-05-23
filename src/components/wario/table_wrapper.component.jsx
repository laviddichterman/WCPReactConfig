import React, { forwardRef } from "react";
import { DataGridPro } from '@mui/x-data-grid-pro';
import config from "../auth_config.json";
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { LicenseInfo } from '@mui/x-license-pro';

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

LicenseInfo.setLicenseKey(
  config.muilicense
);

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
}


const TableWrapperComponent = ({
  disableToolbar,
  ...forwardParams
}) => {
  return (
  <div style={{ display: 'flex', height: '100%' }}>
    <div style={{ flexGrow: 1 }}>
    <DataGridPro
      components={disableToolbar ? {} : {
        Toolbar: CustomToolbar,
      }}
      autoHeight
      density="compact"
      hideFooter
      disableColumnReorder={true}
      {...forwardParams}
      icons={tableIcons}
      />
    </div>
  </div>    
  );
};

export default TableWrapperComponent;
