import { Grid, TextField, Autocomplete } from "@mui/material";
import { ElementActionComponent } from "./element.action.component";
import { useAppSelector } from "../../../hooks/useRedux";
import { getCategoryById } from "@wcp/wario-ux-shared";
import { CALL_LINE_DISPLAY, CategoryDisplay, ICategory } from "@wcp/wcpshared";
import { EntityId } from "@reduxjs/toolkit";
import { StringEnumPropertyComponent } from "../property-components/StringEnumPropertyComponent";
import { IntNumericPropertyComponent } from "../property-components/IntNumericPropertyComponent";
import { ValSetValNamed } from "../../../utils/common";
import { StringPropertyComponent } from "../property-components/StringPropertyComponent";

export interface CategoryEditProps {
  category: ICategory;
  onCloseCallback: VoidFunction;
}

export type CategoryComponentProps = {
  categoryIds: EntityId[];
  onCloseCallback: VoidFunction;
  onConfirmClick: VoidFunction;
  isProcessing: boolean;
  confirmText: string;
} &
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
          <Grid item xs={12} sm={6}>
            <StringPropertyComponent
              disabled={props.isProcessing}
              label="Category Name"
              value={props.name}
              setValue={props.setName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
              rows={props.subheading ? 4 : 1}
              label="Subheading (Optional, HTML allowed)"
              type="text"
              inputProps={{ size: 100 }}
              value={props.subheading}
              onChange={(e) => props.setSubheading(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              rows={props.footnotes ? 4 : 1}
              fullWidth
              label="Footnotes (Optional, HTML allowed)"
              type="text"
              inputProps={{ size: 100 }}
              value={props.footnotes}
              onChange={(e) => props.setFootnotes(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
          <StringPropertyComponent
              disabled={props.isProcessing}
              label="Call Line Name"
              value={props.callLineName}
              setValue={props.setCallLineName}
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