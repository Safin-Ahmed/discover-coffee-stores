import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getPhotosOfCoffeeStores = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    page: 1,
    perPage: 40,
  });
  const unsplashResults = photos.response.results;
  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
  latLong = "23.76836788132318,90.3547829260813",
  limit = 6
) => {
  console.log({ latLong });
  const photos = await getPhotosOfCoffeeStores();
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores(latLong, "coffee", limit),
    options
  );
  const data = await response.json();

  return data.results.map((result, index) => {
    return {
      id: result.fsq_id,
      name: result.name,
      address: result.location.address || "",
      neighborhood:
        result.location.neighborhood?.length > 0
          ? result.location.neighborhood[0]
          : "",
      imgUrl: photos.length > 0 ? photos[index] : null,
    };
  });
};
