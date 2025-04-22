// frontend/src/components/StatsTable.js
import React from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography 
} from '@mui/material';

const StatsTable = ({ data }) => {
  const formatPercent = (value) => (value * 100).toFixed(2) + '%';
  const formatNumber = (value) => value.toFixed(4);

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Summary Statistics
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Estimator</TableCell>
              <TableCell align="right">Mean</TableCell>
              <TableCell align="right">Std Dev</TableCell>
              <TableCell align="right">Min</TableCell>
              <TableCell align="right">Max</TableCell>
              <TableCell align="right">Skewness</TableCell>
              <TableCell align="right">Kurtosis</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((estimator) => (
              <TableRow key={estimator.name}>
                <TableCell component="th" scope="row">
                  {estimator.name}
                </TableCell>
                <TableCell align="right">{formatPercent(estimator.stats.mean)}</TableCell>
                <TableCell align="right">{formatPercent(estimator.stats.std)}</TableCell>
                <TableCell align="right">{formatPercent(estimator.stats.min)}</TableCell>
                <TableCell align="right">{formatPercent(estimator.stats.max)}</TableCell>
                <TableCell align="right">{formatNumber(estimator.stats.skew)}</TableCell>
                <TableCell align="right">{formatNumber(estimator.stats.kurtosis)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default StatsTable;