import axios from "axios";

export const API_KEY = "R15KIHP60KJKIDS7"; // Replace with your API key

const alphaClient = axios.create({
  baseURL: 'https://www.alphavantage.co/query',
});

export const getLiveStockPrices = (symbol, callback) => {
  alphaClient.get('', {
    params: {
      function: 'GLOBAL_QUOTE',
      symbol,
      apikey: API_KEY,
    },
  })
  .then(response => {
    callback(null, response.data);
  })
  .catch(error => {
    callback(error, null);
  });
};

export const getData = (symbol) => {
  return alphaClient.get('', {
    params: {
      function: 'TIME_SERIES_DAILY',
      symbol,
      apikey: API_KEY,
    },
  })
  .then(response => {
    return response.data;
  })
  .catch(error => {
    throw error;
  });
};