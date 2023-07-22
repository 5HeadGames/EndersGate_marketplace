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
  watch: boolean;
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
  watch,
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
    console.log(input, "INPUT");
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
      const place = autocomplete.getPlace();
      validCountry = true;

      clearErrors("address");

      setValue("address", place.formatted_address);
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
          console.log("loaded");
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
        isFill={watch}
        className={className}
      />
    </>
  );
};

export default GooglePlaceAPI;
