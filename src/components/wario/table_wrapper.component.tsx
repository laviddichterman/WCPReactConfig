import React from "react";
import { Typography } from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarQuickFilterProps
} from '@mui/x-data-grid-premium';
import Grid from "@mui/material/Grid";
import { DataGridPremium, DataGridPremiumProps } from "@mui/x-data-grid-premium";

export interface ToolbarAction {
  size: number; elt: React.ReactNode;
}
export interface CustomToolbarProps {
  showQuickFilter?: boolean;
  quickFilterProps: GridToolbarQuickFilterProps;
  title: React.ReactNode;
  actions: ToolbarAction[];
}

function CustomToolbar({ showQuickFilter, quickFilterProps, title, actions = [] }: CustomToolbarProps) {
  const actionSizeSum = actions.reduce((acc, x) => acc + x.size, 0);
  return (
    <GridToolbarContainer >
      <Grid container item xs={12} sx={{ m: 'auto', width: '100%' }}>
        <Grid item xs={showQuickFilter ? 12 : 12 - actionSizeSum} md={showQuickFilter ? 6 : 12 - actionSizeSum}>
          <Typography variant="h5">{title}</Typography>
        </Grid>
        {showQuickFilter &&
          <Grid sx={{ py: 1 }} item xs={12 - actionSizeSum} md={6 - actionSizeSum} >
            <GridToolbarQuickFilter {...quickFilterProps} />
          </Grid>
        }
        {actions.map((action, idx) => (<Grid item sx={{ py: 1 }} xs={action.size} key={idx}>{action.elt}</Grid>))}
      </Grid>
    </GridToolbarContainer>
  );
}

interface TableWrapperComponentProps {
  disableToolbar?: boolean;
  enableSearch?: boolean;
  title?: string;
  toolbarActions?: ToolbarAction[];
}

const TableWrapperComponent = ({
  disableToolbar = false,
  enableSearch = true,
  title,
  toolbarActions = [],
  ...forwardParams
}: TableWrapperComponentProps & DataGridPremiumProps) => (
  <DataGridPremium
    componentsProps={{
      toolbar: {
        title,
        actions: toolbarActions || [],
        showQuickFilter: enableSearch ?? undefined,
        quickFilterProps: enableSearch ? { debounceMs: 500 } : undefined,
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
