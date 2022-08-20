import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { ProductInstanceActionContainer } from "./product_instance.component";
import { IProduct, IProductInstance, ModifiersMap, PriceDisplay } from "@wcp/wcpshared";
import { HOST_API } from "../../../config";

interface ProductInstanceAddContainerProps {
  parent_product: IProduct;
  onCloseCallback: VoidFunction;
}

const ProductInstanceAddContainer = ({ parent_product, onCloseCallback }: ProductInstanceAddContainerProps) => {
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [ordinal, setOrdinal] = useState(0);
  const [modifiers, setModifiers] = useState<ModifiersMap>({});
  const [isBase, setIsBase] = useState(false);
  // menu
  const [menuOrdinal, setMenuOrdinal] = useState(0);
  const [menuHide, setMenuHide] = useState(false);
  const [menuPriceDisplay, setMenuPriceDisplay] = useState<PriceDisplay>(PriceDisplay.ALWAYS);
  const [menuAdornment, setMenuAdornment] = useState("");
  const [menuSuppressExhaustiveModifierList, setMenuSuppressExhaustiveModifierList] = useState(false);
  const [menuShowModifierOptions, setMenuShowModifierOptions] = useState(false);

  // order
  const [orderOrdinal, setOrderOrdinal] = useState(0);
  const [orderMenuHide, setOrderMenuHide] = useState(false);
  const [skipCustomization, setSkipCustomization] = useState(true);
  const [orderPriceDisplay, setOrderPriceDisplay] = useState<PriceDisplay>(PriceDisplay.ALWAYS);
  const [orderAdornment, setOrderAdornment] = useState("");
  const [orderSuppressExhaustiveModifierList, setOrderSuppressExhaustiveModifierList] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const addProductInstance = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const body: Omit<IProductInstance, 'id' | 'productId'> = {
          displayName,
          description,
          shortcode,
          ordinal,
          modifiers,
          isBase,
          externalIDs: {},
          displayFlags: {
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
        };
        const response = await fetch(`${HOST_API}/api/v1/menu/product/${parent_product.id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body)
        });
        if (response.status === 201) {
          setDisplayName("");
          setDescription("");
          setShortcode("");
          setOrdinal(0);
          setModifiers({});
          setIsBase(false);
          setMenuOrdinal(0);
          setMenuHide(false);
          setMenuPriceDisplay(PriceDisplay.ALWAYS);
          setMenuAdornment("");
          setMenuSuppressExhaustiveModifierList(false);
          setMenuShowModifierOptions(false);
          setOrderOrdinal(0);
          setOrderMenuHide(false);
          setSkipCustomization(false);
          setOrderPriceDisplay(PriceDisplay.ALWAYS);
          setOrderAdornment("");
          setOrderSuppressExhaustiveModifierList(false);
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
      confirmText="Add"
      onCloseCallback={onCloseCallback}
      onConfirmClick={addProductInstance}
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
