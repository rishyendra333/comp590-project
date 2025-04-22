// frontend/src/components/VolatilityChart.js
import React from 'react';
import Plot from 'react-plotly.js';
import { Paper, Typography } from '@mui/material';

const VolatilityChart = ({ data }) => {
  const traces = data.map(estimator => ({
    x: estimator.rolling_values.map(item => item.Date),
    y: estimator.rolling_values.map(item => item.value),
    name: estimator.name,
    type: 'scatter',
    mode: 'lines'
  }));

  const layout = {
    title: 'Rolling Volatility Comparison (20-day window)',
    xaxis: { title: 'Date' },
    yaxis: { title: 'Annualized Volatility', tickformat: '.1%' },
    showlegend: true,
    legend: { orientation: 'h', y: -0.2 },
    margin: { t: 40, b: 80 }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Rolling Volatility Time Series
      </Typography>
      <Plot
        data={traces}
        layout={layout}
        style={{ width: '100%', height: '500px' }}
      />
    </Paper>
  );
};

export default VolatilityChart;