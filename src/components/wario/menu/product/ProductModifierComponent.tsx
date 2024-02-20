import {
  Grid,
  TextField,
  Card,
  CardContent,
  Autocomplete,
  CardHeader
} from '@mui/material';
import { getFulfillments } from '@wcp/wario-ux-shared';
import { IProductModifier } from '@wcp/wcpshared';
import { useAppSelector } from '../../../../hooks/useRedux';
import { ValSetValNamed } from '../../../../utils/common';


type ProductModifierComponentProps = {
  isProcessing: boolean;
} & ValSetValNamed<IProductModifier[], 'modifiers'>;

const ProductModifierComponent = (props: ProductModifierComponentProps) => {
  const catalog = useAppSelector(s => s.ws.catalog!);
  const fulfillments = useAppSelector(s => getFulfillments(s.ws.fulfillments));

  const handleSetModifiers = (mods: string[]) => {
    const oldModsAsRecord = props.modifiers.reduce((acc, m) => ({ ...acc, [m.mtid]: m }), {} as Record<string, IProductModifier>)
    const sorted: IProductModifier[] = mods.sort((a, b) => catalog.modifiers[a].modifierType.ordinal - catalog.modifiers[b].modifierType.ordinal)
      .map(x => ({ mtid: x, serviceDisable: oldModsAsRecord[x]?.serviceDisable ?? [], enable: oldModsAsRecord[x]?.enable ?? null }));
    props.setModifiers(sorted);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          disabled={props.isProcessing}
          filterSelectedOptions
          options={Object.keys(catalog.modifiers)}
          value={props.modifiers.map(x => x.mtid)}
          onChange={(e, v) => handleSetModifiers(v)}
          getOptionLabel={(option) => catalog.modifiers[option].modifierType.name ?? 'CORRUPT DATA'}
          isOptionEqualToValue={(o, v) => o === v}
          renderInput={(params) => <TextField {...params} label="Modifiers" />}
        />
      </Grid>
      {props.modifiers.map((modifier, idx) => (
        <Grid item xs={12} md={props.modifiers.length - 1 === idx && props.modifiers.length % 2 === 1 ? 12 : 6} key={idx}>
          <Card>
            <CardHeader title={`Modifier Details: ${catalog.modifiers[modifier.mtid].modifierType.name}`} />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    fullWidth
                    disabled={props.isProcessing}
                    options={Object.keys(catalog.productInstanceFunctions)}
                    value={modifier.enable}
                    // this makes a copy of the modifiers array with the updated enable function value
                    onChange={(_, v) => props.setModifiers(Object.assign([], props.modifiers, { [idx]: { ...modifier, enable: v } }))}
                    getOptionLabel={(option) => catalog.productInstanceFunctions[option].name ?? 'CORRUPT DATA'}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => <TextField {...params} label="Enable Function Name" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    fullWidth
                    multiple
                    disabled={props.isProcessing}
                    filterSelectedOptions
                    options={Object.keys(fulfillments)}
                    value={modifier.serviceDisable}
                    onChange={(_, v) => props.setModifiers(Object.assign([], props.modifiers, { [idx]: { ...modifier, serviceDisable: v } }))}
                    getOptionLabel={(option) => fulfillments.find((v)=>v.id === option)?.displayName ?? "INVALID"}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => <TextField {...params} label="Disabled Services" />}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>))}
    </Grid>
  );
};

export default ProductModifierComponent;
