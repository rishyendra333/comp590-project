# backend/app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import numpy as np
from volatility_estimators import (
    close_to_close_volatility,
    parkinson_volatility,
    garman_klass_volatility,
    rogers_satchell_volatility,
    yang_zhang_volatility
)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StockRequest(BaseModel):
    symbol: str
    start_date: str
    end_date: str

@app.post("/api/volatility")
async def get_volatility(request: StockRequest):
    try:
        # Download stock data
        stock = yf.Ticker(request.symbol)
        data = stock.history(start=request.start_date, end=request.end_date)
        
        if data.empty:
            raise HTTPException(status_code=404, detail="No data found for the given symbol and date range")
        
        # Calculate volatility using different estimators
        volatility_data = {
            'Close-to-Close': close_to_close_volatility(data),
            'Parkinson': parkinson_volatility(data),
            'Garman-Klass': garman_klass_volatility(data),
            'Rogers-Satchell': rogers_satchell_volatility(data),
            'Yang-Zhang': yang_zhang_volatility(data)
        }
        
        # Prepare response data
        response_data = []
        for estimator, values in volatility_data.items():
            # Calculate rolling volatility (20-day window)
            rolling_vol = values.rolling(window=20).mean()
            
            # Calculate summary statistics with NaN handling
            stats = {
                'mean': float(values.mean()) if not np.isnan(values.mean()) else 0.0,
                'std': float(values.std()) if not np.isnan(values.std()) else 0.0,
                'min': float(values.min()) if not np.isnan(values.min()) else 0.0,
                'max': float(values.max()) if not np.isnan(values.max()) else 0.0,
                'skew': float(values.skew()) if not np.isnan(values.skew()) else 0.0,
                'kurtosis': float(values.kurtosis()) if not np.isnan(values.kurtosis()) else 0.0
            }
            
            # Convert pandas Series to list of dicts with proper handling of non-finite values
            values_dict = []
            for date, value in values.items():
                if np.isfinite(value):
                    values_dict.append({
                        'Date': date.strftime('%Y-%m-%d'),
                        'value': float(value)
                    })
            
            rolling_dict = []
            for date, value in rolling_vol.items():
                if np.isfinite(value):
                    rolling_dict.append({
                        'Date': date.strftime('%Y-%m-%d'),
                        'value': float(value)
                    })
            
            response_data.append({
                'name': estimator,
                'values': values_dict,
                'rolling_values': rolling_dict,
                'stats': stats
            })
        
        return {
            'data': response_data,
            'symbol': request.symbol.upper()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/estimator-info")
async def get_estimator_info():
    return {
        'Close-to-Close': {
            'description': 'Standard deviation of log returns based on closing prices only.',
            'advantages': 'Simple to calculate, widely used',
            'disadvantages': 'Ignores intraday price movements',
            'formula': 'σ = √(Σ(ln(Ct/Ct-1))²/n)'
        },
        'Parkinson': {
            'description': 'Volatility estimator using high and low prices (Parkinson, 1980).',
            'advantages': 'More efficient than close-to-close, uses range information',
            'disadvantages': 'Assumes continuous trading, may underestimate volatility',
            'formula': 'σ = √(1/(4n*ln(2)) * Σ(ln(Ht/Lt))²)'
        },
        'Garman-Klass': {
            'description': 'Combines high-low range and open-close prices (Garman & Klass, 1980).',
            'advantages': 'More efficient than Parkinson, incorporates opening and closing prices',
            'disadvantages': 'Assumes continuous trading and normal distribution',
            'formula': 'σ = √(0.5*(ln(Ht/Lt))² - (2*ln(2)-1)*(ln(Ct/Ot))²)'
        },
        'Rogers-Satchell': {
            'description': 'Handles non-zero drift without bias (Rogers & Satchell, 1991).',
            'advantages': 'Accounts for drift, robust to opening jumps',
            'disadvantages': 'More complex to calculate',
            'formula': 'σ = √(ln(Ht/Ct)*ln(Ht/Ot) + ln(Lt/Ct)*ln(Lt/Ot))'
        },
        'Yang-Zhang': {
            'description': 'Combines overnight and trading volatility (Yang & Zhang, 2000).',
            'advantages': 'Most efficient estimator, handles opening jumps',
            'disadvantages': 'Most complex to implement',
            'formula': 'σ = √(σ²overnight + k*σ²open + (1-k)*σ²rs)'
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)