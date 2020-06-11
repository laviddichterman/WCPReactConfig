import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import CategoryComponent from "./category.component";
import { useAuth0 } from "../../react-auth0-spa";

const FindParent = (categories, category) => {
  const parent = category.parent_id ? categories.find(cat => category.parent_id === cat._id) : null;
  return parent ? parent : null;
}

const CategoryEditContainer = ({ ENDPOINT, categories, category }) => {
  // filter out this category so we don't generate a circular reference loop
  const filtered_categories = categories.filter(cat => cat._id !== category._id);
  const foundParent = FindParent(categories, category);
  const [description, setDescription] = useState(category.description);
  const [name, setName] = useState(category.name);
  const [parent, setParent] = useState(foundParent);
  const [parentName, setParentName] = useState(foundParent ? foundParent.name : "");
  const [isProcessing, setIsProcessing] = useState(false);
  const { getTokenSilently } = useAuth0();

  const editCategory = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
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
            parent_id: parent ? parent._id : "",
          }),
        });
        //setParent(response);
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
          onClick={editCategory}
          disabled={name.length === 0 || description.length === 0 || isProcessing}>
          Save
        </Button>
      ]}
      categories={filtered_categories}
      description={description}
      setDescription={setDescription}
      name={name}
      setName={setName}
      parent={parent}
      setParent={setParent}
      parentName={parentName}
      setParentName={setParentName}      
    />
  );
};

export default CategoryEditContainer;
