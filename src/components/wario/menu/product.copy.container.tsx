import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { Accordion, AccordionSummary, AccordionDetails, Grid, Typography, Switch, FormControlLabel } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import ProductComponent from "./product.component";
import { ProductInstanceContainer } from "./product_instance.component";
import { HOST_API } from "../../../config";
import { useAppSelector } from "../../../hooks/useRedux";
import { IProduct, IProductInstance } from "@wcp/wcpshared";

type ProductCopyRequestType = Omit<IProduct, "id"> & { create_product_instance: boolean; suppress_catalog_recomputation: boolean; };

function useIndexedState<S>(x: [S[], Dispatch<SetStateAction<S[]>>]) {
  return [x[0], (i: number) => (v: S) => {
    const cpy = x[0].slice();
    cpy[i] = v;
    x[1](cpy)
  }] as const;
};
export interface ProductCopyContainerProps {
  product: IProduct;
  onCloseCallback: VoidFunction;
};
const ProductCopyContainer = ({ product, onCloseCallback }: ProductCopyContainerProps) => {
  const product_instances = useAppSelector(s => s.ws.catalog?.products[product.id].instances ?? []);
  const [price, setPrice] = useState(product.price);
  const [disabled, setDisabled] = useState(product.disabled ?? null);
  const [serviceDisable, setServiceDisable] = useState(product.serviceDisable)
  const [flavorMax, setFlavorMax] = useState(product.displayFlags?.flavor_max ?? 10);
  const [bakeMax, setBakeMax] = useState(product.displayFlags?.bake_max ?? 10);
  const [bakeDifferentialMax, setBakeDifferentialMax] = useState(product.displayFlags?.bake_differential ?? 100);
  const [orderGuideSuggestionFunctions, setOrderGuideSuggestionFunctions] = useState(product.displayFlags.order_guide.suggestions);
  const [orderGuideWarningFunctions, setOrderGuideWarningFunctions] = useState(product.displayFlags.order_guide.warnings);
  const [showNameOfBaseProduct, setShowNameOfBaseProduct] = useState(product.displayFlags?.show_name_of_base_product ?? true);
  const [singularNoun, setSingularNoun] = useState(product.displayFlags?.singular_noun ?? "");
  const [parentCategories, setParentCategories] = useState(product.category_ids);
  const [modifiers, setModifiers] = useState(product.modifiers);

  // product instance indexed state
  const [expandedPanels, setExpandedPanel] = useIndexedState(useState(Array(product_instances.length).fill(false)));
  const [copyPIFlags, setCopyPIFlag] = useIndexedState(useState(Array(product_instances.length).fill(true)));
  const [piDisplayNames, setPiDisplayName] = useIndexedState(useState(product_instances.map(pi => pi.displayName)));
  const [piDescriptions, setPiDescription] = useIndexedState(useState(product_instances.map(pi => pi.description)));
  const [piShortcodes, setPiShortcode] = useIndexedState(useState(product_instances.map(pi => pi.shortcode)));
  const [piOrdinals, setPiOrdinal] = useIndexedState(useState(product_instances.map(pi => (pi.ordinal || 0))));
  const [piModifierss, setPiModifiers] = useIndexedState(useState(product_instances.map(pi => pi.modifiers)));
  const [piIsBases, setPiIsBase] = useIndexedState(useState(product_instances.map(pi => (pi.isBase ?? false))));
  const [piMenuOrdinals, setPiMenuOrdinal] = useIndexedState(useState(product_instances.map(pi => (pi.displayFlags?.menu?.ordinal || 0))));
  const [piMenuHides, setPiMenuHide] = useIndexedState(useState(product_instances.map(pi => (pi.displayFlags?.menu?.hide ?? false))));
  const [piMenuPriceDisplays, setPiMenuPriceDisplay] = useIndexedState(useState(product_instances.map(pi => (pi.displayFlags?.menu?.price_display ?? "IF_COMPLETE"))));
  const [piMenuAdornments, setPiMenuAdornment] = useIndexedState(useState(product_instances.map(pi => (pi.displayFlags?.menu?.adornment ?? ""))));
  const [piMenuSuppressExhaustiveModifierLists, setPiMenuSuppressExhaustiveModifierList] = useIndexedState(useState(product_instances.map(pi => (pi.displayFlags?.menu?.suppress_exhaustive_modifier_list ?? false))));
  const [piMenuShowModifierOptionss, setPiMenuShowModifierOptions] = useIndexedState(useState(product_instances.map(pi => (pi.displayFlags?.menu?.show_modifier_options ?? false))));
  const [piOrderOrdinals, setPiOrderOrdinal] = useIndexedState(useState(product_instances.map(pi => (pi.displayFlags?.order?.ordinal || 0))));
  const [piOrderMenuHides, setPiOrderMenuHide] = useIndexedState(useState(product_instances.map(pi => (pi.displayFlags?.order?.hide ?? false))));
  const [piSkipCustomizations, setPiSkipCustomization] = useIndexedState(useState(product_instances.map(pi => pi.displayFlags?.order?.skip_customization ?? false)));
  const [piOrderPriceDisplays, setPiOrderPriceDisplay] = useIndexedState(useState(product_instances.map(pi => pi.displayFlags?.order?.price_display ?? "IF_COMPLETE")));
  const [piOrderAdornments, setPiOrderAdornment] = useIndexedState(useState(product_instances.map(pi => pi.displayFlags?.order?.adornment ?? "")));
  const [piOrderSuppressExhaustiveModifierLists, setPiOrderSuppressExhaustiveModifierList] = useIndexedState(useState(product_instances.map(pi => pi.displayFlags?.order?.suppress_exhaustive_modifier_list ?? false)));

  // API state
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const indexOfBase = useMemo(() => {
    let idxOfBase = -1;
    let numBase = 0;
    piIsBases.forEach((base, i) => {
      if (base && copyPIFlags[i]) {
        idxOfBase = i;
        numBase += 1;
      }
    });
    return numBase === 1 ? idxOfBase : -1;
  }, [piIsBases, copyPIFlags]);

  const getProductInstanceEditor = useCallback((i: number) => (
    <Accordion sx={{ p: 2 }} key={i} expanded={expandedPanels[i] && copyPIFlags[i]} onChange={(e, ex) => setExpandedPanel(i)(ex)}  >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Grid container>
          <Grid item xs>
            <Typography sx={{ ml: 4 }}>{piDisplayNames[i]}</Typography>
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel sx={{ float: "right" }} control={
              <Switch
                checked={copyPIFlags[i]}
                onChange={(e) => setCopyPIFlag(i)(e.target.checked)}
                name="Copy"
              />
            }
              label="Copy"
            />
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3} justifyContent="center">
          <ProductInstanceContainer
            parent_product={product}
            displayName={piDisplayNames[i]}
            setDisplayName={setPiDisplayName(i)}
            description={piDescriptions[i]}
            setDescription={setPiDescription(i)}
            shortcode={piShortcodes[i]}
            setShortcode={setPiShortcode(i)}
            ordinal={piOrdinals[i]}
            setOrdinal={setPiOrdinal(i)}
            isBase={piIsBases[i]}
            setIsBase={setPiIsBase(i)}
            modifiers={piModifierss[i]}
            setModifiers={setPiModifiers(i)}

            // menu
            menuOrdinal={piMenuOrdinals[i]}
            setMenuOrdinal={setPiMenuOrdinal(i)}
            menuHide={piMenuHides[i]}
            setMenuHide={setPiMenuHide(i)}
            menuPriceDisplay={piMenuPriceDisplays[i]}
            setMenuPriceDisplay={setPiMenuPriceDisplay(i)}
            menuAdornment={piMenuAdornments[i]}
            setMenuAdornment={setPiMenuAdornment(i)}
            menuSuppressExhaustiveModifierList={piMenuSuppressExhaustiveModifierLists[i]}
            setMenuSuppressExhaustiveModifierList={setPiMenuSuppressExhaustiveModifierList(i)}
            menuShowModifierOptions={piMenuShowModifierOptionss[i]}
            setMenuShowModifierOptions={setPiMenuShowModifierOptions(i)}
            // order
            orderOrdinal={piOrderOrdinals[i]}
            setOrderOrdinal={setPiOrderOrdinal(i)}
            orderMenuHide={piOrderMenuHides[i]}
            setOrderMenuHide={setPiOrderMenuHide(i)}
            skipCustomization={piSkipCustomizations[i]}
            setSkipCustomization={setPiSkipCustomization(i)}
            orderPriceDisplay={piOrderPriceDisplays[i]}
            setOrderPriceDisplay={setPiOrderPriceDisplay(i)}
            orderAdornment={piOrderAdornments[i]}
            setOrderAdornment={setPiOrderAdornment(i)}
            orderSuppressExhaustiveModifierList={piOrderSuppressExhaustiveModifierLists[i]}
            setOrderSuppressExhaustiveModifierList={setPiOrderSuppressExhaustiveModifierList(i)}
          />
        </Grid>
      </AccordionDetails>
    </Accordion>), [copyPIFlags, expandedPanels, piDescriptions, piDisplayNames, piIsBases, piMenuAdornments, piMenuHides, piMenuOrdinals, piMenuPriceDisplays, piMenuShowModifierOptionss, piMenuSuppressExhaustiveModifierLists, piModifierss, piOrderAdornments, piOrderMenuHides, piOrderOrdinals, piOrderPriceDisplays, piOrderSuppressExhaustiveModifierLists, piOrdinals, piShortcodes, piSkipCustomizations, product, setCopyPIFlag, setExpandedPanel, setPiDescription, setPiDisplayName, setPiIsBase, setPiMenuAdornment, setPiMenuHide, setPiMenuOrdinal, setPiMenuPriceDisplay, setPiMenuShowModifierOptions, setPiMenuSuppressExhaustiveModifierList, setPiModifiers, setPiOrderAdornment, setPiOrderMenuHide, setPiOrderOrdinal, setPiOrderPriceDisplay, setPiOrderSuppressExhaustiveModifierList, setPiOrdinal, setPiShortcode, setPiSkipCustomization])

  const copyProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const productCopyBody: ProductCopyRequestType = {
          price: price,
          serviceDisable,
          externalIDs: {},
          displayFlags: {
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
          modifiers: modifiers,
          disabled,
          create_product_instance: false,
          suppress_catalog_recomputation: true
        };
        const response = await fetch(`${HOST_API}/api/v1/menu/product/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productCopyBody),
        });
        if (response.status === 201) {
          const json_response = await response.json();
          const parent_id = json_response._id;
          await new Promise((res) => setTimeout(res, 200));
          const create_child_requests: Promise<void>[] = [];
          const addChildIndex = (i: number) => {
            const add_child_body = JSON.stringify({
              display_name: piDisplayNames[i],
              description: piDescriptions[i],
              shortcode: piShortcodes[i],
              ordinal: piOrdinals[i],
              price: null,
              modifiers: piModifierss[i],
              is_base: piIsBases[i],
              displayFlags: {
                menu: {
                  ordinal: piMenuOrdinals[i],
                  hide: piMenuHides[i],
                  price_display: piMenuPriceDisplays[i],
                  adornment: piMenuAdornments[i],
                  suppress_exhaustive_modifier_list: piMenuSuppressExhaustiveModifierLists[i],
                  show_modifier_options: piMenuShowModifierOptionss[i]
                },
                order: {
                  ordinal: piOrderOrdinals[i],
                  hide: piOrderMenuHides[i],
                  skip_customization: piSkipCustomizations[i],
                  price_display: piOrderPriceDisplays[i],
                  adornment: piOrderAdornments[i],
                  suppress_exhaustive_modifier_list: piOrderSuppressExhaustiveModifierLists[i]
                }
              }
            });
            return fetch(`${HOST_API}/api/v1/menu/product/${parent_id}`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: add_child_body
            }).then(async (res) => {
              const pid = (await res.json())._id;
              console.log(`Created product instance ${piDisplayNames[i]} with ID ${pid}`);
            }).catch(err => {
              console.error(err);
            });
          }

          await addChildIndex(indexOfBase);

          product_instances.forEach(async (child, i) => {
            if (copyPIFlags[i] && indexOfBase !== i) {
              create_child_requests.push(addChildIndex(i));
            }
          });

          await Promise.all(create_child_requests);
          setIsProcessing(false);
          onCloseCallback();
        }
        else {
          console.error("Create Product Class request failed");
        }
      } catch (error) {
        console.error(error);
      }
      setIsProcessing(false);
    }
  };
  return (
    <ProductComponent
      confirmText="Save"
      onCloseCallback={onCloseCallback}
      onConfirmClick={copyProduct}
      isProcessing={isProcessing}
      disableConfirmOn={price.amount < 0 || indexOfBase === -1 || isProcessing}
      suppressNonProductInstanceFields
      price={price}
      setPrice={setPrice}
      disabled={disabled}
      setDisabled={setDisabled}
      serviceDisable={serviceDisable}
      setServiceDisable={setServiceDisable}
      flavorMax={flavorMax}
      setFlavorMax={setFlavorMax}
      bakeMax={bakeMax}
      setBakeMax={setBakeMax}
      bakeDifferentialMax={bakeDifferentialMax}
      setBakeDifferentialMax={setBakeDifferentialMax}
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
      modifiers={modifiers}
      setModifiers={setModifiers}
      children={product_instances.map((_, i) => getProductInstanceEditor(i)
      )}
    />
  );
};

export default ProductCopyContainer;