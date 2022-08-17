import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { ProductInstanceActionContainer } from "./product_instance.component";
import { HOST_API } from "../../../config";
import { IProduct, IProductInstance, PriceDisplay } from "@wcp/wcpshared";

interface ProductInstanceEditContainerProps {
  parent_product: IProduct;
  product_instance: IProductInstance;
  onCloseCallback: VoidFunction;
}

const ProductInstanceEditContainer = ({ parent_product, product_instance, onCloseCallback }: ProductInstanceEditContainerProps) => {
  const [displayName, setDisplayName] = useState(product_instance.displayName);
  const [description, setDescription] = useState(product_instance.description);
  const [shortcode, setShortcode] = useState(product_instance.shortcode);
  const [ordinal, setOrdinal] = useState(product_instance.ordinal || 0);
  const [modifiers, setModifiers] = useState(product_instance.modifiers);
  const [isBase, setIsBase] = useState(product_instance.isBase ?? false);
  const [menuOrdinal, setMenuOrdinal] = useState(product_instance.displayFlags.menu?.ordinal || 0);
  const [menuHide, setMenuHide] = useState(product_instance.displayFlags.menu?.hide ?? false);
  const [menuPriceDisplay, setMenuPriceDisplay] = useState(product_instance.displayFlags.menu.price_display ?? PriceDisplay.ALWAYS);
  const [menuAdornment, setMenuAdornment] = useState(product_instance.displayFlags.menu.adornment ?? "");
  const [menuSuppressExhaustiveModifierList, setMenuSuppressExhaustiveModifierList] = useState(product_instance.displayFlags.menu.suppress_exhaustive_modifier_list ?? false);
  const [menuShowModifierOptions, setMenuShowModifierOptions] = useState(product_instance.displayFlags.menu?.show_modifier_options ?? false);
  const [orderOrdinal, setOrderOrdinal] = useState(product_instance.displayFlags.order.ordinal || 0);
  const [orderMenuHide, setOrderMenuHide] = useState(product_instance.displayFlags.order.hide ?? false);
  const [skipCustomization, setSkipCustomization] = useState(product_instance.displayFlags.order.skip_customization ?? false);
  const [orderPriceDisplay, setOrderPriceDisplay] = useState(product_instance.displayFlags.order.price_display ?? PriceDisplay.ALWAYS);
  const [orderAdornment, setOrderAdornment] = useState(product_instance.displayFlags.order.adornment ?? "");
  const [orderSuppressExhaustiveModifierList, setOrderSuppressExhaustiveModifierList] = useState(product_instance.displayFlags.order.suppress_exhaustive_modifier_list ?? false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const editProductInstance = async () => {
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
        }
        const response = await fetch(`${HOST_API}/api/v1/menu/product/${parent_product.id}/${product_instance.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
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