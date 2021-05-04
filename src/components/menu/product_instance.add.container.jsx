import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ProductInstanceContainer from "./product_instance.component";
import LinearProgress from '@material-ui/core/LinearProgress';
import { useAuth0 } from '@auth0/auth0-react';

const ProductInstanceAddContainer = ({ ENDPOINT, modifier_types_map, parent_product, onCloseCallback }) => {
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [price, setPrice] = useState(0);
  const [disabled, setDisabled] = useState(null);
  const [ordinal, setOrdinal] = useState(0);
  const [revelID, setRevelID] = useState("");
  const [squareID, setSquareID] = useState("");
  const [modifiers, setModifiers] = useState([]);
  const [isBase, setIsBase] = useState(false);
  const [skipCustomization, setSkipCustomization] = useState(true);
  const [hideFromMenu, setHideFromMenu] = useState(false);
  const [menuAdornment, setMenuAdornment] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("ALWAYS");
  const [isProcessing, setIsProcessing] = useState(false);
  const [suppressExhaustiveModifierList, setSuppressExhaustiveModifierList] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const addProductInstance = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/product/${parent_product._id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            display_name: displayName,
            description: description,
            shortcode: shortcode,
            disabled: disabled,
            ordinal: ordinal,
            price: { amount: price * 100, currency: "USD" },
            revelID: revelID,
            squareID: squareID,
            modifiers: modifiers,
            is_base: isBase,
            display_flags: {
              hide_from_menu: hideFromMenu,
              skip_customization: skipCustomization,
              menu_adornment: menuAdornment,
              price_display: priceDisplay,
              suppress_exhaustive_modifier_list: suppressExhaustiveModifierList
            }
          }),
        });
        if (response.status === 201) {
          setDisplayName("");
          setDescription("");
          setShortcode("");
          setPrice(0);
          setDisabled(null);
          setOrdinal(0);
          setRevelID("");
          setSquareID("");  
          setModifiers([]);
          setIsBase(false);
          setSkipCustomization(false);
          setHideFromMenu(false);
          setMenuAdornment("");
          setPriceDisplay("ALWAYS");
          setSuppressExhaustiveModifierList(false);
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };

  return (
    <ProductInstanceContainer 
      actions={[    
        <Button
          className="btn btn-light"
          onClick={onCloseCallback}
          disabled={isProcessing}>
          Cancel
        </Button>,               
        <Button
          className="btn btn-light"
          onClick={addProductInstance}
          disabled={displayName.length === 0 || shortcode.length === 0 ||
            price < 0 || isProcessing}
        >
          Add
        </Button>
      ]}
      progress={isProcessing ? <LinearProgress /> : "" }
      modifier_types_map={modifier_types_map}
      parent_product={parent_product}
      displayName={displayName}
      setDisplayName={setDisplayName}
      description={description}
      setDescription={setDescription}
      shortcode={shortcode}
      setShortcode={setShortcode}
      price={price}
      setPrice={setPrice}
      disabled={disabled}
      setDisabled={setDisabled}
      ordinal={ordinal}
      setOrdinal={setOrdinal}
      revelID={revelID}
      setRevelID={setRevelID}
      squareID={squareID}
      setSquareID={setSquareID}
      modifiers={modifiers}
      setModifiers={setModifiers}
      isBase={isBase}
      setIsBase={setIsBase}
      skipCustomization={skipCustomization}
      setSkipCustomization={setSkipCustomization}
      hideFromMenu={hideFromMenu}
      setHideFromMenu={setHideFromMenu}
      menuAdornment={menuAdornment}
      setMenuAdornment={setMenuAdornment}
      priceDisplay={priceDisplay}
      setPriceDisplay={setPriceDisplay}
      suppressExhaustiveModifierList={suppressExhaustiveModifierList}
      setSuppressExhaustiveModifierList={setSuppressExhaustiveModifierList}
    />
  );
};

export default ProductInstanceAddContainer;
