import React, { forwardRef } from "react";
import { DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';
import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarQuickFilterProps
} from '@mui/x-data-grid';
import Grid, { GridSize } from "@mui/material/Grid";

import { LicenseInfo } from '@mui/x-license-pro';

import { MUI_LICENSE } from '../../config';

LicenseInfo.setLicenseKey(MUI_LICENSE as string);

export interface ToolbarAction { 
  size: number; elt: React.ReactNode;
}
export interface CustomToolbarProps {
  quickFilterProps: GridToolbarQuickFilterProps;
  title: React.ReactNode;
  actions: ToolbarAction[];
}

function CustomToolbar({quickFilterProps, title, actions=[]} : CustomToolbarProps) {
  return (
    <GridToolbarContainer >
      <Grid container  item xs={12}>
        <Grid item xs={6}>{title}</Grid>
        <Grid item container xs={6}>
          <Grid item xs={12-(actions.reduce((acc, x)=>acc+x.size, 0))} >
            <GridToolbarQuickFilter {...quickFilterProps} />
          </Grid>
          {actions.length ? actions.map((action, idx)=>(<Grid item xs={action.size} key={idx}>{action.elt}</Grid>)) : ""}
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
}

interface TableWrapperComponentProps { 
  disableToolbar: boolean;
  title?: React.ReactNode;
  toolbarActions?: ToolbarAction[];
}


const TableWrapperComponent = ({
  disableToolbar,
  title,
  toolbarActions = [],
  ...forwardParams
} : TableWrapperComponentProps & DataGridProProps) => (
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
      />
  
  );

export default TableWrapperComponent;
