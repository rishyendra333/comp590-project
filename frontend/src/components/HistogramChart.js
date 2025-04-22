// frontend/src/components/HistogramChart.js
import React from 'react';
import Plot from 'react-plotly.js';
import { Paper, Typography } from '@mui/material';

const HistogramChart = ({ data }) => {
  const traces = data.map(estimator => ({
    x: estimator.values.map(item => item.value),
    name: estimator.name,
    type: 'histogram',
    opacity: 0.6,
    nbinsx: 30
  }));

  const layout = {
    title: 'Volatility Distribution',
    xaxis: { title: 'Volatility', tickformat: '.1%' },
    yaxis: { title: 'Frequency' },
    barmode: 'overlay',
    showlegend: true,
    legend: { orientation: 'h', y: -0.2 }
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Volatility Distributions
      </Typography>
      <Plot
        data={traces}
        layout={layout}
        style={{ width: '100%', height: '400px' }}
      />
    </Paper>
  );
};

export default HistogramChart;