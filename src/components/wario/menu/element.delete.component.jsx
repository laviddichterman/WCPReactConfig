import React from "react";

import { Warning } from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import { ElementActionComponent } from "./element.action.component";

// TODO: rename ElementDeleteContainer since it contains business logic
const ElementDeleteComponent = ({ 
  name,
  onCloseCallback,
  onConfirmClick,
  isProcessing
  }) => (
    <ElementActionComponent 
      onCloseCallback={onCloseCallback}
      onConfirmClick={onConfirmClick}
      isProcessing={isProcessing}
      disableConfirmOn={isProcessing}
      confirmText="Confirm"
      body={
        <Grid item xs={12}>
          <Warning /> Are you sure you'd like to delete {name}? Note this cannot be undone.
        </Grid>
      }
    />
  );

export default ElementDeleteComponent;
