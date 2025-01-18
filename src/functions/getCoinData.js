import axios from "axios";

export const getCoinData = (id) => {
  const proxyUrl = "https://api.allorigins.win/get?url=";
  const options = {
    method: "GET",
    url: `${proxyUrl}${encodeURIComponent(`https://api.coingecko.com/api/v3/coins/${id}`)}`,
    headers: { accept: "application/json" },
  };

  const myCoin = axios
    .request(options)
    .then(function (response) {
      return JSON.parse(response.data.contents);
    })
    .catch(function (error) {
      console.error(error);
    });

  return myCoin;
};
