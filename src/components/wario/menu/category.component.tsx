import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import { ElementActionComponent } from "./element.action.component";
import { useAppSelector } from "src/hooks/useRedux";
import { getCategoryById } from "src/redux/slices/SocketIoSlice";
import { CALL_LINE_DISPLAY, CategoryDisplay, ICategory } from "@wcp/wcpshared";
import { EntityId } from "@reduxjs/toolkit";
import { StringEnumPropertyComponent } from "../property-components/StringEnumPropertyComponent";
import { IntNumericPropertyComponent } from "../property-components/IntNumericPropertyComponent";
import { ValSetValNamed } from "src/utils/common";

export interface CategoryEditProps {
  category: ICategory;
  onCloseCallback: VoidFunction;
}

export type CategoryComponentProps = {
  categoryIds: EntityId[];
  onCloseCallback: VoidFunction;
  onConfirmClick: VoidFunction;
  isProcessing: boolean;
  confirmText: string; } & 
  ValSetValNamed<string | null, 'description'> &
  ValSetValNamed<number, 'ordinal'> &
  ValSetValNamed<string | null, 'subheading'> &
  ValSetValNamed<string | null, 'footnotes'> &
  ValSetValNamed<string, 'name'> &
  ValSetValNamed<string, 'callLineName'> &
  ValSetValNamed<CALL_LINE_DISPLAY, 'callLineDisplay'> &
  ValSetValNamed<CategoryDisplay, 'nestedDisplay'> &
  ValSetValNamed<string | null, 'parent'> &
  ValSetValNamed<string[], 'serviceDisable'>;

const CategoryComponent = (props: CategoryComponentProps) => {
  const selectCategoryById = useAppSelector(s => (id: EntityId) => getCategoryById(s.ws.categories, id));
  const fulfillments = useAppSelector(s => s.ws.fulfillments!);
  return (
    <ElementActionComponent
      onCloseCallback={props.onCloseCallback}
      onConfirmClick={props.onConfirmClick}
      isProcessing={props.isProcessing}
      disableConfirmOn={props.name.length === 0 || props.ordinal < 0 || props.isProcessing}
      confirmText={props.confirmText}
      body={
        <>
          <Grid item xs={6}>
            <TextField
              label="Category Name"
              type="text"
              inputProps={{ size: 30 }}
              value={props.name}
              size="small"
              onChange={(e) => props.setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={props.categoryIds}
              value={props.parent}
              onChange={(e, v) => props.setParent(v !== null ? String(v) : null)}
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
              value={props.description}
              size="small"
              onChange={(e) => props.setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <IntNumericPropertyComponent
              disabled={props.isProcessing}
              label="Ordinal"
              value={props.ordinal}
              setValue={props.setOrdinal}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              fullWidth
              label="Subheading (Optional, HTML allowed)"
              type="text"
              inputProps={{ size: 100 }}
              value={props.subheading}
              size="small"
              onChange={(e) => props.setSubheading(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              fullWidth
              label="Footnotes (Optional, HTML allowed)"
              type="text"
              inputProps={{ size: 100 }}
              value={props.footnotes}
              size="small"
              onChange={(e) => props.setFootnotes(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Call Line Name"
              type="text"
              inputProps={{ size: 40 }}
              value={props.callLineName}
              size="small"
              onChange={(e) => props.setCallLineName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              multiple
              filterSelectedOptions
              options={Object.keys(fulfillments)}
              value={props.serviceDisable.map((x) => String(x))}
              onChange={(_, v) => {
                props.setServiceDisable(v);
              }}
              getOptionLabel={(option) => fulfillments[option].displayName}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Disabled Services" />}
            />
          </Grid>
          <Grid container item xs={6}>
            <StringEnumPropertyComponent
              disabled={props.isProcessing}
              label="Call Line Display"
              value={props.callLineDisplay}
              setValue={props.setCallLineDisplay}
              options={Object.keys(CALL_LINE_DISPLAY)}
            />
          </Grid>
          <Grid container item xs={6}>
            <StringEnumPropertyComponent
              disabled={props.isProcessing}
              label="Nested Display"
              value={props.nestedDisplay}
              setValue={props.setNestedDisplay}
              options={Object.keys(CategoryDisplay)}
            />
          </Grid>
        </>
      }
    />
  );
}


export default CategoryComponent;