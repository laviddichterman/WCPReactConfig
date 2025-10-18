import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { IWInterval, KeyValue } from "@wcp/wario-shared";
import React, { useState } from 'react';
import { ValSetVal } from "src/utils/common";
import KeyValuesContainer from './keyvalues.container';

export type ExternalIdsExpansionPanelProps = {
  title: React.ReactNode;
  disabled: boolean;
} & ValSetVal<KeyValue[]>;

export const IsDisableValueValid = (value: IWInterval | null) =>
  value === null || (value.start === 1 && value.end === 0) || (value.start <= value.end);

export const ExternalIdsExpansionPanelComponent = (props: ExternalIdsExpansionPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Accordion sx={{ p: 2 }} expanded={isExpanded} onChange={(_, ex) => setIsExpanded(ex)}  >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography sx={{ ml: 4 }}>{props.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <KeyValuesContainer
          //title={props.title}
          values={props.value}
          setValues={props.setValue}
          isProcessing={props.disabled}
          canAdd
          canEdit
          canRemove
        />
      </AccordionDetails>
    </Accordion>

  );
};

export default ExternalIdsExpansionPanelComponent;
