import React, { useState,useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { getLiveStockPrice } from './Stock';
import { useNavigate } from "react-router-dom";
import "./LiveStock.css"
const LiveStock = () => {
    const navigate = useNavigate();
    const [symbol, setSymbol] = useState('');
    const [stockPrice, setStockPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (symbol.trim() !== '') {
            try {
                setLoading(true);
                const response = await getLiveStockPrice(symbol.toUpperCase());
                setStockPrice(response.data);
                setError(null);
            } catch (err) {
                setError(err.message);
                setStockPrice(null);
            } finally {
                setLoading(false);
            }
        }
    };
    useEffect(()=>{
    handleSubmit();
    const interval = setInterval(handleSubmit, 60000); // Refresh every minute

        return () => clearInterval(interval);
},[symbol])


    return (
        <div className="top-background" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Container className ="customContainer" style={{ border: "2px solid black",  width: '31rem' ,marginLeft: '31rem', borderRadius: '5%'}}>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h4">
                        Stock Live
                    </Typography>
                    <Box className="stock-box" component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                
                        <TextField className="stock-text" id="outlined-basic" label="fill" variant="outlined"  type="text" size="small"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            placeholder="Enter stock symbol"/>
                        <Button 
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Get Price
                        </Button>
                        <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/")}
                    sx={{ mt: 2 }}
                >
                    Check All Stocks
                </Button>
                    </Box>
                    {loading && (
                        <Box sx={{ mt: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}
                    {error && (
                        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                            Error: {error}
                        </Typography>
                    )}
                    {stockPrice && (
                        <Box className="stock-result" sx={{ mt: 2 }}>
                            <Typography variant="body1">
                                Current Price: ${stockPrice.c}
                            </Typography>
                            <Typography variant="body1">
                                High Price of the Day: ${stockPrice.h}
                            </Typography>
                            <Typography variant="body1">
                                Low Price of the Day: ${stockPrice.l}
                            </Typography>
                            <Typography variant="body1">
                                Open Price of the Day: ${stockPrice.o}
                            </Typography>
                            <Typography variant="body1">
                                Previous Close Price: ${stockPrice.pc}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Container>
        </div>
    );
};

export default LiveStock;
