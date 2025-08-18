import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { getProductInstanceById } from "@wcp/wario-ux-shared";
import { IProductInstance, PriceDisplay } from "@wcp/wcpshared";
import { useSnackbar } from "notistack";
import { HOST_API } from "../../../../../config";
import { useAppSelector } from "../../../../../hooks/useRedux";
import { selectParentProductEntryFromProductInstanceId } from "../../../../../redux/store";
import { ProductInstanceActionContainer } from "./product_instance.component";

interface ProductInstanceEditContainerProps {
  product_instance_id: string;
  onCloseCallback: VoidFunction;
}

const ProductInstanceEditContainer = ({ product_instance_id, onCloseCallback }: ProductInstanceEditContainerProps) => {
  const product_instance = useAppSelector(s => getProductInstanceById(s.ws.productInstances, product_instance_id)!);
  const parent_product = useAppSelector(s => selectParentProductEntryFromProductInstanceId(s, product_instance_id)!.product);
  const { enqueueSnackbar } = useSnackbar();
  const [displayName, setDisplayName] = useState(product_instance.displayName);
  const [description, setDescription] = useState(product_instance.description);
  const [shortcode, setShortcode] = useState(product_instance.shortcode);
  const [ordinal, setOrdinal] = useState(product_instance.ordinal || 0);
  const [modifiers, setModifiers] = useState(product_instance.modifiers);
  const [externalIds, setExternalIds] = useState(product_instance.externalIDs);
  const [hideFromPos, setHideFromPos] = useState(product_instance.displayFlags.pos.hide ?? false);
  const [posName, setPosName] = useState(product_instance.displayFlags.pos.name ?? "");
  const [menuOrdinal, setMenuOrdinal] = useState(product_instance.displayFlags.menu?.ordinal || 0);
  const [menuHide, setMenuHide] = useState(product_instance.displayFlags.menu?.hide ?? false);
  const [menuPriceDisplay, setMenuPriceDisplay] = useState(product_instance.displayFlags.menu.price_display ?? PriceDisplay.ALWAYS);
  const [menuAdornment, setMenuAdornment] = useState(product_instance.displayFlags.menu.adornment ?? "");
  const [menuSuppressExhaustiveModifierList, setMenuSuppressExhaustiveModifierList] = useState(product_instance.displayFlags.menu.suppress_exhaustive_modifier_list ?? false);
  const [menuShowModifierOptions, setMenuShowModifierOptions] = useState(product_instance.displayFlags.menu?.show_modifier_options ?? false);
  const [orderOrdinal, setOrderOrdinal] = useState(product_instance.displayFlags.order.ordinal || 0);
  const [orderMenuHide, setOrderMenuHide] = useState(product_instance.displayFlags.order.hide ?? false);
  const [orderSkipCustomization, setOrderSkipCustomization] = useState(product_instance.displayFlags.order.skip_customization ?? false);
  const [posSkipCustomization, setPosSkipCustomization] = useState(product_instance.displayFlags.pos.skip_customization ?? false);
  const [orderPriceDisplay, setOrderPriceDisplay] = useState(product_instance.displayFlags.order.price_display ?? PriceDisplay.ALWAYS);
  const [orderAdornment, setOrderAdornment] = useState(product_instance.displayFlags.order.adornment ?? "");
  const [orderSuppressExhaustiveModifierList, setOrderSuppressExhaustiveModifierList] = useState(product_instance.displayFlags.order.suppress_exhaustive_modifier_list ?? false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const editProductInstance = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ authorizationParams: { scope: "write:catalog" } });
        const body: Omit<IProductInstance, 'id' | 'productId'> = {
          displayName,
          description,
          shortcode,
          ordinal,
          modifiers,
          externalIDs: externalIds,
          displayFlags: {
            pos: {
              hide: hideFromPos,
              name: posName,
              skip_customization: posSkipCustomization
            },
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
              skip_customization: orderSkipCustomization,
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
          enqueueSnackbar(`Updated ${displayName}.`)
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to update ${displayName}. Got error: ${JSON.stringify(error)}.`, { variant: "error" });
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
      externalIds={externalIds}
      setExternalIds={setExternalIds}
      // pos
      hideFromPos={hideFromPos}
      setHideFromPos={setHideFromPos}
      posName={posName}
      setPosName={setPosName}
      posSkipCustomization={posSkipCustomization}
      setPosSkipCustomization={setPosSkipCustomization}
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
      orderSkipCustomization={orderSkipCustomization}
      setOrderSkipCustomization={setOrderSkipCustomization}
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