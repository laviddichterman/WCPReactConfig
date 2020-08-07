import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ModifierTypeComponent from "./modifier_type.component";
import { useAuth0 } from '@auth0/auth0-react';

const ModifierTypeAddContainer = ({ ENDPOINT, onCloseCallback }) => {
  const [ordinal, setOrdinal] = useState(0);
  const [name, setName] = useState("");
  const [minSelected, setMinSelected] = useState(0);
  const [maxSelected, setMaxSelected] = useState("");
  const [revelID, setRevelID] = useState("");
  const [squareID, setSquareID] = useState("");
  const [omitOptionIfNotAvailable, setOmitOptionIfNotAvailable] = useState(false);
  const [omitSectionIfNoAvailableOptions, setOmitSectionIfNoAvailableOptions] = useState(true);
  const [useToggleIfOnlyTwoOptions, setUseToggleIfOnlyTwoOptions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const addModifierType = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/option/`, {
          method: "POST",
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
        if (response.status === 201) {
          setOrdinal(0);
          setName("");
          setMinSelected(0);
          setMaxSelected("");
          setRevelID("");
          setSquareID("");
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
          onClick={addModifierType}
          disabled={name.length === 0 || (Number.isFinite(maxSelected) && maxSelected < minSelected) || isProcessing}
        >
          Add
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
      omitOptionIfNotAvailable={omitOptionIfNotAvailable}
      setOmitOptionIfNotAvailable={setOmitOptionIfNotAvailable}
      omitSectionIfNoAvailableOptions={omitSectionIfNoAvailableOptions}
      setOmitSectionIfNoAvailableOptions={setOmitSectionIfNoAvailableOptions}
      useToggleIfOnlyTwoOptions={useToggleIfOnlyTwoOptions}
      setUseToggleIfOnlyTwoOptions={setUseToggleIfOnlyTwoOptions}
    />
  );
};

export default ModifierTypeAddContainer;
