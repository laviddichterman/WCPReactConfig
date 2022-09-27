import React from "react";
import { Grid, Button, LinearProgress, DialogContent, DialogActions } from '@mui/material';

const GenerateActionsHtmlFromList = (actions: React.ReactNode[]) => actions.length === 0 ? "" :
  (<Grid container justifyContent="flex-end" item xs={12}>
    {actions.map((action, idx) => (
      <Grid item key={idx}>
        {action}
      </Grid>
    ))}
  </Grid>)

export interface ElementActionComponentProps {
  onCloseCallback: React.MouseEventHandler<HTMLButtonElement>;
  onConfirmClick: React.MouseEventHandler<HTMLButtonElement>;
  isProcessing: boolean;
  disableConfirmOn: boolean;
  confirmText: string;
  body: React.ReactNode;
}
const ElementActionComponent = ({
  body,
  onCloseCallback,
  onConfirmClick,
  isProcessing,
  disableConfirmOn,
  confirmText
}: ElementActionComponentProps) => {

  const actions_html = GenerateActionsHtmlFromList([
    <Button
      onClick={onCloseCallback}
      disabled={isProcessing}>
      Cancel
    </Button>,
    <Button
      onClick={onConfirmClick}
      disabled={disableConfirmOn}>
      {confirmText}
    </Button>
  ]);

  return (
    <div>
      <DialogContent>
        <Grid container rowSpacing={2} spacing={2} justifyContent="center">
          {body}
        </Grid>
      </DialogContent>
      <DialogActions>
        {actions_html}
        {isProcessing ? <LinearProgress /> : ""}
      </DialogActions>
    </div>
  );
};

export { GenerateActionsHtmlFromList, ElementActionComponent };
