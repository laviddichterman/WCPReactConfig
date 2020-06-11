import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import CategoryComponent from "./category.component";
import { useAuth0 } from "../../react-auth0-spa";



const CategoryAddContainer = ({ ENDPOINT, categories }) => {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [parent, setParent] = useState(null);
  const [parentName, setParentName] = useState("");
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
            name: name,
            parent_id: parent ? parent._id : "",
          }),
        });
        setDescription("");
        setName("");
        setParent(null);
        setParentName("");
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
          onClick={addCategory}
          disabled={name.length === 0 || description.length === 0 || isProcessing}
        >
          Add
        </Button>
      ]}
      categories={categories}
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

export default CategoryAddContainer;
