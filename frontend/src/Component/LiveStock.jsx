// import React, { useState, useEffect } from 'react';
// import { Container, Box, Typography, TextField, Button, CircularProgress, Paper, Grid } from '@mui/material';
// import { useNavigate } from "react-router-dom";
// import { styled } from '@mui/material/styles';
// import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { getLiveStockPrices, getData } from './Stock';

// const StyledContainer = styled(Container)(({ theme }) => ({
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: '100vh',
//     minWidth: '100vw',
// }));

// const StyledPaper = styled(Paper)(({ theme }) => ({
//     padding: theme.spacing(4),
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     borderRadius: '15px',
//     boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//     margin: theme.spacing(1),
//     padding: theme.spacing(1, 4),
// }));

// const LiveStock = () => {
//     const navigate = useNavigate();
//     const [symbol, setSymbol] = useState('');
//     const [stockPrice, setStockPrice] = useState(null);
//     const [historicalData, setHistoricalData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const params = new URLSearchParams(window.location.search);
//         const symbolParam = params.get('symbol');
//         if (symbolParam) {
//             setSymbol(symbolParam);
//             handleSubmit(symbolParam); // Fetch stock data on load
//         }
//     }, []);

//     const handleSubmit = async (inputSymbol) => {
//         const stockSymbol = inputSymbol || symbol;
//         if (stockSymbol.trim() === '') return;

//         setLoading(true);
//         setError(null); // Reset error before making the API calls

//         // Fetch live stock prices
//         getLiveStockPrices(stockSymbol.toUpperCase(), (err, data) => {
//             if (err) {
//                 setError(err.message);
//                 setStockPrice(null);
//             } else {
//                 if (data && data['Global Quote']) {
//                     setStockPrice(data['Global Quote']);
//                 } else {
//                     setError('No data available for this symbol.');
//                     setStockPrice(null);
//                 }
//             }
//             setLoading(false);
//         });

//         // Fetch historical data
//         getData(stockSymbol.toUpperCase(), (err, data) => {
//             if (err) {
//                 setError(err.message);
//                 setHistoricalData([]);
//             } else {
//                 const timeSeries = data['Time Series (Daily)'];
//                 const formattedData = Object.keys(timeSeries).map(date => ({
//                     date,
//                     price: parseFloat(timeSeries[date]['4. close']),
//                 }));
//                 setHistoricalData(formattedData);
//             }
//         });
//     };

//     useEffect(() => {
//         if (symbol) {
//             const interval = setInterval(() => handleSubmit(symbol), 60000);
//             return () => clearInterval(interval);
//         }
//     }, [symbol]);

//     return (
//         <StyledContainer maxWidth="sm" className="customContainer">
//             <StyledPaper elevation={3}>
//                 <Typography component="h1" variant="h4" gutterBottom>
//                     Stock Live
//                 </Typography>
//                 <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} sx={{ width: '100%', mt: 2 }}>
//                     <TextField
//                         fullWidth
//                         variant="outlined"
//                         label="Stock Symbol"
//                         value={symbol}
//                         onChange={(e) => setSymbol(e.target.value)}
//                         margin="normal"
//                     />
//                     <Grid container spacing={2} justifyContent="center">
//                         <Grid item>
//                             <StyledButton type="submit" variant="contained" color="primary">
//                                 Get Price
//                             </StyledButton>
//                         </Grid>
//                         <Grid item>
//                             <StyledButton variant="outlined" color="secondary" onClick={() => navigate("/")}>
//                                 Check All Stocks
//                             </StyledButton>
//                         </Grid>
//                         {stockPrice && (
//                             <Grid item>
//                                 <StyledButton variant="outlined" color="primary" onClick={() => navigate(`/graph?symbol=${symbol}`)}>
//                                     View Graph
//                                 </StyledButton>
//                             </Grid>
//                         )}
//                     </Grid>
//                 </Box>
//                 {loading && <CircularProgress sx={{ mt: 2 }} />}
//                 {error && (
//                     <Typography variant="body1" color="error" sx={{ mt: 2 }}>
//                         Error: {error}
//                     </Typography>
//                 )}
//                 {stockPrice && (
//                     <Box sx={{ mt: 3, textAlign: 'center' }}>
//                         <Typography variant="h6" gutterBottom>Stock Price Information</Typography>
//                         <Grid container spacing={2}>
//                             {[
//                                 { label: 'Symbol', value: stockPrice["01. symbol"] },
//                                 { label: 'Open', value: stockPrice["02. open"] },
//                                 { label: 'High', value: stockPrice["03. high"] },
//                                 { label: 'Low', value: stockPrice["04. low"] },
//                                 { label: 'Current Price', value: stockPrice["05. price"] },
//                                 { label: 'Volume', value: stockPrice["06. volume"] },
//                                 { label: 'Latest Trading Day', value: stockPrice["07. latest trading day"] },
//                                 { label: 'Previous Close', value: stockPrice["08. previous close"] },
//                                 { label: 'Change', value: stockPrice["09. change"] },
//                                 { label: 'Change Percent', value: stockPrice["10. change percent"] },
//                             ].map((item) => (
//                                 <Grid item xs={6} key={item.label}>
//                                     <Paper elevation={2} sx={{ p: 2 }}>
//                                         <Typography variant="body2" color="textSecondary">{item.label}</Typography>
//                                         <Typography variant="h6">
//                                             {item.label === 'Change Percent' || item.label === 'Change'
//                                                 ? item.value
//                                                 : `$${item.value}`}
//                                         </Typography>
//                                     </Paper>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                     </Box>
//                 )}
//                 {historicalData.length > 0 && (
//                     <Box sx={{ mt: 4 }}>
//                         <Typography variant="h6" gutterBottom>Historical Price Data</Typography>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <LineChart data={historicalData}>
//                                 <Line type="monotone" dataKey="price" stroke="#8884d8" />
//                                 <CartesianGrid stroke="#ccc" />
//                                 <XAxis dataKey="date" />
//                                 <YAxis />
//                                 <Tooltip />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </Box>
//                 )}
//             </StyledPaper>
//         </StyledContainer>
//     );
// };

// export default LiveStock;


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Autocomplete,
  CircularProgress,
  Card,
  CardContent,
  CardActionArea,
  Switch,
  FormControlLabel,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import gsap from "gsap";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [search, setSearch] = useState("");
  const [symbol, setSymbol] = useState("");
  const [stockData, setStockData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Closing Price",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
    ],
  });

  const API_KEY = "R15KIHP60KJKIDS7";
  const stockDataRef = useRef(null);
  const historicalDataRef = useRef(null);
  const newsDataRef = useRef(null);
  const containerRef = useRef(null);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
  });

  useEffect(() => {
    if (search.length > 1) {
      searchSymbols(search);
    } else {
      setSearchResults([]);
    }
  }, [search]);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    );
  }, []);

  useEffect(() => {
    if (historicalData) {
      setChartData({
        labels: historicalData.map(([date]) => date),
        datasets: [
          {
            label: "Closing Price",
            data: historicalData.map(([, data]) => data["4. close"]),
            borderColor: darkMode ? "rgb(0, 255, 255)" : "rgb(75, 192, 192)",
            backgroundColor: darkMode
              ? "rgba(0, 255, 255, 0.2)"
              : "rgba(75, 192, 192, 0.2)",
            tension: 0.1,
          },
        ],
      });
    }
  }, [darkMode, historicalData]);

  const searchSymbols = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: "SYMBOL_SEARCH",
          keywords: query,
          apikey: API_KEY,
        },
      });

      const results = response.data.bestMatches;
      setSearchResults(
        results.map((result) => ({
          symbol: result["1. symbol"],
          name: result["2. name"],
        }))
      );
    } catch (err) {
      console.error("Error searching symbols:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockData = async () => {
    if (!symbol) return;

    setError("");
    setStockData(null);
    setHistoricalData(null);
    setNewsData(null);

    try {
      setLoading(true);
      const globalQuoteResponse = await axios.get(
        `https://www.alphavantage.co/query`,
        {
          params: {
            function: "GLOBAL_QUOTE",
            symbol: symbol,
            apikey: API_KEY,
          },
        }
      );
      const globalQuoteData = globalQuoteResponse.data["Global Quote"];
      if (globalQuoteData) {
        setStockData(globalQuoteData);
      } else {
        setError("Stock not found or API limit reached");
        return;
      }
  
      const historicalResponse = await axios.get(
        `https://www.alphavantage.co/query`,
        {
          params: {
            function: "TIME_SERIES_DAILY",
            symbol: symbol,
            apikey: API_KEY,
          },
        }
      );
      const historicalData = historicalResponse.data["Time Series (Daily)"];
      if (historicalData) {
        const chartData = Object.entries(historicalData)
          .slice(0, 30)
          .reverse();
        setHistoricalData(chartData);
      }

      const newsResponse = await axios.get(
        `https://www.alphavantage.co/query`,
        {
          params: {
            function: "NEWS_SENTIMENT",
            tickers: symbol,
            apikey: API_KEY,
          },
        }
      );

      const newsData = newsResponse.data.feed;
      if (newsData) {
        setNewsData(newsData.slice(0, 5)); // Display top 5 news items
      }
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const symbolParam = params.get('symbol');
    if (symbolParam) {
        setSymbol(symbolParam);
        fetchStockData(symbolParam); // Fetch stock data on load
    }
}, []);
  const getChartOptions = (isDarkMode) => ({
    responsive: true,
    scales: {
      x: {
        grid: {
          color: isDarkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
      y: {
        grid: {
          color: isDarkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
      tooltip: {
        backgroundColor: isDarkMode
          ? "rgba(0, 0, 0, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
        titleColor: isDarkMode ? "#ffffff" : "#000000",
        bodyColor: isDarkMode ? "#ffffff" : "#000000",
      },
    },
  });

  useEffect(() => {
    if (stockDataRef.current) {
      gsap.fromTo(
        stockDataRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 }
      );
    }
  }, [stockData]);

  useEffect(() => {
    if (historicalDataRef.current) {
      gsap.fromTo(
        historicalDataRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 }
      );
    }
  }, [historicalData]);

  useEffect(() => {
    if (newsDataRef.current) {
      gsap.fromTo(
        newsDataRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 }
      );
    }
  }, [newsData]);

return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" className="App" ref={containerRef}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h3" component="h1">
                    Stocker
                </Typography>
                <FormControlLabel
                    control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
                    label="Dark Mode"
                />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 4, justifyContent: "center" }}>
                <Autocomplete
                    freeSolo
                    options={searchResults}
                    getOptionLabel={(option) => `${option.name} (${option.symbol})`}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search company or symbol"
                            variant="outlined"
                            fullWidth
                        />
                    )}
                    onInputChange={(event, newInputValue) => {
                        setSearch(newInputValue);
                    }}
                    onChange={(event, newValue) => {
                        if (newValue) {
                            setSymbol(newValue.symbol);
                        }
                    }}
                />
                <Button variant="contained" color="primary" onClick={fetchStockData}>
                    Get Stock Price
                </Button>
            </Box>
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                    <CircularProgress />
                </Box>
            )}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <div ref={stockDataRef}>
                        {stockData && (
                            <Card variant="outlined" sx={{ mb: 4 }}>
                                <CardContent>
                                    <Typography variant="h4" component="h2" gutterBottom>
                                        {stockData["01. symbol"]}
                                    </Typography>
                                    <Typography variant="h5" component="p">
                                        Price: ${parseFloat(stockData["05. price"]).toFixed(2)}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                                        <Typography variant="body1" sx={{ mr: 1 }}>
                                            Change:
                                        </Typography>
                                        <IconButton
                                            color={parseFloat(stockData["09. change"]) >= 0 ? "success" : "error"}
                                            size="small"
                                        >
                                            {parseFloat(stockData["09. change"]) >= 0 ? <ArrowUpward /> : <ArrowDownward />}
                                        </IconButton>
                                        <Typography
                                            variant="body1"
                                            color={parseFloat(stockData["09. change"]) >= 0 ? "success.main" : "error.main"}
                                        >
                                            {stockData["09. change"]} ({stockData["10. change percent"]})
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                        <div ref={historicalDataRef}>
                            {historicalData && (
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" component="h3" gutterBottom>
                                            30-Day Price History
                                        </Typography>
                                        <Line data={chartData} options={getChartOptions(darkMode)} />
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <div ref={newsDataRef}>
                        {newsData && (
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" component="h3" gutterBottom>
                                        Related News
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {newsData.map((news, index) => (
                                            <Grid item xs={12} sm={6} key={index}>
                                                <Card>
                                                    <CardActionArea
                                                        href={news.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <CardContent>
                                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                                {news.title}
                                                            </Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </Grid>
            </Grid>
            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                    © 2024 Stock Price Checker. All rights reserved.
                </Typography>
            </Box>
        </Container>
    </ThemeProvider>
);
}

export default App;