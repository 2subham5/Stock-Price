import React from "react";
import { Button, Typography, List as MUIList, ListItem, ListItemText, Container, Box, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    transition: 'all 0.3s',
    transform: 'translateY(-3px)',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
  },
}));

const List = () => {
  const navigate = useNavigate();
  const symbols = [
    'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'TSLA', 'FB', 'NVDA', 'NFLX', 'ADBE', 'PYPL',
    'CRM', 'V', 'WMT', 'JNJ', 'PG', 'BAC', 'JPM', 'KO', 'PFE', 'XOM'
  ];
const handleClick = (symbol)=>{
    navigate(`/check?symbol=${symbol}`);
}
  return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      minWidth:'100vw',
      bgcolor: 'background.default'
    }}
  >
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
          <ShowChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Popular Stocks
        </Typography>
        <Grid container spacing={2}>
          {symbols.map(symbol => (
            <Grid item xs={6} sm={4} md={3} key={symbol}>
              <StyledListItem
                component={Paper}
                elevation={2}
                onClick={()=> handleClick(symbol)}
                sx={{
                  textAlign: 'center',
                  borderRadius: 2,
                  cursor: 'pointer',
                }}
              >
                <ListItemText 
                  primary={symbol} 
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
              </StyledListItem>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/check")}
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: 2,
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px 0 rgba(0,0,0,0.15)',
              }
            }}
          >
            Check Prices
          </Button>
        </Box>
      </Paper>
    </Container>
    </Box>
  );
};

export default List;