import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import AbstractExpressionFunctionalContainer from './abstract_expression_functional.container';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  title: {
    flexGrow: 1,
  },
  listLevel0: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  listLevel1: {
    paddingLeft: theme.spacing(4),
  },
}));

const ProductInstanceFunctionComponent = ({
  modifier_types,
  actions,
  progress,
  functionName,
  setFunctionName,
  expression,
  setExpression,
}) => {
  const classes = useStyles();
  const actions_html =
    actions.length === 0 ? (
      ""
    ) : (
      <Grid container justify="flex-end" item xs={12}>
        {actions.map((action, idx) => (
          <Grid item key={idx}>
            {action}
          </Grid>
        ))}
      </Grid>
    );

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justify="center">
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
