import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ProductComponent from "./product.component";

const ProductCopyContainer = ({ ENDPOINT, modifier_types, product_instance_functions, categories, products, product, onCloseCallback }) => {
  const [displayName, setDisplayName] = useState(product.item?.display_name ?? "");
  const [description, setDescription] = useState(product.item?.description ?? "");
  const [shortcode, setShortcode] = useState(product.item?.shortcode ?? "");
  const [price, setPrice] = useState((product.item?.price.amount ?? 0) / 100);
  const [disabled, setDisabled] = useState(product.item?.disabled);
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
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
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
            display_name: product.item.display_name,
            description: product.item.description,
            shortcode: `${product.item.shortcode  }cpy`,
            price: product.item.price,
            revelID: product.item.externalIDs?.revelID,
            squareID: product.item.externalIDs?.squareID,
            display_flags: {
              bake_differential: product.display_flags.bake_differential,
              show_name_of_base_product: product.display_flags.show_name_of_base_product,
              flavor_max: product.display_flags.flavor_max,
              bake_max: product.display_flags.bake_max,
              singular_noun: product.display_flags.singular_noun,
            },
            category_ids: parentCategories.map(x => x.category._id),
            modifiers: modifiers.map(x => ({ mtid: x.modifier_type._id, enable: Object.hasOwn(modifierEnableFunctions, x.modifier_type._id) && modifierEnableFunctions[x.modifier_type._id] !== null ? modifierEnableFunctions[x.modifier_type._id]._id : null }) ),
            disabled: null,
            create_product_instance: false
          }),
        });
        if (response.status === 201) {
          const json_response = await response.json();
          products[product._id].instances.forEach(async (child_instance) => {
            const add_child_response = await fetch(`${ENDPOINT}/api/v1/menu/product/${json_response._id}`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                display_name: child_instance.item.display_name,
                description: child_instance.item.description,
                shortcode: `${child_instance.item.shortcode}cpy`,
                disabled: child_instance.item.disabled,
                ordinal: child_instance.ordinal,
                price: child_instance.item.price,
                revelID: child_instance.item.externalIDs.revelID,
                squareID: child_instance.item.externalIDs.squareID,
                modifiers: child_instance.modifiers,
                is_base: child_instance.is_base,
                display_flags: {
                  menu: {
                    ordinal: child_instance.display_flags.menu.ordinal,
                    hide: child_instance.display_flags.menu.hide,
                    price_display: child_instance.display_flags.menu.price_display,
                    adornment: child_instance.display_flags.menu.adornment,
                    suppress_exhaustive_modifier_list: child_instance.display_flags.menu.suppress_exhaustive_modifier_list,
                    show_modifier_options: child_instance.display_flags.menu.show_modifier_options
                  },
                  order: {
                    ordinal: child_instance.display_flags.order.ordinal,
                    hide: child_instance.display_flags.order.hide,
                    skip_customization: child_instance.display_flags.order.skip_customization,
                    price_display: child_instance.display_flags.order.price_display,
                    adornment: child_instance.display_flags.order.adornment,
                    suppress_exhaustive_modifier_list: child_instance.display_flags.order.suppress_exhaustive_modifier_list
                  }
                }
              }),
            });
            if (add_child_response.status !== 201) {
              console.log("ERROR in creating child instance");
            }
          });
        }
        setIsProcessing(false);
        onCloseCallback();
      } catch (error) {
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <ProductComponent 
      confirmText="Save"
      onCloseCallback={onCloseCallback}
      onConfirmClick={copyProduct}
      isProcessing={isProcessing}
      disableConfirmOn={displayName.length === 0 || isProcessing}
      modifier_types={modifier_types}
      product_instance_functions={product_instance_functions}
      categories={categories}
      productCopyMode
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
    />
  );
};

export default ProductCopyContainer;