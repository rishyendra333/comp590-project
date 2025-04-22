# backend/volatility_estimators.py
import numpy as np
import pandas as pd

def close_to_close_volatility(data):
    """Standard close-to-close volatility."""
    returns = np.log(data['Close'] / data['Close'].shift(1))
    volatility = returns.rolling(window=1).std() * np.sqrt(252)
    return volatility.dropna()

def parkinson_volatility(data):
    """Parkinson's extreme value volatility estimator."""
    high_low_ratio = np.log(data['High'] / data['Low'])
    volatility = high_low_ratio / (2 * np.sqrt(np.log(2))) * np.sqrt(252)
    return volatility.dropna()

def garman_klass_volatility(data):
    """Garman-Klass volatility estimator."""
    high_low = np.log(data['High'] / data['Low'])
    close_open = np.log(data['Close'] / data['Open'])
    
    volatility = np.sqrt(
        0.5 * high_low**2 - 
        (2 * np.log(2) - 1) * close_open**2
    ) * np.sqrt(252)
    
    # Handle potential NaN or negative values
    volatility = np.where(
        volatility < 0, 
        parkinson_volatility(data), 
        volatility
    )
    
    return pd.Series(volatility, index=data.index).dropna()

def rogers_satchell_volatility(data):
    """Rogers-Satchell volatility estimator."""
    high_close = np.log(data['High'] / data['Close'])
    high_open = np.log(data['High'] / data['Open'])
    low_close = np.log(data['Low'] / data['Close'])
    low_open = np.log(data['Low'] / data['Open'])
    
    volatility = np.sqrt(
        high_close * high_open + 
        low_close * low_open
    ) * np.sqrt(252)
    
    return volatility.dropna()

def yang_zhang_volatility(data):
    """Yang-Zhang volatility estimator."""
    try:
        # Overnight volatility
        overnight_returns = np.log(data['Open'] / data['Close'].shift(1))
        overnight_vol = overnight_returns.std()
        
        # Open volatility 
        open_returns = np.log(data['Open'] / data['Open'].mean())
        open_vol = open_returns.std()
        
        # Close volatility
        close_returns = np.log(data['Close'] / data['Close'].mean())
        close_vol = close_returns.std()
        
        # Rogers-Satchell component (already calculated on a rolling basis)
        rs_vol = rogers_satchell_volatility(data)
        
        # Optimal k parameter
        n = len(data)
        k = 0.34 / (1.34 + (n + 1) / (n - 1))
        
        # Rolling Yang-Zhang volatility calculation for each day
        volatility_series = []
        
        for i in range(len(data)):
            if i == 0:
                volatility_series.append(np.nan)
                continue
                
            # Use a window for the calculation
            window_size = min(i+1, 20)  # Use at most 20 days
            
            overnight_window = overnight_returns.iloc[max(0, i-window_size+1):i+1]
            open_window = open_returns.iloc[max(0, i-window_size+1):i+1]
            rs_window = rs_vol.iloc[max(0, i-window_size+1):i+1]
            
            if len(overnight_window) > 1:
                overnight_var = overnight_window.var()
                open_var = open_window.var()
                rs_mean = rs_window.mean() ** 2 / 252
                
                volatility = np.sqrt(
                    overnight_var + k * open_var + (1 - k) * rs_mean
                ) * np.sqrt(252)
                
                volatility_series.append(volatility)
            else:
                volatility_series.append(np.nan)
        
        result = pd.Series(volatility_series, index=data.index)
        return result.dropna()
        
    except Exception as e:
        print(f"Yang-Zhang error: {e}")
        # Fallback to simple volatility if calculation fails
        return close_to_close_volatility(data)