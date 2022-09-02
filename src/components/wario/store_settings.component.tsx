import { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { HOST_API } from "../../config";
import { useAppSelector } from "../../hooks/useRedux";
import KeyValuesContainer, { KeyValuesRowType } from "./keyvalues.container";
import { IWSettings } from "@wcp/wcpshared";


const StoreSettingsComponent = () => {
  const settings = useAppSelector(s => s.ws.settings!);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const onSubmit = async (values: KeyValuesRowType<string | number | boolean>[]) => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:order_config" });
        const body: IWSettings = {
          ...settings,
          config: values.reduce((acc: Record<string, string | number | boolean>, x) => ({ ...acc, [x.key]: x.value }), {})
        }
        const response = await fetch(`${HOST_API}/api/v1/config/settings`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body)
        });
        if (response.status === 201) {
          await response.json()
        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };


  return <KeyValuesContainer
    canAdd
    canEdit
    canRemove
    isProcessing={isProcessing}
    onSubmit={onSubmit}
    title={"Customer Facing Store Configuration"}
    values={Object.entries(settings.config).map(([key, value]) => ({ key, value }))}
  />;
};
export default StoreSettingsComponent;
