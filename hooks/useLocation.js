import { useContext, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

const useLocation = () => {
  const [errorMessage, setErrorMessage] = useState("");
  //   const [latLong, setLatlong] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const { dispatch } = useContext(StoreContext);
  const success = (position) => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    // setLatlong(`${lat},${long}`);
    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${lat},${long}` },
    });
    setErrorMessage("");
    setIsLocating(false);
  };

  const error = () => {
    setErrorMessage("Unable to retrieve your location");
    setIsLocating(false);
  };

  const handleLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setErrorMessage("Geo location is not supported by your browser");
      setIsLocating(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    errorMessage,
    handleLocation,
    isLocating,
  };
};

export default useLocation;
