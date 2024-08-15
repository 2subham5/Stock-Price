
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { fetchGlobalQuote,fetchHistoricalData,fetchNewsData} from './Stock';
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
  
      // Fetch Global Quote
      const globalQuoteData = await fetchGlobalQuote(symbol);
      if (globalQuoteData) {
        setStockData(globalQuoteData);
      } else {
        setError("Stock not found or API limit reached");
        return;
      }
  
      // Fetch Historical Data
      const historicalData = await fetchHistoricalData(symbol);
      if (historicalData) {
        setHistoricalData(historicalData);
      }
  
      // Fetch News Data
      const newsData = await fetchNewsData(symbol);
      if (newsData) {
        setNewsData(newsData);
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