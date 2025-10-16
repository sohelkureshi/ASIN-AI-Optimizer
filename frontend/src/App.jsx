import React, { useState } from 'react';
import './App.css';
import ASINInput from './components/ASINInput';
import ComparisonView from './components/ComparisonView';
import HistoryList from './components/HistoryList';
import api from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [optimizationData, setOptimizationData] = useState(null);
  const [currentAsin, setCurrentAsin] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Handle ASIN submission

const handleOptimize = async (asin, marketplace = 'auto') => {
  setLoading(true);
  setError(null);
  setOptimizationData(null);
  setCurrentAsin(asin);

  try {
    const response = await api.optimizeProduct(asin, marketplace);
    setOptimizationData(response);
    setLoading(false);
  } catch (err) {
    setError(err.response?.data?.error || err.message || 'Failed to optimize product');
    setLoading(false);
  }
};


  // Fetch history for specific ASIN
  const handleViewHistory = async (asin) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getHistory(asin);
      setHistory(response.history);
      setShowHistory(true);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch history');
      setLoading(false);
    }
  };

  // Reset view
  const handleReset = () => {
    setOptimizationData(null);
    setError(null);
    setCurrentAsin('');
    setHistory([]);
    setShowHistory(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Amazon Product Listing Optimizer</h1>
      </header>

      <main className="App-main">
        {!optimizationData && !showHistory && (
          <ASINInput 
            onOptimize={handleOptimize} 
            onViewHistory={handleViewHistory}
            loading={loading}
          />
        )}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Processing... This may take a moment</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={handleReset} className="btn-reset">Try Again</button>
          </div>
        )}

        {optimizationData && !loading && (
          <div className="results-container">
            <div className="results-header">
              <h2>Optimization Results for ASIN: {currentAsin}</h2>
              <div className="button-group">
                <button onClick={() => handleViewHistory(currentAsin)} className="btn-history">
                  View History
                </button>
                <button onClick={handleReset} className="btn-new">
                  New Optimization
                </button>
              </div>
            </div>
            <ComparisonView data={optimizationData} />
          </div>
        )}

        {showHistory && !loading && (
          <div className="history-container">
            <div className="history-header">
              <h2>Optimization History</h2>
              <button onClick={handleReset} className="btn-back">
                Back to Home
              </button>
            </div>
            <HistoryList history={history} />
          </div>
        )}
      </main>

      <footer className="App-footer">
        <p>Powered by Gemini AI | Amazon Product Listing Optimizer</p>
      </footer>
    </div>
  );
}

export default App;
