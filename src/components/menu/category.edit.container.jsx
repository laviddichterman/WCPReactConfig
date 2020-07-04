import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import CategoryComponent from "./category.component";
import { useAuth0 } from "../../react-auth0-spa";

const CategoryEditContainer = ({ ENDPOINT, categories, category, onCloseCallback }) => {
  const [description, setDescription] = useState(category.description);
  const [name, setName] = useState(category.name);
  const [parent, setParent] = useState(category.parent_id ? categories[category.parent_id] : null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getTokenSilently } = useAuth0();

  const editCategory = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      console.log(parent);
      setIsProcessing(true);
      try {
        const token = await getTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/category/${category._id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: description,
            name: name,
            parent_id: parent ? parent.category._id : "",
          }),
        });
        setIsProcessing(false);
        onCloseCallback();
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
          onClick={editCategory}
          disabled={name.length === 0 || description.length === 0 || isProcessing}>
          Save
        </Button>
      ]}
      categories={Object.values(categories).filter(cat => cat.category._id !== category._id)}
      description={description}
      setDescription={setDescription}
      name={name}
      setName={setName}
      parent={parent}
      setParent={setParent}
    />
  );
};

export default CategoryEditContainer;
