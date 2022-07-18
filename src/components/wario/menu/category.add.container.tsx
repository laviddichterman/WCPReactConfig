import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import CategoryComponent from "./category.component";
import { HOST_API } from "../../../config";
import { CALL_LINE_DISPLAY } from "@wcp/wcpshared";
import { useAppSelector } from "src/hooks/useRedux";
import { getCategoryIds } from "src/redux/slices/SocketIoSlice";

export interface CategoryAddContainerProps { 
  onCloseCallback: VoidFunction;
}

const CategoryAddContainer = ({ onCloseCallback } : CategoryAddContainerProps) => {
  const categoryIds = useAppSelector(s => getCategoryIds(s.ws.categories));
  const [description, setDescription] = useState("");
  const [subheading, setSubheading] = useState("");
  const [footnotes, setFootnotes] = useState("");
  const [name, setName] = useState("");
  const [ordinal, setOrdinal] = useState(0);
  const [parent, setParent] = useState<string|null>(null);
  const [callLineName, setCallLineName] = useState("");
  const [callLineDisplay, setCallLineDisplay] = useState<CALL_LINE_DISPLAY>(CALL_LINE_DISPLAY.SHORTNAME);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const addCategory = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${HOST_API}/api/v1/menu/category`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description,
            subheading,
            footnotes,
            name,
            ordinal,
            parent_id: parent,
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
          setCallLineDisplay(CALL_LINE_DISPLAY.SHORTNAME);
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
      categoryIds={categoryIds}
      confirmText="Add"
      onCloseCallback={onCloseCallback}
      onConfirmClick={addCategory}
      isProcessing={isProcessing}
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
