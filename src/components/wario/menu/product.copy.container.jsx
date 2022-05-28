import React, { useCallback, useMemo, useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { Accordion, AccordionSummary, AccordionDetails, Grid, Typography, Switch, FormControlLabel } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import ProductComponent from "./product.component";
import { ProductInstanceContainer } from "./product_instance.component";

const useIndexedState = (x) => {
  const [state, setter] = x;
  return [state, (i) => (v) => {
    const cpy = state.slice();
    cpy[i] = v;
    setter(cpy)
  }];
};

const ProductCopyContainer = ({ ENDPOINT, modifier_types, services, product_instance_functions, categories, products, product, onCloseCallback }) => {
  const [displayName, setDisplayName] = useState(product.item?.display_name ?? "");
  const [description, setDescription] = useState(product.item?.description ?? "");
  const [shortcode, setShortcode] = useState(`${product.item?.shortcode ?? ""}cpy`);
  const [price, setPrice] = useState((product.item?.price.amount ?? 0) / 100);
  const [disabled, setDisabled] = useState(product.item?.disabled);
  const [serviceDisabled, setServiceDisabled] = useState(product.service_disable)
  const [ordinal, setOrdinal] = useState(product.ordinal || 0);
  const [revelID, setRevelID] = useState(product.item?.externalIDs?.revelID ?? "");
  const [squareID, setSquareID] = useState(product.item?.externalIDs?.squareID ?? "");
  const [flavorMax, setFlavorMax] = useState(product.display_flags?.flavor_max ?? 10);
  const [bakeMax, setBakeMax] = useState(product.display_flags?.bake_max ?? 10);
  const [bakeDifferentialMax, setBakeDifferentialMax] = useState(product.display_flags?.bake_differential ?? 100);
  const [showNameOfBaseProduct, setShowNameOfBaseProduct] = useState(product.display_flags?.show_name_of_base_product ?? true);
  const [singularNoun, setSingularNoun] = useState(product.display_flags?.singular_noun ?? "");
  const [parentCategories, setParentCategories] = useState(Object.values(categories).filter(x => product.category_ids.includes(x.category._id.toString())));
  const [modifiers, setModifiers] = useState(product.modifiers.map((v) => Object.values(modifier_types).find(x => x.modifier_type._id.toString() === v.mtid)));
  // create an Object mapping MTID to enable function object
  const [modifierEnableFunctions, setModifierEnableFunctions] = useState(product.modifiers.reduce((o, entry) => Object.assign(o, {[entry.mtid]: entry.enable ?? null }), {}));

  // product instance indexed state
  const [expandedPanels, setExpandedPanel] = useIndexedState(useState(Array(products[product._id].instances.length).fill(false)));
  const [copyPIFlags, setCopyPIFlag] = useIndexedState(useState(Array(products[product._id].instances.length).fill(true)));
  const [piDisplayNames, setPiDisplayName] = useIndexedState(useState(products[product._id].instances.map(pi=>pi.item.display_name)));
  const [piDescriptions, setPiDescription] = useIndexedState(useState(products[product._id].instances.map(pi=>pi.item.description)));
  const [piShortcodes, setPiShortcode] = useIndexedState(useState(products[product._id].instances.map(pi=>pi.item.shortcode)));
  const [piPrices, setPiPrice] = useIndexedState(useState(products[product._id].instances.map(pi=>(pi.item.price.amount / 100))));
  const [piOrdinals, setPiOrdinal] = useIndexedState(useState(products[product._id].instances.map(pi=>(pi.ordinal || 0))));
  const [piRevelIDs, setPiRevelID] = useIndexedState(useState(products[product._id].instances.map(pi=>(pi.item?.externalIDs?.revelID ?? ""))));
  const [piSquareIDs, setPiSquareID] = useIndexedState(useState(products[product._id].instances.map(pi=>(pi.item?.externalIDs?.squareID ?? ""))));
  const [piModifierss, setPiModifiers] = useIndexedState(useState(products[product._id].instances.map(pi=>pi.modifiers)));
  const [piIsBases, setPiIsBase] = useIndexedState(useState(products[product._id].instances.map(pi=>(pi.is_base ?? false))));
  const [piMenuOrdinals, setPiMenuOrdinal] = useIndexedState(useState(products[product._id].instances.map(pi=>(pi.display_flags?.menu?.ordinal || 0))));
  const [piMenuHides, setPiMenuHide] = useIndexedState(useState(products[product._id].instances.map(pi=>(pi.display_flags?.menu?.hide ?? false))));
  const [piMenuPriceDisplays, setPiMenuPriceDisplay] = useIndexedState(useState(products[product._id].instances.map(pi=>(pi.display_flags?.menu?.price_display ?? "IF_COMPLETE"))));
  const [piMenuAdornments, setPiMenuAdornment] = useIndexedState(useState(products[product._id].instances.map(pi=>(pi.display_flags?.menu?.adornment ?? ""))));
  const [piMenuSuppressExhaustiveModifierLists, setPiMenuSuppressExhaustiveModifierList] = useIndexedState(useState(products[product._id].instances.map(pi=>(pi.display_flags?.menu?.suppress_exhaustive_modifier_list ?? false))));
  const [piMenuShowModifierOptionss, setPiMenuShowModifierOptions] = useIndexedState(useState(products[product._id].instances.map(pi=>(pi.display_flags?.menu?.show_modifier_options ?? false))));
  const [piOrderOrdinals, setPiOrderOrdinal] = useIndexedState(useState(products[product._id].instances.map(pi=>(pi.display_flags?.order?.ordinal || 0) )));
  const [piOrderMenuHides, setPiOrderMenuHide] = useIndexedState(useState(products[product._id].instances.map(pi=>(pi.display_flags?.order?.hide ?? false))));
  const [piSkipCustomizations, setPiSkipCustomization] = useIndexedState(useState(products[product._id].instances.map(pi=>pi.display_flags?.order?.skip_customization ?? false)));
  const [piOrderPriceDisplays, setPiOrderPriceDisplay] = useIndexedState(useState(products[product._id].instances.map(pi=>pi.display_flags?.order?.price_display ?? "IF_COMPLETE")));
  const [piOrderAdornments, setPiOrderAdornment] = useIndexedState(useState(products[product._id].instances.map(pi=>pi.display_flags?.order?.adornment ?? "")));
  const [piOrderSuppressExhaustiveModifierLists, setPiOrderSuppressExhaustiveModifierList] = useIndexedState(useState(products[product._id].instances.map(pi=>pi.display_flags?.order?.suppress_exhaustive_modifier_list ?? false)));

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

  const getProductInstanceEditor = useCallback((i) => (
  <Accordion sx={{p:2}} key={i} expanded={expandedPanels[i] && copyPIFlags[i]} onChange={(e, ex) => setExpandedPanel(i)(ex)}  >
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Grid container>
        <Grid item xs>
          <Typography sx={{ml: 4}}>{piDisplayNames[i]}</Typography>
        </Grid>
        <Grid item xs={2}>
        <FormControlLabel sx={{float:"right"}} control={
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
          modifier_types_map={modifier_types}
          displayName={piDisplayNames[i]}
          setDisplayName={setPiDisplayName(i)}
          description={piDescriptions[i]}
          setDescription={setPiDescription(i)}
          shortcode={piShortcodes[i]}
          setShortcode={setPiShortcode(i)}
          price={piPrices[i]}
          setPrice={setPiPrice(i)}
          ordinal={piOrdinals[i]}
          setOrdinal={setPiOrdinal(i)}
          revelID={piRevelIDs[i]}
          setRevelID={setPiRevelID(i)}
          squareID={piSquareIDs[i]}
          setSquareID={setPiSquareID(i)}
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
  </Accordion>), [copyPIFlags, expandedPanels, modifier_types, piDescriptions, piDisplayNames, piIsBases, piMenuAdornments, piMenuHides, piMenuOrdinals, piMenuPriceDisplays, piMenuShowModifierOptionss, piMenuSuppressExhaustiveModifierLists, piModifierss, piOrderAdornments, piOrderMenuHides, piOrderOrdinals, piOrderPriceDisplays, piOrderSuppressExhaustiveModifierLists, piOrdinals, piPrices, piRevelIDs, piShortcodes, piSkipCustomizations, piSquareIDs, product, setCopyPIFlag, setExpandedPanel, setPiDescription, setPiDisplayName, setPiIsBase, setPiMenuAdornment, setPiMenuHide, setPiMenuOrdinal, setPiMenuPriceDisplay, setPiMenuShowModifierOptions, setPiMenuSuppressExhaustiveModifierList, setPiModifiers, setPiOrderAdornment, setPiOrderMenuHide, setPiOrderOrdinal, setPiOrderPriceDisplay, setPiOrderSuppressExhaustiveModifierList, setPiOrdinal, setPiPrice, setPiRevelID, setPiShortcode, setPiSkipCustomization, setPiSquareID])

  const copyProduct = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${ENDPOINT}/api/v1/menu/product/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            display_name: displayName,
            description,
            shortcode,
            price: { amount: price * 100, currency: "USD" },
            service_disable: serviceDisabled,
            revelID,
            squareID,
            display_flags: {
              bake_differential: bakeDifferentialMax,
              show_name_of_base_product: showNameOfBaseProduct,
              flavor_max: flavorMax,
              bake_max: bakeMax,
              singular_noun: singularNoun,
            },
            category_ids: parentCategories.map(x => x.category._id),
            modifiers: modifiers.map(x => ({ mtid: x.modifier_type._id, enable: Object.hasOwn(modifierEnableFunctions, x.modifier_type._id) && modifierEnableFunctions[x.modifier_type._id] !== null ? modifierEnableFunctions[x.modifier_type._id]._id : null }) ),
            disabled,
            create_product_instance: false
          }),
        });
        if (response.status === 201) {
          const json_response = await response.json();
          const parent_id = json_response._id;
          await new Promise((res) => setTimeout(res, 200));
          const create_child_requests = [];
          const addChildIndex = (i) => {
            const add_child_body = JSON.stringify({
              display_name: piDisplayNames[i],
              description: piDescriptions[i],
              shortcode: piShortcodes[i],
              ordinal: piOrdinals[i],
              price: { amount: piPrices[i] * 100, currency: "USD" },
              revelID: piRevelIDs[i],
              squareID: piSquareIDs[i],
              modifiers: piModifierss[i],
              is_base: piIsBases[i],
              display_flags: {
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
            return fetch(`${ENDPOINT}/api/v1/menu/product/${parent_id}`, {
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

          products[product._id].instances.forEach(async (child, i) => {
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
      disableConfirmOn={displayName.length === 0 || shortcode.length === 0 || price < 0 || indexOfBase === -1 || isProcessing}
      modifier_types={modifier_types}
      product_instance_functions={product_instance_functions}
      categories={categories}
      services={services}
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
      serviceDisabled={serviceDisabled}
      setServiceDisabled={setServiceDisabled}
      ordinal={ordinal}
      setOrdinal={setOrdinal}
      revelID={revelID}
      setRevelID={setRevelID}
      squareID={squareID}
      setSquareID={setSquareID}
      flavorMax={flavorMax}
      setFlavorMax={setFlavorMax}
      bakeMax={bakeMax}
      setBakeMax={setBakeMax}
      bakeDifferentialMax={bakeDifferentialMax}
      setBakeDifferentialMax={setBakeDifferentialMax}
      showNameOfBaseProduct={showNameOfBaseProduct}
      setShowNameOfBaseProduct={setShowNameOfBaseProduct}
      singularNoun={singularNoun}
      setSingularNoun={setSingularNoun}
      parentCategories={parentCategories}
      setParentCategories={setParentCategories}
      modifiers={modifiers}
      setModifiers={setModifiers}
      modifierEnableFunctions={modifierEnableFunctions}
      setModifierEnableFunctions={setModifierEnableFunctions}
      children={ 
        products[product._id].instances.map((pi, i) => 
          getProductInstanceEditor(i)
      )
      }
    />
  );
};

export default ProductCopyContainer;