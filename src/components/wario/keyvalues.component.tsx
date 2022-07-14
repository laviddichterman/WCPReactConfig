import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Card, CardHeader, Grid, Button, TextField, Paper, Popper, Typography, CardContent, CardActions} from "@mui/material";
import {GridActionsCellItem}  from "@mui/x-data-grid";
import TableWrapperComponent from "./table_wrapper.component";

const isOverflown = (element) => (
  element.scrollHeight > element.clientHeight ||
  element.scrollWidth > element.clientWidth
);

const GridCellExpand = React.memo((props) => {
  const { width, value } = props;
  const wrapper = React.useRef(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: 1,
        height: 1,
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: 1,
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, offset: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current.offsetHeight - 3 }}
          >
            <Typography variant="body2" style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  );
});

GridCellExpand.propTypes = {
  value: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
};

function renderCellExpand(params) {
  return (
    <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
  );
}

renderCellExpand.propTypes = {
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: PropTypes.string.isRequired,
};

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
      <Card>
        <CardHeader title={"Key Value Store"} subtitle={"Use for authentication data; will cause reboot of service."} />
        <CardContent>
        <Grid container spacing={3} justifyContent="center">
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
              fullWidth
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
        <div style={{ height: "100%", overflow: "auto" }}>
  <TableWrapperComponent
    disableToolbar
    columns={[
      { headerName: "Key", field: "key", valueGetter: v => v.row.id, flex: 1 },
      { headerName: "Value", field: "value", valueGetter: v => v.row.data, flex: 4, renderCell: renderCellExpand},
      {
        headerName: "Delete",
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
        <GridActionsCellItem
            key={"delete"}
            icon={<HighlightOffIcon />}
            label={"Delete"}
            onClick={() => {
              const new_dict = JSON.parse(JSON.stringify(KEYVALUES));
              delete new_dict[params.id];
              setKEYVALUES(new_dict);}}
          />]
      }
    ]}
    rows={Object.entries(KEYVALUES).map((e) => ({id: e[0], data: e[1] }) )}
  />
  </div>
        </CardContent>
        <CardActions>
          <Button onClick={onSubmit}>PUSH CHANGES</Button>
        </CardActions>
      </Card>
    </div>
  );
};
export default KeyValuesComponent;
