import React, { useState } from "react";
import moment from "moment";
import { useAuth0 } from '@auth0/auth0-react';
import Grid from "@mui/material/Grid";

import { ElementActionComponent } from "./element.action.component";

const ModifierOptionDisableUntilEodContainer = ({ ENDPOINT, modifier_option, onCloseCallback }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const editModifierOption = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${ENDPOINT}/api/v1/menu/option/${modifier_option.option_type_id}/${modifier_option._id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            display_name: modifier_option.item.display_name,
            description: modifier_option.item.description,
            shortcode: modifier_option.item.shortcode,
            disabled: { start: moment().valueOf(), end: moment().hour(23).minute(59).valueOf() },
            price: modifier_option.item.price,
            ordinal: modifier_option.ordinal,
            enable_function: modifier_option.enable_function,
            flavor_factor: modifier_option.metadata.flavor_factor,
            bake_factor: modifier_option.metadata.bake_factor,
            can_split: modifier_option.metadata.can_split,
            revelID: modifier_option.item?.externalIDs?.revelID,
            squareID: modifier_option.item?.externalIDs?.squareID,
            display_flags: {
              omit_from_shortname: modifier_option.display_flags?.omit_from_shortname,
              omit_from_name: modifier_option.display_flags?.omit_from_name
            }
          }),
        });
        if (response.status === 200) {
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <ElementActionComponent 
      onCloseCallback={onCloseCallback}
      onConfirmClick={editModifierOption}
      isProcessing={isProcessing}
      disableConfirmOn={isProcessing}
      confirmText="Confirm"
      body={
        <Grid item xs={12}>
          Are you sure you'd like to disable {modifier_option.item.display_name} until end-of-day?
        </Grid>
      }
    />    
  );
};

export default ModifierOptionDisableUntilEodContainer;