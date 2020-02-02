import React, { useState } from 'react';
import CheckedInput from "./checked_input.component";

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  title: {
    flexGrow: 1,
  }
}));


const LeadTimesComp = ({
  leadtimes,
  SERVICES,
  onChange,
  onSubmit
}) => {
  const classes = useStyles();
  const leadtime_html = leadtimes.map((x, i) => {
    return (
      <div key={i} className="form-inline">
          <label>{SERVICES[i]}
            <CheckedInput
              className="form-control"
              type="number"
              InputCheckFunction={CheckedInput.CheckForNumberGTZero}
              value={x}
              onFinishChanging={(e) => onChange(i, e)}
              />
          </label>
      </div>
    );
  });
  return (
    <div className="row no-gutters">
      <div className="col">
        Single pizza lead time:
      </div>
      <div className="col">{leadtime_html}</div>
      <Button onClick={onSubmit}>Push Changes</Button>
    </div>
    )
}
export default LeadTimesComp;