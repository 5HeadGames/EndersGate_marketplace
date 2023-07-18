import GooglePlaceAPI from "@shared/components/common/google-place-api";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useForm } from "react-hook-form";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

export default function Home() {
  const { account } = useWeb3React();
  const [login, setLogin] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    setValue,
    setError,
    watch,
    clearErrors,
  } = useForm();

  return (
    <div className="h-screen flex items-center justify-center text-primary">
      <GooglePlaceAPI
        errors={errors.address}
        tokenGoogleAPI={"AIzaSyCJ_y3_ZF53P-Nkxl74rQrx1K6-CPU0r9o"}
        {...{
          register,
          rules: {
            required: { value: true, message: "This field is required" },
          },
          setValue,
          watch: watch("address"),
          className: "",
          setError,
          clearErrors,
        }}
      ></GooglePlaceAPI>
    </div>
  );
}
