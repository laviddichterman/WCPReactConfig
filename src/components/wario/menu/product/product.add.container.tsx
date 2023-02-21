import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ProductComponent from "./product.component";
import { HOST_API } from "../../../../config";
import { CURRENCY, IMoney, IProductInstance, IProductModifier, IRecurringInterval, IWInterval, KeyValue, PrepTiming, PriceDisplay, ProductModifierEntry } from "@wcp/wcpshared";
import { ProductInstanceContainer, UncommittedProduct } from "./instance/product_instance.component";
import { useSnackbar } from "notistack";

export interface ProductAddRequestType extends UncommittedProduct {
  instances: Omit<IProductInstance, 'id' | 'productId'>[];
}

interface ProductAddContainerProps {
  onCloseCallback: VoidFunction;
}
const ProductAddContainer = ({ onCloseCallback }: ProductAddContainerProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [ordinal, setOrdinal] = useState(0);
  const [piModifiers, setPiModifiers] = useState<ProductModifierEntry[]>([]);
  const [piExternalIds, setPiExternalIds] = useState<KeyValue[]>([]);
  const [hideFromPos, setHideFromPos] = useState(false);
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


  const [price, setPrice] = useState<IMoney>({ amount: 0, currency: CURRENCY.USD });
  const [externalIds, setExternalIds] = useState<KeyValue[]>([]);
  const [availability, setAvailability] = useState<IRecurringInterval | null>(null);
  const [timing, setTiming] = useState<PrepTiming|null>(null);
  const [disabled, setDisabled] = useState<IWInterval | null>(null);
  const [serviceDisable, setServiceDisable] = useState([]);
  const [flavorMax, setFlavorMax] = useState(10);
  const [bakeMax, setBakeMax] = useState(10);
  const [bakeDifferentialMax, setBakeDifferentialMax] = useState(100);
  const [is3p, setIs3p] = useState(false);
  const [orderGuideSuggestionFunctions, setOrderGuideSuggestionFunctions] = useState<string[]>([]);
  const [orderGuideWarningFunctions, setOrderGuideWarningFunctions] = useState<string[]>([]);
  const [showNameOfBaseProduct, setShowNameOfBaseProduct] = useState(true);
  const [singularNoun, setSingularNoun] = useState("");
  const [parentCategories, setParentCategories] = useState<string[]>([]);
  const [printerGroup, setPrinterGroup] = useState<string|null>(null);
  const [modifiers, setModifiers] = useState<IProductModifier[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const addProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ authorizationParams: { scope: "write:catalog" } });
        const body: ProductAddRequestType = {
          instances: [{
            displayName,
            description,
            shortcode,
            ordinal,
            modifiers: piModifiers,
            externalIDs: piExternalIds,
            displayFlags: {
              hideFromPos,
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
          }],
          disabled,
          availability,
          serviceDisable,
          timing,
          price,
          externalIDs: externalIds,
          displayFlags: {
            is3p,
            bake_differential: bakeDifferentialMax,
            show_name_of_base_product: showNameOfBaseProduct,
            flavor_max: flavorMax,
            bake_max: bakeMax,
            singular_noun: singularNoun,
            order_guide: {
              suggestions: orderGuideSuggestionFunctions,
              warnings: orderGuideWarningFunctions
            }
          },
          category_ids: parentCategories,
          printerGroup,
          modifiers: modifiers,
        };
        const response = await fetch(`${HOST_API}/api/v1/menu/product/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.status === 201) {
          enqueueSnackbar(`Created base product ${displayName}`);
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to create ${displayName}. Got error: ${JSON.stringify(error, null, 2)}.`, { variant: "error" });
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <ProductComponent
      confirmText="Add"
      isEdit={false}
      onCloseCallback={onCloseCallback}
      onConfirmClick={addProduct}
      isProcessing={isProcessing}
      disableConfirmOn={displayName.length === 0 || shortcode.length === 0 || price.amount < 0 || isProcessing}
      externalIds={externalIds}
      setExternalIds={setExternalIds}
      price={price}
      setPrice={setPrice}
      disabled={disabled}
      setDisabled={setDisabled}
      availability={availability}
      setAvailability={setAvailability}
      timing={timing}
      setTiming={setTiming}
      serviceDisable={serviceDisable}
      setServiceDisable={setServiceDisable}
      flavorMax={flavorMax}
      setFlavorMax={setFlavorMax}
      bakeMax={bakeMax}
      setBakeMax={setBakeMax}
      bakeDifferentialMax={bakeDifferentialMax}
      setBakeDifferentialMax={setBakeDifferentialMax}
      is3p={is3p}
      setIs3p={setIs3p}
      orderGuideSuggestionFunctions={orderGuideSuggestionFunctions}
      setOrderGuideSuggestionFunctions={setOrderGuideSuggestionFunctions}
      orderGuideWarningFunctions={orderGuideWarningFunctions}
      setOrderGuideWarningFunctions={setOrderGuideWarningFunctions}
      showNameOfBaseProduct={showNameOfBaseProduct}
      setShowNameOfBaseProduct={setShowNameOfBaseProduct}
      singularNoun={singularNoun}
      setSingularNoun={setSingularNoun}
      parentCategories={parentCategories}
      setParentCategories={setParentCategories}
      printerGroup={printerGroup}
      setPrinterGroup={setPrinterGroup}
      modifiers={modifiers}
      setModifiers={setModifiers}
      children={
        <ProductInstanceContainer
          isProcessing={isProcessing}
          parent_product={{
            category_ids: parentCategories,
            printerGroup,
            disabled,
            availability,
            timing,
            displayFlags: {
              is3p,
              bake_differential: bakeDifferentialMax,
              bake_max: bakeMax,
              flavor_max: flavorMax,
              order_guide: {
                suggestions: orderGuideSuggestionFunctions,
                warnings: orderGuideWarningFunctions,
              },
              show_name_of_base_product: showNameOfBaseProduct,
              singular_noun: singularNoun,
            },
            externalIDs: externalIds,
            modifiers,
            price,
            serviceDisable
          }}
          displayName={displayName}
          setDisplayName={setDisplayName}
          description={description}
          setDescription={setDescription}
          shortcode={shortcode}
          setShortcode={setShortcode}
          externalIds={piExternalIds}
          setExternalIds={setPiExternalIds}
          ordinal={ordinal}
          setOrdinal={setOrdinal}

          modifiers={piModifiers}
          setModifiers={setPiModifiers}

          hideFromPos={hideFromPos}
          setHideFromPos={setHideFromPos}
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
      }
    />
  );
};

export default ProductAddContainer;
