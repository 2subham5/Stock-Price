import React, { useState, useEffect } from 'react';
import { getData } from './Stock';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Box, Typography, CircularProgress, Button } from '@mui/material';

const StockGraph = () => {
  const { symbol } = useParams();
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData(symbol);
        const data = response.data['Time Series (Daily)'];
        if (!data) {
          throw new Error('Invalid data format received');
        }

        const chartData = {
          labels: Object.keys(data).reverse(),
          datasets: [
            {
              label: 'Close Price',
              data: Object.values(data).map(entry => parseFloat(entry['4. close'])).reverse(),
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        };
        setGraphData(chartData);
      } catch (err) {
        setError(err.message || 'Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const handleViewGraph = () => {
    setShowGraph(true);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ mt: 3, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        {symbol} Stock Price Chart
      </Typography>
      {graphData && showGraph && <Line data={graphData} />}
      <Button onClick={handleViewGraph}>View Graph</Button>
    </Box>
  );
};

export default StockGraph;