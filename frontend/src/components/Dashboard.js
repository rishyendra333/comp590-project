// frontend/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { fetchVolatilityData, fetchEstimatorInfo } from '../services/api';
import VolatilityChart from './VolatilityChart';
import HistogramChart from './HistogramChart';
import StatsTable from './StatsTable';
import EstimatorInfo from './EstimatorInfo';
import { 
  TextField, 
  Button, 
  Paper, 
  CircularProgress,
  Alert,
  Box,
  Typography
} from '@mui/material';

const Dashboard = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [data, setData] = useState(null);
  const [estimatorInfo, setEstimatorInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEstimatorInfo()
      .then(info => setEstimatorInfo(info))
      .catch(err => console.error('Failed to fetch estimator info:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchVolatilityData(symbol, startDate, endDate);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Stock Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
            />
            <Button 
              variant="contained" 
              type="submit" 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Analyze'}
            </Button>
          </Box>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {data && (
        <>
          <Typography variant="h5" gutterBottom>
            Volatility Analysis for {data.symbol}
          </Typography>
          
          <VolatilityChart data={data.data} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mt: 3 }}>
            <HistogramChart data={data.data} />
            <StatsTable data={data.data} />
          </Box>
          
          <EstimatorInfo info={estimatorInfo} />
        </>
      )}
    </Box>
  );
};

export default Dashboard;