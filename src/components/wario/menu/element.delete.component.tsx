import React from "react";

import { Warning } from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import { ElementActionComponent, ElementActionComponentProps } from "./element.action.component";

const ElementDeleteComponent = ({ 
  name,
  onCloseCallback,
  onConfirmClick,
  isProcessing
  } : {name: string} & Pick<ElementActionComponentProps, 'onCloseCallback' | 'onConfirmClick' | 'isProcessing'>) => (
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
