import React, { Dispatch, SetStateAction } from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { ElementActionComponent } from "./element.action.component";
import { useAppSelector } from "src/hooks/useRedux";
import { getCategoryById } from "src/redux/slices/SocketIoSlice";
import { CheckedNumericInput } from "../CheckedNumericTextInput";
import { CALL_LINE_DISPLAY, ICategory } from "@wcp/wcpshared";
import { camelCase } from "lodash";
import { EntityId } from "@reduxjs/toolkit";

export interface CategoryEditProps {
  category: ICategory;
  onCloseCallback: VoidFunction;
}

export interface CategoryComponentProps {
  categoryIds: EntityId[];
  onCloseCallback: VoidFunction;
  onConfirmClick: VoidFunction;
  isProcessing: boolean;
  confirmText: string;
  description: string | null;
  setDescription: Dispatch<SetStateAction<string | null>>;
  ordinal: number;
  setOrdinal: Dispatch<SetStateAction<number>>;
  subheading: string | null;
  setSubheading: Dispatch<SetStateAction<string | null>>;
  footnotes: string | null;
  setFootnotes: Dispatch<SetStateAction<string | null>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  callLineName: string;
  setCallLineName: Dispatch<SetStateAction<string>>;
  callLineDisplay: CALL_LINE_DISPLAY
  setCallLineDisplay: Dispatch<SetStateAction<CALL_LINE_DISPLAY>>;
  parent: string | null;
  setParent: Dispatch<SetStateAction<string | null>>;
};

const CategoryComponent = ({
  categoryIds,
  onCloseCallback,
  onConfirmClick,
  isProcessing,
  confirmText,
  description,
  setDescription,
  ordinal,
  setOrdinal,
  subheading,
  setSubheading,
  footnotes,
  setFootnotes,
  name,
  setName,
  callLineName,
  setCallLineName,
  callLineDisplay,
  setCallLineDisplay,
  parent,
  setParent }: CategoryComponentProps) => {
  const selectCategoryById = useAppSelector(s => (id: EntityId) => getCategoryById(s.ws.categories, id));
  return (
    <ElementActionComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={onConfirmClick}
      isProcessing={isProcessing}
      disableConfirmOn={name.length === 0 || ordinal < 0 || isProcessing}
      confirmText={confirmText}
      body={
        <>
          <Grid item xs={6}>
            <TextField
              label="Category Name"
              type="text"
              inputProps={{ size: 30 }}
              value={name}
              size="small"
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={categoryIds}
              value={parent}
              onChange={(e, v) => setParent(String(v))}
              getOptionLabel={(o) => selectCategoryById(o)?.name ?? "Undefined"}
              isOptionEqualToValue={(o, v) => o === v}
              renderInput={(params) => (
                <TextField {...params} label="Parent Category (Optional)" />
              )}
            />
          </Grid>
          <Grid item xs={9}>
            <TextField
              multiline
              fullWidth
              label="Category Description (Optional, HTML allowed)"
              type="text"
              inputProps={{ size: 100 }}
              value={description}
              size="small"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <CheckedNumericInput
              label="Ordinal"
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0, max: 43200, pattern: '[0-9]*', step: 1 }}
              value={ordinal}
              disabled={isProcessing}
              onChange={(e) => setOrdinal(e)}
              parseFunction={parseInt}
              allowEmpty={false} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              fullWidth
              label="Subheading (Optional, HTML allowed)"
              type="text"
              inputProps={{ size: 100 }}
              value={subheading}
              size="small"
              onChange={(e) => setSubheading(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              fullWidth
              label="Footnotes (Optional, HTML allowed)"
              type="text"
              inputProps={{ size: 100 }}
              value={footnotes}
              size="small"
              onChange={(e) => setFootnotes(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Call Line Name"
              type="text"
              inputProps={{ size: 40 }}
              value={callLineName}
              size="small"
              onChange={(e) => setCallLineName(e.target.value)}
            />
          </Grid>
          <Grid container item xs={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Call Line Display</FormLabel>
              <RadioGroup
                defaultValue={CALL_LINE_DISPLAY.SHORTNAME}
                aria-label="call-line-display"
                name="call-line-display"
                row
                value={callLineDisplay}
                onChange={(e) => setCallLineDisplay(CALL_LINE_DISPLAY[e.target.value as keyof typeof CALL_LINE_DISPLAY])}
              >
                {Object.values(CALL_LINE_DISPLAY).map((opt, i) =>
                  <FormControlLabel
                    key={i}
                    value={opt}
                    control={<Radio />}
                    label={camelCase(opt)}
                  />
                )}
              </RadioGroup>
            </FormControl>
          </Grid>
        </>
      }
    />
  );
}


export default CategoryComponent;