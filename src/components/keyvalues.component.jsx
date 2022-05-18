import React, { useState, useEffect } from "react";

import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import IconButton from "@mui/material/IconButton";
import { useAuth0 } from '@auth0/auth0-react';


const KeyValuesComponent = ({
  ENDPOINT
}) => {
  const [KEYVALUES, setKEYVALUES] = useState({});
  const [newkey, setNewkey] = useState("");
  const [newvalue, setNewvalue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { isLoading, getAccessTokenSilently, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently( { scope: "read:settings"} );
      const response = await fetch(`${ENDPOINT}/api/v1/config/kvstore`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      setKEYVALUES(await response.json());
    }
    if (!isLoading && isAuthenticated) {
      getToken();
    }
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, getAccessTokenSilently, isAuthenticated, loginWithRedirect, logout, ENDPOINT]);

  const onAddNewKeyValuePair = (key, value) => {
    const new_dict = JSON.parse(JSON.stringify(KEYVALUES));
    new_dict[key] = value;
    setKEYVALUES(new_dict);
  }
  const onAddNewKeyValuePairLocal = () => {
    if (newkey) {
      onAddNewKeyValuePair(newkey, newvalue);
    }
    setNewkey("");
    setNewvalue("");
  };
  const onRemoveKeyValuePair = (key) => {
    const new_dict = JSON.parse(JSON.stringify(KEYVALUES));
    delete new_dict[key];
    setKEYVALUES(new_dict);
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:settings"} );
        const response = await fetch(`${ENDPOINT}/api/v1/config/kvstore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(KEYVALUES)
        });
        if (response.status === 201) {
          setKEYVALUES(await response.json());
        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div>
      <Paper>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="subtitle1">
                  Key Value Store (Use for authentication data, will cause
                  reboot of service)
                </Typography>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Key"
              type="text"
              size="small"
              onChange={e => setNewkey(e.target.value)}
              value={newkey}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth={true}
              label="Value"
              type="text"
              value={newvalue}
              size="small"
              onChange={e => setNewvalue(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={onAddNewKeyValuePairLocal}>Add</Button>
          </Grid>
        </Grid>
        {Object.keys(KEYVALUES).map((k, i) => {
    return (
      <Paper key={i} spacing={3}>
        <Grid container>
          <Grid item xs={3}>
            {k}
          </Grid>
          <Grid item xs={7}>
            {KEYVALUES[k]}
          </Grid>
          <Grid item xs={2}>
            <IconButton
              edge="end"
              size="small"
              aria-label="delete"
              onClick={() => onRemoveKeyValuePair(k)}
            >
              <HighlightOffIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    );
  })}
        <Button onClick={onSubmit}>PUSH CHANGES</Button>
      </Paper>
    </div>
  );
};
export default KeyValuesComponent;
