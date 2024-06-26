import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, CircularProgress, Paper, Grid } from '@mui/material';
import { getLiveStockPrice } from './Stock';
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import './LiveStock.css';
const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  minWidth:'100vw'
//   background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '15px',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1, 4),
}));

const LiveStock = () => {
    const navigate = useNavigate();
    const [symbol, setSymbol] = useState('');
    const [stockPrice, setStockPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(()=>{
        const params = new URLSearchParams(location.search);
        const symbolParam = params.get('symbol');
        if(symbolParam){
            setSymbol(symbolParam)
        }
    },[location]);
    
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
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

    useEffect(() => {
        if (symbol) {
            handleSubmit();
            const interval = setInterval(handleSubmit, 60000);
            return () => clearInterval(interval);
        }
    }, [symbol]);

    return (
        <StyledContainer maxWidth="sm" className="customContainer">
            <StyledPaper elevation={3}>
                <Typography component="h1" variant="h4" gutterBottom>
                    Stock Live
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Stock Symbol"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        margin="normal"
                    />
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <StyledButton type="submit" variant="contained" color="primary">
                                Get Price
                            </StyledButton>
                        </Grid>
                        <Grid item>
                            <StyledButton variant="outlined" color="secondary" onClick={() => navigate("/")}>
                                Check All Stocks
                            </StyledButton>
                        </Grid>
                    </Grid>
                </Box>
                
                {loading && <CircularProgress sx={{ mt: 2 }} />}
                
                {error && (
                    <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                        Error: {error}
                    </Typography>
                )}
                
                {stockPrice && (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>Stock Price Information</Typography>
                        <Grid container spacing={2}>
                            {[
                                { label: 'Current Price', value: stockPrice.c },
                                { label: 'High Price', value: stockPrice.h },
                                { label: 'Low Price', value: stockPrice.l },
                                { label: 'Open Price', value: stockPrice.o },
                                { label: 'Previous Close', value: stockPrice.pc },
                            ].map((item) => (
                                <Grid item xs={6} key={item.label}>
                                    <Paper elevation={2} sx={{ p: 2 }}>
                                        <Typography variant="body2" color="textSecondary">{item.label}</Typography>
                                        <Typography variant="h6">${item.value}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </StyledPaper>
        </StyledContainer>
    );
};

export default LiveStock;