"use client";
import * as React from "react";
import Script from "next/script";
import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormClearErrors,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";
import { Input } from "components/common/form/input";
import { GooglePlaceAPIContext } from "@shared/context/loadGooglePlaceApi";
import { InputModal } from "../form/inputModal";
interface PropsGooglePlaceAPI {
  tokenGoogleAPI: string;
  restrictionsCountries?: string[];
  rules: any;
  errors: DeepMap<FieldValues, FieldError>;
  register: FieldValues;
  setValue: UseFormSetValue<FieldValues>;
  className: string;
  cityOurs?: any[] | undefined;
  setError: UseFormSetError<FieldValues>;
  clearErrors: UseFormClearErrors<FieldValues>;
  setAddressValid?: any;
  // setDataGooglePlaceSelected: React.Dispatch<
  // 	React.SetStateAction<google.maps.places.PlaceResult | undefined>
  // >;
}
let validCountry: boolean = false;

const GooglePlaceAPI: React.FC<PropsGooglePlaceAPI> = ({
  tokenGoogleAPI,
  restrictionsCountries,
  register,
  rules,
  errors,
  setValue,
  className,
  setError,
  // setDataGooglePlaceSelected,
  clearErrors,
  //   setAddressValid,
}) => {
  const URL_GOOGLE_API = `https://maps.googleapis.com/maps/api/js?key=${tokenGoogleAPI}&libraries=places&callback=Function.prototype`;

  const [onLoadGooglePlaceAPI, setOnLoadGooglePlaceAPI] = React.useState(false);

  const onLoadGooglePlaces = () => {
    const input = document.getElementById("pac-input") as HTMLInputElement;
    const options = {
      componentRestrictions: { country: restrictionsCountries || [] },
      fields: [
        "address_components",
        "geometry",
        "icon",
        "name",
        "formatted_address",
      ],
      strictBounds: false,
      types: ["establishment"],
    };
    const autocomplete = new google.maps.places.Autocomplete(input, options);

    // Set initial restriction to the greater list of countries.
    // autocomplete.setComponentRestrictions({
    // 	country: ['us'],
    // });

    const southwest = { lat: 5.6108, lng: 136.589326 };
    const northeast = { lat: 61.179287, lng: 2.64325 };
    const newBounds = new google.maps.LatLngBounds(southwest, northeast);

    autocomplete.setBounds(newBounds);

    autocomplete.addListener("place_changed", () => {
      const place: any = autocomplete.getPlace();
      validCountry = true;

      clearErrors("address");

      setValue("address", place.formatted_address);

      place.address_components.forEach((item) => {
        if (item.types.includes("locality")) {
          setValue("city", item.long_name);
        }
        if (item.types.includes("country")) {
          setValue("country", item.long_name);
        }
        if (item.types.includes("postal_code")) {
          setValue("zip", item.long_name);
        }
        if (item.types.includes("sublocality")) {
          setValue("zone", item.long_name);
        }
      });
    });
  };

  React.useEffect(() => {
    if (onLoadGooglePlaceAPI) {
      onLoadGooglePlaces();
    }
  }, [onLoadGooglePlaceAPI]);

  // const onChange = () => {
  // 	setTimeout(() => {
  // 		console.log('error');
  // 		if (!validCountry) {
  // 			setError('address', {
  // 				type: 'manual',
  // 				message: 'You must select a valid address',
  // 			});
  // 			setAddressValid(false);
  // 		}

  // 		validCountry = false;
  // 	}, 500);
  // };

  return (
    <>
      <Script
        src={URL_GOOGLE_API}
        async
        onLoad={() => {
          setOnLoadGooglePlaceAPI(true);
        }}
      />

      <InputModal
        register={register}
        name="address"
        id="pac-input"
        placeholder="Address"
        labelVisible
        title="Address"
        rules={rules}
        error={errors}
        className={className}
      />
      <InputModal
        register={register}
        name="country"
        id="pac-input"
        placeholder="Country"
        labelVisible
        title="Country"
        rules={rules}
        error={errors}
        className={className}
      />
      <div className="flex gap-2 w-full">
        <InputModal
          register={register}
          name="city"
          id="pac-input"
          placeholder="City"
          labelVisible
          title="City"
          rules={rules}
          error={errors}
          className={className}
        />
        <InputModal
          register={register}
          name="zip"
          id="pac-input"
          placeholder="Zip Code"
          labelVisible
          title="Zip Code"
          rules={rules}
          error={errors}
          className={className}
        />
      </div>

      <div className="flex gap-2 w-full">
        <InputModal
          register={register}
          name="zone"
          id="pac-input"
          placeholder="Zone"
          labelVisible
          title="Zone"
          rules={rules}
          error={errors}
          className={className}
        />
        <InputModal
          register={register}
          name="house"
          id="pac-input"
          placeholder="Number of Apartment/House"
          labelVisible
          title="N⁰ House"
          rules={rules}
          error={errors}
          className={className}
        />
      </div>
    </>
  );
};

export default GooglePlaceAPI;
