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
  // menu
  const [menuOrdinal, setMenuOrdinal] = useState(0);
  const [menuHide, setMenuHide] = useState(false);
  const [menuPriceDisplay, setMenuPriceDisplay] = useState("ALWAYS");
  const [menuAdornment, setMenuAdornment] = useState("");
  const [menuSuppressExhaustiveModifierList, setMenuSuppressExhaustiveModifierList] = useState(false);
  const [menuShowModifierOptions, setMenuShowModifierOptions] = useState(false);

  // order
  const [orderOrdinal, setOrderOrdinal] = useState(0);
  const [orderMenuHide, setOrderMenuHide] = useState(false);        
  const [skipCustomization, setSkipCustomization] = useState(true);
  const [orderPriceDisplay, setOrderPriceDisplay] = useState("ALWAYS");
  const [orderAdornment, setOrderAdornment] = useState("");
  const [orderSuppressExhaustiveModifierList, setOrderSuppressExhaustiveModifierList] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
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
              menu: {
                ordinal: menuOrdinal,
                hide: menuHide,
                price_display: menuPriceDisplay,
                adornment: menuAdornment,
                suppress_exhaustive_modifier_list: menuSuppressExhaustiveModifierList,
                show_modifier_options: menuShowModifierOptions
              },
              order: {
                ordinal: orderOrdinal,
                hide: orderMenuHide,
                skip_customization: skipCustomization,
                price_display: orderPriceDisplay,
                adornment: orderAdornment,
                suppress_exhaustive_modifier_list: orderSuppressExhaustiveModifierList
              }
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
          setMenuOrdinal(0);
          setMenuHide(false);
          setMenuPriceDisplay("ALWAYS");
          setMenuAdornment("");
          setMenuSuppressExhaustiveModifierList(false);
          setMenuShowModifierOptions(false);
          setOrderOrdinal(0);
          setOrderMenuHide(false);
          setSkipCustomization(false);
          setOrderPriceDisplay("ALWAYS");
          setOrderAdornment("");
          setOrderSuppressExhaustiveModifierList(false);
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

      // menu
      menuOrdinal={menuOrdinal}
      setMenuOrdinal={setMenuOrdinal}
      menuHide={menuHide}
      setMenuHide={setMenuHide}
      menuPriceDisplay={menuPriceDisplay}
      setMenuPriceDisplay={setMenuPriceDisplay}
      menuAdornment={menuAdornment}
      setMenuAdornment={setMenuAdornment}
      menuSuppressExhaustiveModifierList={menuSuppressExhaustiveModifierList}
      setMenuSuppressExhaustiveModifierList={setMenuSuppressExhaustiveModifierList}
      menuShowModifierOptions={menuShowModifierOptions}
      setMenuShowModifierOptions={setMenuShowModifierOptions}
      // order
      orderOrdinal={orderOrdinal}
      setOrderOrdinal={setOrderOrdinal}
      orderMenuHide={orderMenuHide}
      setOrderMenuHide={setOrderMenuHide}
      skipCustomization={skipCustomization}
      setSkipCustomization={setSkipCustomization}
      orderPriceDisplay={orderPriceDisplay}
      setOrderPriceDisplay={setOrderPriceDisplay}
      orderAdornment={orderAdornment}
      setOrderAdornment={setOrderAdornment}
      orderSuppressExhaustiveModifierList={orderSuppressExhaustiveModifierList}
      setOrderSuppressExhaustiveModifierList={setOrderSuppressExhaustiveModifierList}
    />
  );
};

export default ProductInstanceAddContainer;
