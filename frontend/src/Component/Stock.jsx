import axios from "axios";
const API_KEY = "cpg1ln1r01ql1vn3fi0gcpg1ln1r01ql1vn3fi10"; // Replace with your Finnhub API key

const finnhubClient = axios.create({
    baseURL: 'https://finnhub.io/api/v1/',
    params: {
        token: API_KEY,
    },
});


// to get the response 
export const getLiveStockPrices = (symbol, callback) => {
    finnhubClient.quote(symbol, (error, data, response) => {
        if (error) {
            callback(error, null);
        } else {
            console.log(data); // Log the data to the console
            callback(null, data);
        }
    });
};
export const getLiveStockPrice = (symbol) => {
    return finnhubClient.get('quote', {
        params: {
            symbol,
        },
    });
};

