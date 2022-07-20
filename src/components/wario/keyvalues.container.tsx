import React, { useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Box, Card, CardHeader, Grid, Button, TextField, Paper, Popper, Typography, CardContent, CardActions } from "@mui/material";
import { GridActionsCellItem, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import TableWrapperComponent from "./table_wrapper.component";

function isOverflown(element : any) {
  return element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth;
}

interface GridCellExpandProps {
  value: string;
  width: number;
};

const GridCellExpand = React.memo(({ width, value } : GridCellExpandProps) => {
  const wrapper = React.useRef<HTMLDivElement>(null);
  const cellDiv = React.useRef<HTMLDivElement>(null);
  const cellValue = React.useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
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

    function handleKeyDown(nativeEvent : KeyboardEvent) {
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
            style={{ minHeight: (wrapper.current as HTMLDivElement).offsetHeight - 3 }}
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

type renderCellExpandProps = { 
  colDef: { computedWidth: number; };
  value: string;
} & GridRenderCellParams<any, any, any>

function renderCellExpand(params : renderCellExpandProps) {
  return (
    <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
  );
}

export interface KeyValuesContainerProps {
  values : Record<string, string | number | boolean>;
  onSubmit: (values: Record<string, string | number | boolean>) => void;
  canAdd?: boolean;
  canEdit?: boolean;
  canRemove?: boolean;
  title: React.ReactNode;
  isProcessing: boolean;
}

interface RowType { id: string; data: string | number | boolean; };

const KeyValuesContainer = ({ values, onSubmit, canAdd, canRemove, canEdit, title, isProcessing } : KeyValuesContainerProps) => {
  const [localValues, setLocalValues] = useState(values);
  const [newkey, setNewkey] = useState("");
  const [newvalue, setNewvalue] = useState<string | number | boolean>("");

  
  const onAddNewKeyValuePair = () => {
      setLocalValues({ ...localValues, [newkey]: newvalue! });
      setNewkey("");
      setNewvalue("");  
  }

  const removeColumn = canRemove ? [{
    headerName: "Delete",
    field: 'actions',
    type: 'actions',
    getActions: (params : GridRowParams) => [
      <GridActionsCellItem
        key={"delete"}
        icon={<HighlightOffIcon />}
        label={"Delete"}
        onClick={() => {
          const new_dict = structuredClone(values);
          delete new_dict[params.id];
          setLocalValues(new_dict);
        }} />
    ]
  }] : [];
  return (
    <div>
      <Card>
        <CardHeader title={title} />
        <CardContent>
          { canAdd && 
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
              <Button disabled={isProcessing || newkey === "" || newvalue === null } onClick={onAddNewKeyValuePair}>Add</Button>
            </Grid>
          </Grid>
          }
          <div style={{ height: "100%", overflow: "auto" }}>
            <TableWrapperComponent
              experimentalFeatures={{ newEditingApi: true }}
              processRowUpdate={(newRow) => {
                setLocalValues({ ...localValues, [newRow.id]: newRow.value });
                return newRow;
              }}
              disableToolbar
              columns={[
                { headerName: "Key", field: "key", valueGetter: v => v.row.id, flex: 1 },
                { headerName: "Value", editable: canEdit, field: "value", valueGetter: v => v.row.data, flex: 4, renderCell: renderCellExpand },
                ...removeColumn
              ]}
              rows={Object.entries(localValues).map((e) => ({ id: e[0], data: e[1] } as RowType))} toolbarActions={[]} />
          </div>
        </CardContent>
        <CardActions>
          <Button disabled={isProcessing} onClick={() => onSubmit(localValues)}>PUSH CHANGES</Button>
        </CardActions>
      </Card>
    </div>
  );
};
export default KeyValuesContainer;
