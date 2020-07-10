import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import CategoryComponent from "./category.component";
import { useAuth0 } from "../../react-auth0-spa";

const CategoryAddContainer = ({ ENDPOINT, categories, onCloseCallback }) => {
  const [description, setDescription] = useState("");
  const [subheading, setSubheading] = useState("");
  const [name, setName] = useState("");
  const [ordinal, setOrdinal] = useState(0);
  const [parent, setParent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getTokenSilently } = useAuth0();

  const addCategory = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/category`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: description,
            subheading: subheading,
            name: name,
            ordinal: ordinal,
            parent_id: parent ? parent.category._id : "",
          }),
        });
        if (response.status === 201) {
          setDescription("");
          setName("");
          setSubheading("");
          setOrdinal(0);
          setParent(null);
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
    />
  );
};

export default CategoryAddContainer;
