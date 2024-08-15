
import axios from "axios";
export const API_KEY = "R15KIHP60KJKIDS7"; // Alpha Vantage API key

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
        console.log(response.data); // Log the data to the console
        callback(null, response.data);
    })
    .catch(error => {
        console.error('Error fetching stock price:', error); // Log the error
        callback(error, null);
    });
};

export const getData = (symbol) => {
    return alphaClient.get('', {
        params: {
            function: 'TIME_SERIES_DAILY', // Correct function name
            symbol: symbol,
            apikey: API_KEY, // Correct API key parameter
        },
    })
    .then(response => {
        console.log(response.data); // Log the data to the console
        // callback(null, response.data);
    })
    .catch(error => {
        console.error('Error fetching stock price:', error); // Log the error
        // callback(error, null);
    });
}
console.log(getData('AAPL'));