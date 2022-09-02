import { useState, useEffect } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { HOST_API } from "../../config";
import KeyValuesContainer from "./keyvalues.container";
import { KeyValue } from "@wcp/wcpshared";

const KeyValuesComponent = () => {
  const [KEYVALUES, setKEYVALUES] = useState<Record<string, string> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isLoading, getAccessTokenSilently, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently({ scope: "read:settings" });
      const response = await fetch(`${HOST_API}/api/v1/config/kvstore`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      setKEYVALUES(await response.json());
    }
    if (!isLoading && isAuthenticated) {
      getToken();
    }
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, getAccessTokenSilently, isAuthenticated, loginWithRedirect, logout]);

  const onSubmit = async (values : KeyValue[]) => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:settings" });
        const response = await fetch(`${HOST_API}/api/v1/config/kvstore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values.reduce((acc: Record<string, string>, x) => ({...acc, [x.key]: x.value }), {}))
        });
        if (response.status === 201) {
          setKEYVALUES(await response.json());
        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };
  return KEYVALUES !== null ? <KeyValuesContainer 
    canAdd 
    canEdit 
    canRemove 
    isProcessing={isProcessing} 
    title="Key Value Store" 
    onSubmit={onSubmit} 
    values={Object.entries(KEYVALUES).map(([key, value])=>({ key, value }))}  /> : <></>
};
export default KeyValuesComponent;
