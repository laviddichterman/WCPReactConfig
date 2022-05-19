import React from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import AbstractExpressionFunctionalContainer from './abstract_expression_functional.container';
import { ElementActionComponent } from "./element.action.component";

const ProductInstanceFunctionComponent = ({
  confirmText,
  onCloseCallback,
  onConfirmClick,
  isProcessing,
  modifier_types,
  functionName,
  setFunctionName,
  expression,
  setExpression,
}) => {
  return (
    <ElementActionComponent 
      onCloseCallback={onCloseCallback}
      onConfirmClick={onConfirmClick}
      isProcessing={isProcessing}
      disableConfirmOn={functionName.length === 0 || isProcessing}
      confirmText={confirmText}
      body={
      <>
        <Grid item xs={12}>
          <TextField
            label="Function Name"
            type="text"
            inputProps={{ size: 40 }}
            value={functionName}
            size="small"
            onChange={(e) => setFunctionName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <AbstractExpressionFunctionalContainer
            modifier_types={modifier_types}
            expression={expression}
            setExpression={setExpression}
          />
        </Grid>
      </>}
    />
  );
};

export default ProductInstanceFunctionComponent;
