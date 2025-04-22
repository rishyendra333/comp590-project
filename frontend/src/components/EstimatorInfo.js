// frontend/src/components/EstimatorInfo.js
import React from 'react';
import { 
  Paper, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const EstimatorInfo = ({ info }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        About the Volatility Estimators
      </Typography>
      {Object.entries(info).map(([name, details]) => (
        <Accordion key={name}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">{name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Typography variant="body1" paragraph>
                <strong>Description:</strong> {details.description}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Advantages:</strong> {details.advantages}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Disadvantages:</strong> {details.disadvantages}
              </Typography>
              <Typography variant="body1" component="div">
                <strong>Formula:</strong>
                <Box component="span" sx={{ 
                  fontFamily: 'monospace', 
                  backgroundColor: '#f5f5f5',
                  padding: '4px 8px',
                  borderRadius: 1,
                  display: 'inline-block',
                  margin: '4px 0'
                }}>
                  {details.formula}
                </Box>
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};

export default EstimatorInfo;