import React, { useState } from "react";

import Button from "@mui/material/Button";
import CategoryComponent from "./category.component";
import { useAuth0 } from '@auth0/auth0-react';

const CategoryAddContainer = ({ ENDPOINT, categories, onCloseCallback }) => {
  const [description, setDescription] = useState("");
  const [subheading, setSubheading] = useState("");
  const [footnotes, setFootnotes] = useState("");
  const [name, setName] = useState("");
  const [ordinal, setOrdinal] = useState(0);
  const [parent, setParent] = useState(null);
  const [callLineName, setCallLineName] = useState("");
  const [callLineDisplay, setCallLineDisplay] = useState("SHORTNAME");
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const addCategory = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${ENDPOINT}/api/v1/menu/category`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: description,
            subheading: subheading,
            footnotes: footnotes,
            name: name,
            ordinal: ordinal,
            parent_id: parent ? parent.category._id : "",
            display_flags: {
              call_line_name: callLineName,
              call_line_display: callLineDisplay
            }
          }),
        });
        if (response.status === 201) {
          setDescription("");
          setName("");
          setSubheading("");
          setFootnotes("");
          setOrdinal(0);
          setParent(null);
          setCallLineName("");
          setCallLineDisplay("SHORTNAME");
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
      actions={[
        <Button
          className="btn btn-light"
          onClick={onCloseCallback}
          disabled={isProcessing}>
          Cancel
        </Button>,
        <Button
          className="btn btn-light"
          onClick={addCategory}
          disabled={name.length === 0 || ordinal < 0 || isProcessing}
        >
          Add
        </Button>
      ]}
      categories={Object.values(categories)}
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

export default CategoryAddContainer;
