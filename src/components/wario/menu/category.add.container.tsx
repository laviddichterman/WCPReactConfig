import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import CategoryComponent from "./category.component";
import { HOST_API } from "../../../config";
import { CALL_LINE_DISPLAY, CategoryDisplay, ICategory } from "@wcp/wcpshared";
import { useAppSelector } from "../../../hooks/useRedux";
import { getCategoryEntryIds } from "@wcp/wario-ux-shared";

export interface CategoryAddContainerProps {
  onCloseCallback: VoidFunction;
}

const CategoryAddContainer = ({ onCloseCallback }: CategoryAddContainerProps) => {
  const categoryIds = useAppSelector(s => getCategoryEntryIds(s.ws.categories));
  const [description, setDescription] = useState("");
  const [subheading, setSubheading] = useState("");
  const [footnotes, setFootnotes] = useState("");
  const [name, setName] = useState("");
  const [ordinal, setOrdinal] = useState(0);
  const [parent, setParent] = useState<string | null>(null);
  const [callLineName, setCallLineName] = useState("");
  const [callLineDisplay, setCallLineDisplay] = useState<CALL_LINE_DISPLAY>(CALL_LINE_DISPLAY.SHORTNAME);
  const [nestedDisplay, setNestedDisplay] = useState<CategoryDisplay>(CategoryDisplay.TAB);
  const [serviceDisable, setServiceDisable] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const addCategory = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const body : Omit<ICategory, "id"> = {
          description,
          subheading,
          footnotes,
          name,
          ordinal,
          serviceDisable,
          parent_id: parent,
          display_flags: {
            call_line_name: callLineName,
            call_line_display: callLineDisplay,
            nesting: nestedDisplay
          }
        };
        const response = await fetch(`${HOST_API}/api/v1/menu/category`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
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
          setNestedDisplay(CategoryDisplay.TAB);
          setServiceDisable([]);
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
      nestedDisplay={nestedDisplay}
      setNestedDisplay={setNestedDisplay}
      serviceDisable={serviceDisable}
      setServiceDisable={setServiceDisable}
    />
  );
};

export default CategoryAddContainer;
