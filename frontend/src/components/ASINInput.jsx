import React, { useState } from 'react';
import '../styles/ASINInput.css'
const ASINInput = ({ onOptimize, onViewHistory, loading }) => {
  const [asin, setAsin] = useState('');
  const [error, setError] = useState('');

  const validateASIN = (value) => {
    const asinPattern = /^[A-Z0-9]{10}$/;
    return asinPattern.test(value.toUpperCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedAsin = asin.trim().toUpperCase();

    if (!trimmedAsin) {
      setError('Please enter an ASIN');
      return;
    }

    if (!validateASIN(trimmedAsin)) {
      setError('Invalid ASIN format. ASIN should be 10 alphanumeric characters');
      return;
    }

    onOptimize(trimmedAsin, null);
  };

  const handleViewHistory = () => {
    const trimmedAsin = asin.trim().toUpperCase();

    if (!trimmedAsin) {
      setError('Please enter an ASIN to view history');
      return;
    }

    if (!validateASIN(trimmedAsin)) {
      setError('Invalid ASIN format. ASIN should be 10 alphanumeric characters');
      return;
    }

    onViewHistory(trimmedAsin);
  };

  return (
    <div className="asin-input-container">
      <div className="two-column-layout">
        
        {/* Left Card - Input Form */}
        <div className="input-card">
          <div className="info-section">
            <h3>What is an ASIN?</h3>
            <p>Amazon Standard Identification Number (ASIN) is a unique 10-character identifier for products on Amazon. You can find it in the product details section or in the URL.</p>
          </div>

          <form onSubmit={handleSubmit} className="asin-form">
            <div className="input-group">
              <label htmlFor="asin">ASIN Number</label>
              <input
                id="asin"
                type="text"
                placeholder="e.g., B08N5WRWNW"
                value={asin}
                onChange={(e) => {
                  setAsin(e.target.value);
                  setError('');
                }}
                maxLength={10}
                className={`asin-input ${error ? 'input-error' : ''}`}
                disabled={loading}
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <div className="button-group">
              <button type="submit" className="btn-optimize" disabled={loading}>
                {loading ? 'Processing...' : 'Optimize Listing'}
              </button>
              <button type="button" onClick={handleViewHistory} className="btn-view-history" disabled={loading}>
                View History
              </button>
            </div>
          </form>
        </div>

        {/* Right Card - Supported Marketplaces */}
        <div className="supported-card">
          <h3> Supported Marketplaces are ...</h3>
          <div className="marketplace-links">
            <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer">
              🇺🇸 Amazon.com (United States)
            </a>
            <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer">
              🇮🇳 Amazon.in (India)
            </a>
            <a href="https://www.amazon.co.uk" target="_blank" rel="noopener noreferrer">
              🇬🇧 Amazon.co.uk (United Kingdom)
            </a>
          </div>
          <p className="auto-detect-text">The system will automatically detect and try all supported marketplaces.</p>
          <div className="notice">
            <strong>Note:</strong> ASINs from other Amazon marketplaces (Japan, Germany, France, etc.) are not currently supported.
          </div>
        </div>

      </div>
    </div>
  );
};

export default ASINInput;
