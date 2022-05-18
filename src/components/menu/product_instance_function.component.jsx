import React from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import AbstractExpressionFunctionalContainer from './abstract_expression_functional.container';


const ProductInstanceFunctionComponent = ({
  modifier_types,
  actions,
  progress,
  functionName,
  setFunctionName,
  expression,
  setExpression,
}) => {
  const actions_html =
    actions.length === 0 ? (
      ""
    ) : (
      <Grid container justifyContent="flex-end" item xs={12}>
        {actions.map((action, idx) => (
          <Grid item key={idx}>
            {action}
          </Grid>
        ))}
      </Grid>
    );

  return (
    <div>
      <Grid container spacing={3} justifyContent="center">
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
        {actions_html}
        {progress}
      </Grid>
    </div>
  );
};

export default ProductInstanceFunctionComponent;
