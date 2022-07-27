import React from "react";
import { Grid, Button, LinearProgress } from '@mui/material';

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
      key="CANCEL"
      onClick={onCloseCallback}
      disabled={isProcessing}>
      Cancel
    </Button>,
    <Button
      key="CONFIRM"
      onClick={onConfirmClick}
      disabled={disableConfirmOn}>
      {confirmText}
    </Button>
  ]);

  return (
    <div>
      <Grid container spacing={3} justifyContent="center">
        {body}
        {actions_html}
        {isProcessing ? <LinearProgress /> : ""}
      </Grid>
    </div>
  );
};

export { GenerateActionsHtmlFromList, ElementActionComponent };
