import { useState } from "react";
import type { Polygon } from 'geojson';

import { useAuth0 } from '@auth0/auth0-react';
import { HOST_API } from "../../config";
import { DateIntervalsEntries, DayOfTheWeek, FulfillmentConfig, FulfillmentType, OperatingHourSpecification } from "@wcp/wcpshared";
import FulfillmentComponent from "./FulfillmentComponent";
const EmptyOperatingHours: OperatingHourSpecification = {
  [DayOfTheWeek.SUNDAY]: [],
  [DayOfTheWeek.MONDAY]: [],
  [DayOfTheWeek.TUESDAY]: [],
  [DayOfTheWeek.WEDNESDAY]: [],
  [DayOfTheWeek.THURSDAY]: [],
  [DayOfTheWeek.FRIDAY]: [],
  [DayOfTheWeek.SATURDAY]: []
};

const FulfillmentAddContainer = ({ onCloseCallback }: { onCloseCallback: VoidFunction }) => {
  const [ordinal, setOrdinal] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [shortcode, setShortcode] = useState('');
  const [service, setService] = useState(FulfillmentType.PickUp);
  const [terms, setTerms] = useState<string[]>([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [menuCategoryId, setMenuCategoryId] = useState<string | null>(null);
  const [orderCategoryId, setOrderCategoryId] = useState<string | null>(null);
  const [requirePrepayment, setRequirePrepayment] = useState(true);
  const [allowPrepayment, setAllowPrepayment] = useState(true);
  const [autograt, setAutograt] = useState<{ function: string, percentage: number } | null>(null);
  const [serviceChargeFunctionId, setServiceChargeFunctionId] = useState<string | null>(null);
  const [leadTime, setLeadTime] = useState(35);
  const [operatingHours, setOperatingHours] = useState({ ...EmptyOperatingHours });
  const [blockedOff, setBlockedOff] = useState<DateIntervalsEntries>([]);
  const [specialHours, setSpecialHours] = useState<DateIntervalsEntries>([]);

  const [minDuration, setMinDuration] = useState(0);
  const [maxDuration, setMaxDuration] = useState(0);
  const [timeStep, setTimeStep] = useState(15);
  const [maxGuests, setMaxGuests] = useState<number | null>(null);
  const [serviceArea, setServiceArea] = useState<Polygon | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const reset = () => {
    setOrdinal(0);
    setDisplayName('');
    setShortcode('');
    setService(FulfillmentType.PickUp);
    setTerms([]);
    setConfirmationMessage('');
    setInstructions('');
    setMenuCategoryId(null);
    setOrderCategoryId(null);
    setRequirePrepayment(true);
    setAllowPrepayment(true);
    setAutograt(null);
    setServiceChargeFunctionId(null);
    setLeadTime(35);
    setOperatingHours({ ...EmptyOperatingHours });
    setMinDuration(0);
    setMaxDuration(0);
    setTimeStep(15);
    setMaxGuests(null);
    setServiceArea(null);
  }

  const canSubmit = !isProcessing && menuCategoryId !== null && orderCategoryId !== null && confirmationMessage.length > 0 && instructions.length > 0;

  const addFulfillment = async () => {
    if (canSubmit) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const body: Omit<FulfillmentConfig, "id"> = {
          displayName,
          shortcode,
          ordinal,
          service,
          terms: terms.filter(x=>x.length > 0),
          messages: {
            CONFIRMATION: confirmationMessage,
            INSTRUCTIONS: instructions,
          },
          menuBaseCategoryId: menuCategoryId,
          orderBaseCategoryId: orderCategoryId,
          requirePrepayment,
          allowPrepayment,
          autograt,
          serviceCharge: serviceChargeFunctionId,
          leadTime,
          operatingHours,
          specialHours: [],
          blockedOff: [],
          minDuration,
          maxDuration,
          timeStep,
          maxGuests: maxGuests ?? undefined,
          serviceArea: serviceArea ?? undefined

        };
        const response = await fetch(`${HOST_API}/api/v1/config/fulfillment/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.status === 201) {
          reset();
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
      confirmationMessage={confirmationMessage}
      setConfirmationMessage={setConfirmationMessage}
      instructions={instructions}
      setInstructions={setInstructions}
      menuCategoryId={menuCategoryId}
      setMenuCategoryId={setMenuCategoryId}
      orderCategoryId={orderCategoryId}
      setOrderCategoryId={setOrderCategoryId}
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
      specialHours={specialHours}
      setSpecialHours={setSpecialHours}
      blockedOff={blockedOff}
      setBlockedOff={setBlockedOff}
      confirmText="Add"
      onCloseCallback={onCloseCallback}
      onConfirmClick={addFulfillment}
      isProcessing={isProcessing}
      disableConfirmOn={!canSubmit}
    />
  );
};

export default FulfillmentAddContainer;
