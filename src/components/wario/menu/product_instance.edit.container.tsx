import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { ProductInstanceActionContainer } from "./product_instance.component";
import { HOST_API } from "../../../config";
import { useAppSelector } from "src/hooks/useRedux";
import { IProduct, IProductInstance } from "@wcp/wcpshared";

interface ProductInstanceEditContainerProps {
  parent_product: IProduct;
  product_instance: IProductInstance;
  onCloseCallback: VoidFunction;
}

const ProductInstanceEditContainer = ({ parent_product, product_instance, onCloseCallback} : ProductInstanceEditContainerProps) => {
  const [displayName, setDisplayName] = useState(product_instance.item.display_name);
  const [description, setDescription] = useState(product_instance.item.description);
  const [shortcode, setShortcode] = useState(product_instance.item.shortcode);
  const [ordinal, setOrdinal] = useState(product_instance.ordinal || 0);
  const [revelID, setRevelID] = useState(product_instance.item?.externalIDs?.revelID ?? "");
  const [squareID, setSquareID] = useState(product_instance.item?.externalIDs?.squareID ?? "");
  const [modifiers, setModifiers] = useState(product_instance.modifiers);
  const [isBase, setIsBase] = useState(product_instance.is_base ?? false);
  const [menuOrdinal, setMenuOrdinal] = useState(product_instance.display_flags?.menu?.ordinal || 0);
  const [menuHide, setMenuHide] = useState(product_instance.display_flags?.menu?.hide ?? false);
  const [menuPriceDisplay, setMenuPriceDisplay] = useState(product_instance.display_flags?.menu?.price_display ?? "IF_COMPLETE");
  const [menuAdornment, setMenuAdornment] = useState(product_instance.display_flags?.menu?.adornment ?? "");
  const [menuSuppressExhaustiveModifierList, setMenuSuppressExhaustiveModifierList] = useState(product_instance.display_flags?.menu?.suppress_exhaustive_modifier_list ?? false);
  const [menuShowModifierOptions, setMenuShowModifierOptions] = useState(product_instance.display_flags?.menu?.show_modifier_options ?? false);
  const [orderOrdinal, setOrderOrdinal] = useState(product_instance.display_flags?.order?.ordinal || 0);
  const [orderMenuHide, setOrderMenuHide] = useState(product_instance.display_flags?.order?.hide ?? false);
  const [skipCustomization, setSkipCustomization] = useState(product_instance.display_flags?.order?.skip_customization ?? false);
  const [orderPriceDisplay, setOrderPriceDisplay] = useState(product_instance.display_flags?.order?.price_display ?? "IF_COMPLETE");
  const [orderAdornment, setOrderAdornment] = useState(product_instance.display_flags?.order?.adornment ?? "");
  const [orderSuppressExhaustiveModifierList, setOrderSuppressExhaustiveModifierList] = useState(product_instance.display_flags?.order?.suppress_exhaustive_modifier_list ?? false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const editProductInstance = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${HOST_API}/api/v1/menu/product/${parent_product.id}/${product_instance.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            display_name: displayName,
            description,
            shortcode,
            ordinal,
            revelID,
            squareID,
            modifiers,
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
    <ProductInstanceActionContainer 
      confirmText="Save"
      onCloseCallback={onCloseCallback}
      onConfirmClick={editProductInstance}
      isProcessing={isProcessing}
      parent_product={parent_product}
      displayName={displayName}
      setDisplayName={setDisplayName}
      description={description}
      setDescription={setDescription}
      shortcode={shortcode}
      setShortcode={setShortcode}
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

export default ProductInstanceEditContainer;