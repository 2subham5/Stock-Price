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
export const fetchGlobalQuote = async (symbol) => {
  try {
    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: "GLOBAL_QUOTE",
        symbol: symbol,
        apikey: API_KEY,
      },
    });
    return response.data["Global Quote"];
  } catch (error) {
    console.error("Error fetching global quote:", error);
    return null;
  }
};

export const fetchHistoricalData = async (symbol) => {
  try {
    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: "TIME_SERIES_DAILY",
        symbol: symbol,
        apikey: API_KEY,
      },
    });
    const data = response.data["Time Series (Daily)"];
    if (data) {
      return Object.entries(data).slice(0, 30).reverse();
    }
    return null;
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return null;
  }
};

export const fetchNewsData = async (symbol) => {
  try {
    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: "NEWS_SENTIMENT",
        tickers: symbol,
        apikey: API_KEY,
      },
    });
    return response.data.feed ? response.data.feed.slice(0, 5) : null;
  } catch (error) {
    console.error("Error fetching news data:", error);
    return null;
  }
};
