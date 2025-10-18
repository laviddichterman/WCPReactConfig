import { Dispatch, SetStateAction } from "react";

import { Grid, TextField } from "@mui/material";
import { IAbstractExpression } from "@wcp/wcpshared";
import { ElementActionComponent, ElementActionComponentProps } from "../element.action.component";
import AbstractExpressionFunctionalContainer from './abstract_expression_functional.container';

export interface ProductInstanceFunctionComponentProps {
  isProcessing: boolean;
  functionName: string;
  setFunctionName: Dispatch<SetStateAction<string>>;
  expression: IAbstractExpression | null;
  setExpression: Dispatch<SetStateAction<IAbstractExpression | null>>;
}

const ProductInstanceFunctionComponent = ({
  isProcessing,
  functionName,
  setFunctionName,
  expression,
  setExpression,
  ...forwardRefs
}: ProductInstanceFunctionComponentProps & Omit<ElementActionComponentProps, 'disableConfirmOn' | 'body'>) => (
  <ElementActionComponent
    {...forwardRefs}
    isProcessing={isProcessing}
    disableConfirmOn={functionName.length === 0 || expression === null || isProcessing}
    body={
      <>
        <Grid size={12}>
          <TextField
            label="Function Name"
            type="text"
            inputProps={{ size: 40 }}
            value={functionName}
            size="small"
            onChange={(e) => setFunctionName(e.target.value)}
          />
        </Grid>
        <Grid size={12}>
          <AbstractExpressionFunctionalContainer
            value={expression}
            setValue={setExpression}
          />
        </Grid>
      </>}
  />
);

export default ProductInstanceFunctionComponent;
