import React from "react";
import LinearProgress from '@mui/material/LinearProgress';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

const GenerateActionsHtmlFromList = (actions) => actions.length === 0 ? "" : 
    (<Grid container justifyContent="flex-end" item xs={12}>
      {actions.map((action, idx) => (
        <Grid item key={idx}>
          {action}
        </Grid>
      ))}
    </Grid>)
const ElementActionComponent = ({ 
  body,
  onCloseCallback,
  onConfirmClick,
  isProcessing,
  disableConfirmOn,
  confirmText
}) => {

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
      <Grid container spacing={3} justifyContent="center">
        {body}
        {actions_html}
        {isProcessing ? <LinearProgress /> : "" }
      </Grid>
    </div>
  );
};

export {GenerateActionsHtmlFromList, ElementActionComponent};
