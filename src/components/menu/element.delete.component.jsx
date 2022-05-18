import React from "react";

import Grid from "@mui/material/Grid";
import { Warning } from "@mui/icons-material";

const ElementDeleteComponent = ({ 
  name,
  actions}) => {

  const actions_html = actions.length === 0 ? "" : 
    (<Grid container justifyContent="flex-end" item xs={12}>
      {actions.map((action, idx) => (
        <Grid item key={idx}>
          {action}
        </Grid>
      ))}
    </Grid>);
    
  return (
    <div>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Warning />Are you sure you'd like to delete {name}? Note this cannot be undone.
        </Grid>
        {actions_html}
      </Grid>
    </div>
  );
};

export default ElementDeleteComponent;
