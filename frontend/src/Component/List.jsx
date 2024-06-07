import React from "react";
import LiveStock from "./LiveStock";
import { Button, Typography, List as MUIList, ListItem, ListItemText, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./List.css"
const List = () => {
    // to move to another route
    const navigate = useNavigate();
    // available symbol in finnhub documentation for stocks
    const symbols = [
        'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'TSLA', 'FB', 'NVDA', 'NFLX', 'ADBE', 'PYPL',
        'CRM', 'V', 'WMT', 'JNJ', 'PG', 'BAC', 'JPM', 'KO', 'PFE', 'XOM'
    ];

    return (
        <Container className="list-container" style={{  marginLeft: '27rem',
    paddingRight: '29rem'}} maxWidth="md">
            <Box
                sx={{
                    marginTop: 4,
                    padding: 3,
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                }}
            >
            {/* mui Typography is used */}
                <Typography variant="h4" gutterBottom color="primary">
                    List of Stocks
                </Typography>
                <MUIList className="list" component="ul">
                    {symbols.map(symbol => (
                        <ListItem key={symbol} >
                            <ListItemText primary={symbol} />
                        </ListItem>
                    ))}
                </MUIList>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/check")}
                    sx={{ mt: 2 }}
                >
                    Check Price
                </Button>
            </Box>
        </Container>
    );
};

export default List;
