import React, { Dispatch, SetStateAction } from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import AbstractExpressionFunctionalContainer from './abstract_expression_functional.container';
import { ElementActionComponent, ElementActionComponentProps } from "./element.action.component";
import { IAbstractExpression } from "@wcp/wcpshared";

export interface ProductInstanceFunctionComponentProps { 
  isProcessing: boolean;
  functionName: string;
  setFunctionName: Dispatch<SetStateAction<string>>;
  expression: IAbstractExpression| null;
  setExpression: Dispatch<SetStateAction<IAbstractExpression|null>>;
}

const ProductInstanceFunctionComponent = ({
  isProcessing,
  functionName,
  setFunctionName,
  expression,
  setExpression,
  ...forwardRefs
} : ProductInstanceFunctionComponentProps & Omit<ElementActionComponentProps, 'disableConfirmOn' | 'body'>) => (
    <ElementActionComponent 
      {...forwardRefs}
      isProcessing={isProcessing}
      disableConfirmOn={functionName.length === 0 || isProcessing}
      body={
      <>
        <Grid item xs={12}>
          <TextField
            label="Function Name"
            type="text"
            inputProps={{ size: 40 }}
            value={functionName}
            size="small"
            onChange={(e) => setFunctionName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <AbstractExpressionFunctionalContainer
            expression={expression}
            setExpression={setExpression}
          />
        </Grid>
      </>}
    />
  );

export default ProductInstanceFunctionComponent;
