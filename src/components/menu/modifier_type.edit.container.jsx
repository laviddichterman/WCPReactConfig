import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ModifierTypeComponent from "./modifier_type.component";
import { useAuth0 } from "../../react-auth0-spa";

const ModifierTypeEditContainer = ({ ENDPOINT, modifier_type, onCloseCallback }) => {
  const [ordinal, setOrdinal] = useState(modifier_type.ordinal);
  const [name, setName] = useState(modifier_type.name);
  const [minSelected, setMinSelected] = useState(modifier_type.min_selected || 0);
  const [maxSelected, setMaxSelected] = useState(modifier_type.max_selected || "");
  const [revelID, setRevelID] = useState(modifier_type.externalIDs && modifier_type.externalIDs.revelID ? modifier_type.externalIDs.revelID : "");
  const [squareID, setSquareID] = useState(modifier_type.externalIDs && modifier_type.externalIDs.squareID ? modifier_type.externalIDs.squareID : "");
  const [isProcessing, setIsProcessing] = useState(false);
  const { getTokenSilently } = useAuth0();

  const editModifierType = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/option/${modifier_type._id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            ordinal: ordinal,
            min_selected: minSelected,
            max_selected: maxSelected || null,
            revelID: revelID,
            squareID: squareID,
          }),
        });
        if (response.status === 200) {
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };

  return (
    <ModifierTypeComponent 
      actions={[ 
        <Button
          className="btn btn-light"
          onClick={onCloseCallback}
          disabled={isProcessing}>
          Cancel
        </Button>,                  
        <Button
          className="btn btn-light"
          onClick={editModifierType}
          disabled={name.length === 0 || (Number.isFinite(maxSelected) && maxSelected < minSelected) || isProcessing}
        >
          Save
        </Button>
      ]}
      ordinal={ordinal}
      setOrdinal={setOrdinal}
      name={name}
      setName={setName}
      minSelected={minSelected} 
      setMinSelected={setMinSelected}
      maxSelected={maxSelected} 
      setMaxSelected={setMaxSelected}
      revelID={revelID}
      setRevelID={setRevelID}
      squareID={squareID} 
      setSquareID={setSquareID}
    />
  );
};

export default ModifierTypeEditContainer;
