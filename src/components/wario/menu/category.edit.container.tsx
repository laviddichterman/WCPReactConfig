import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import CategoryComponent, { CategoryEditProps } from "./category.component";
import { HOST_API } from "../../../config";
import { getCategoryIds } from "src/redux/slices/SocketIoSlice";
import { useAppSelector } from "src/hooks/useRedux";
import { ICategory } from "@wcp/wcpshared";

const CategoryEditContainer = ({ category, onCloseCallback }: CategoryEditProps) => {
  const categoryIds = useAppSelector(s => getCategoryIds(s.ws.categories));
  const [description, setDescription] = useState(category.description);
  const [name, setName] = useState(category.name);
  const [subheading, setSubheading] = useState(category.subheading);
  const [footnotes, setFootnotes] = useState(category.footnotes);
  const [ordinal, setOrdinal] = useState(category.ordinal || 0);
  const [parent, setParent] = useState(category.parent_id ?? null);
  const [callLineName, setCallLineName] = useState(category.display_flags.call_line_name);
  const [callLineDisplay, setCallLineDisplay] = useState(category.display_flags.call_line_display);
  const [nestedDisplay, setNestedDisplay] = useState(category.display_flags.nesting);
  const [serviceDisable, setServiceDisable] = useState(category.serviceDisable);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const editCategory = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const response = await fetch(`${HOST_API}/api/v1/menu/category/${category.id}`, {
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
            parent_id: parent,
            display_flags: {
              call_line_name: callLineName,
              call_line_display: callLineDisplay,
              nesting: nestedDisplay
            },
            serviceDisable
          } as ICategory),
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
      categoryIds={categoryIds.filter(c => c !== category.id)}
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

export default CategoryEditContainer;
