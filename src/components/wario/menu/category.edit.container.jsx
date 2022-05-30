import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import CategoryComponent from "./category.component";

const CategoryEditContainer = ({ ENDPOINT, categories, category, onCloseCallback }) => {
  const [description, setDescription] = useState(category.description);
  const [name, setName] = useState(category.name);
  const [subheading, setSubheading] = useState(category.subheading);
  const [footnotes, setFootnotes] = useState(category.footnotes);
  const [ordinal, setOrdinal] = useState(category.ordinal || 0);
  const [parent, setParent] = useState(category.parent_id ? categories[category.parent_id] : null);
  const [callLineName, setCallLineName] = useState(category.display_flags?.call_line_name ?? "");
  const [callLineDisplay, setCallLineDisplay] = useState(category.display_flags?.call_line_display ?? "SHORTNAME");
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const editCategory = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${ENDPOINT}/api/v1/menu/category/${category._id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description,
            name,
            ordinal,
            subheading,
            footnotes,
            parent_id: parent ? parent.category._id : "",
            display_flags: {
              call_line_name: callLineName,
              call_line_display: callLineDisplay
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
    <CategoryComponent 
      confirmText="Save"
      onCloseCallback={onCloseCallback}
      onConfirmClick={editCategory}
      isProcessing={isProcessing}
      categories={Object.values(categories).filter(cat => cat.category._id !== category._id)}
      description={description}
      setDescription={setDescription}
      name={name}
      setName={setName}
      ordinal={ordinal}
      setOrdinal={setOrdinal}
      parent={parent}
      setParent={setParent}
      subheading={subheading}
      setSubheading={setSubheading}
      footnotes={footnotes}
      setFootnotes={setFootnotes}
      callLineName={callLineName}
      setCallLineName={setCallLineName}
      callLineDisplay={callLineDisplay}
      setCallLineDisplay={setCallLineDisplay}
    />
  );
};

export default CategoryEditContainer;
