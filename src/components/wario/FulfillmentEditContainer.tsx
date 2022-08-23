import { useState } from "react";
import type { Polygon } from 'geojson';

import { useAuth0 } from '@auth0/auth0-react';
import { HOST_API } from "../../config";
import { FulfillmentConfig } from "@wcp/wcpshared";
import FulfillmentComponent from "./FulfillmentComponent";

const FulfillmentEditContainer = ({ fulfillment, onCloseCallback }: { fulfillment: FulfillmentConfig; onCloseCallback: VoidFunction }) => {
  const [ordinal, setOrdinal] = useState(fulfillment.ordinal);
  const [displayName, setDisplayName] = useState(fulfillment.displayName);
  const [shortcode, setShortcode] = useState(fulfillment.shortcode);
  const [service, setService] = useState(fulfillment.service);
  const [terms, setTerms] = useState<string[]>(fulfillment.terms);
  const [fulfillmentDescription, setFulfillmentDescription] = useState(fulfillment.messages.DESCRIPTION ?? "");
  const [confirmationMessage, setConfirmationMessage] = useState(fulfillment.messages.CONFIRMATION);
  const [instructions, setInstructions] = useState(fulfillment.messages.INSTRUCTIONS);
  const [menuCategoryId, setMenuCategoryId] = useState<string | null>(fulfillment.menuBaseCategoryId);
  const [orderCategoryId, setOrderCategoryId] = useState<string | null>(fulfillment.orderBaseCategoryId);
  const [orderSupplementaryCategoryId, setOrderSupplementaryCategoryId] = useState<string | null>(fulfillment.orderSupplementaryCategoryId);
  const [requirePrepayment, setRequirePrepayment] = useState(fulfillment.requirePrepayment);
  const [allowPrepayment, setAllowPrepayment] = useState(fulfillment.allowPrepayment);
  const [autograt, setAutograt] = useState<{ function: string, percentage: number } | null>(fulfillment.autograt);
  const [serviceChargeFunctionId, setServiceChargeFunctionId] = useState<string | null>(fulfillment.serviceCharge);
  const [leadTime, setLeadTime] = useState(fulfillment.leadTime);
  const [operatingHours, setOperatingHours] = useState(fulfillment.operatingHours);
  const [blockedOff, setBlockedOff] = useState(fulfillment.blockedOff);
  const [specialHours, setSpecialHours] = useState(fulfillment.specialHours);

  const [minDuration, setMinDuration] = useState(fulfillment.minDuration);
  const [maxDuration, setMaxDuration] = useState(fulfillment.maxDuration);
  const [timeStep, setTimeStep] = useState(fulfillment.timeStep);
  const [maxGuests, setMaxGuests] = useState<number | null>(fulfillment.maxGuests ?? null);
  const [serviceArea, setServiceArea] = useState<Polygon | null>(fulfillment.serviceArea ?? null);

  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const editFulfillment = async () => {
    if (!isProcessing && menuCategoryId !== null && orderCategoryId !== null && displayName.length > 0 && shortcode.length > 0) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const body: Omit<FulfillmentConfig, "id"> = {
          displayName,
          shortcode,
          ordinal,
          service,
          terms,
          messages: {
            DESCRIPTION: fulfillmentDescription ?? null,
            CONFIRMATION: confirmationMessage,
            INSTRUCTIONS: instructions,
          },
          menuBaseCategoryId: menuCategoryId,
          orderBaseCategoryId: orderCategoryId,
          orderSupplementaryCategoryId: orderSupplementaryCategoryId,
          requirePrepayment,
          allowPrepayment,
          autograt,
          serviceCharge: serviceChargeFunctionId,
          leadTime,
          operatingHours: {
            0: operatingHours[0],
            1: operatingHours[1],
            2: operatingHours[2],
            3: operatingHours[3],
            4: operatingHours[4],
            5: operatingHours[5],
            6: operatingHours[6],
          },
          blockedOff: blockedOff,
          specialHours: specialHours,
          minDuration,
          maxDuration,
          timeStep,
          maxGuests: maxGuests ?? undefined,
          serviceArea: serviceArea ?? undefined

        };
        const response = await fetch(`${HOST_API}/api/v1/config/fulfillment/${fulfillment.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
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
    <FulfillmentComponent
      shortcode={shortcode}
      setShortcode={setShortcode}
      displayName={displayName}
      setDisplayName={setDisplayName}
      ordinal={ordinal}
      setOrdinal={setOrdinal}
      service={service}
      setService={setService}
      terms={terms}
      setTerms={setTerms}
      fulfillmentDescription={fulfillmentDescription}
      setFulfillmentDescription={setFulfillmentDescription}
      confirmationMessage={confirmationMessage}
      setConfirmationMessage={setConfirmationMessage}
      instructions={instructions}
      setInstructions={setInstructions}
      menuCategoryId={menuCategoryId}
      setMenuCategoryId={setMenuCategoryId}
      orderCategoryId={orderCategoryId}
      setOrderCategoryId={setOrderCategoryId}
      orderSupplementaryCategoryId={orderSupplementaryCategoryId}
      setOrderSupplementaryCategoryId={setOrderSupplementaryCategoryId}
      requirePrepayment={requirePrepayment}
      setRequirePrepayment={setRequirePrepayment}
      allowPrepayment={allowPrepayment}
      setAllowPrepayment={setAllowPrepayment}
      autograt={autograt}
      setAutograt={setAutograt}
      serviceChargeFunctionId={serviceChargeFunctionId}
      setServiceChargeFunctionId={setServiceChargeFunctionId}
      leadTime={leadTime}
      setLeadTime={setLeadTime}
      operatingHours={operatingHours}
      setOperatingHours={setOperatingHours}
      specialHours={specialHours}
      setSpecialHours={setSpecialHours}
      blockedOff={blockedOff}
      setBlockedOff={setBlockedOff}
      minDuration={minDuration}
      setMinDuration={setMinDuration}
      maxDuration={maxDuration}
      setMaxDuration={setMaxDuration}
      timeStep={timeStep}
      setTimeStep={setTimeStep}
      maxGuests={maxGuests}
      setMaxGuests={setMaxGuests}
      serviceArea={serviceArea}
      setServiceArea={setServiceArea}
      confirmText="Save"
      onCloseCallback={onCloseCallback}
      onConfirmClick={editFulfillment}
      isProcessing={isProcessing}
      disableConfirmOn={false}
    />
  );
};

export default FulfillmentEditContainer;
