import { Grid } from "@mui/material";
import { ElementActionComponent, ElementActionComponentProps } from "../element.action.component";
import { PrinterGroup, KeyValue } from "@wcp/wcpshared";
import { ValSetValNamed } from "../../../../utils/common";
import { StringPropertyComponent } from "../../property-components/StringPropertyComponent";
import { ToggleBooleanPropertyComponent } from "../../property-components/ToggleBooleanPropertyComponent";
import ExternalIdsExpansionPanelComponent from "../../ExternalIdsExpansionPanelComponent";

export interface PrinterGroupEditProps {
  printerGroup: PrinterGroup;
  onCloseCallback: VoidFunction;
}
export type PrinterGroupComponentProps = {
  confirmText: string;
} & Pick<ElementActionComponentProps, 'onCloseCallback' | 'onConfirmClick' | 'isProcessing'> &
  ValSetValNamed<string, 'name'> &
  ValSetValNamed<boolean, 'isExpo'> &
  ValSetValNamed<boolean, 'singleItemPerTicket'> &
  ValSetValNamed<KeyValue[], 'externalIds'>;

const PrinterGroupComponent = (props: PrinterGroupComponentProps) => {
  return (
    <ElementActionComponent
      onCloseCallback={props.onCloseCallback}
      onConfirmClick={props.onConfirmClick}
      isProcessing={props.isProcessing}
      disableConfirmOn={props.name.length === 0 || props.isProcessing}
      confirmText={props.confirmText}
      body={
        <>
          <Grid item xs={12} sm={4}>
            <StringPropertyComponent
              disabled={props.isProcessing}
              label="Name"
              value={props.name}
              setValue={props.setName}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <ToggleBooleanPropertyComponent
              disabled={props.isProcessing}
              label="Single Item Per Ticket"
              value={props.singleItemPerTicket}
              setValue={props.setSingleItemPerTicket}
              labelPlacement='end'
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <ToggleBooleanPropertyComponent
              disabled={props.isProcessing}
              label="Is Expo Printer"
              value={props.isExpo}
              setValue={props.setIsExpo}
              labelPlacement='end'
            />
          </Grid>
          <Grid item xs={12}>
            <ExternalIdsExpansionPanelComponent
              title='External IDs'
              disabled={props.isProcessing}
              value={props.externalIds}
              setValue={props.setExternalIds}
            />
          </Grid>
        </>
      }
    />
  );
}


export default PrinterGroupComponent;