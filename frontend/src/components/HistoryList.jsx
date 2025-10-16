import React, { useState } from 'react';
import '../styles/HistoryList.css';

const HistoryList = ({ history }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!history || history.length === 0) {
    return (
      <div className="no-history">
        <p>No optimization history found for this ASIN.</p>
      </div>
    );
  }

  return (
    <div className="history-list">
      <p className="history-count">Total Optimizations: {history.length}</p>

      {history.map((item) => (
        <div key={item.id} className="history-item">
          <div className="history-item-header" onClick={() => toggleExpand(item.id)}>
            <div className="history-info">
              <h4>ASIN: {item.asin}</h4>
              <span className="timestamp">{formatDate(item.created_at)}</span>
            </div>
            <button className="expand-btn">
              {expandedId === item.id ? '▼' : '▶'}
            </button>
          </div>

          {expandedId === item.id && (
            <div className="history-details">
              <div className="details-grid">
                <div className="detail-column">
                  <h5>Original</h5>
                  
                  <div className="detail-section">
                    <p className="label">Title:</p>
                    <p className="text">{item.original_title}</p>
                  </div>

                  <div className="detail-section">
                    <p className="label">Bullet Points:</p>
                    <ul className="detail-list">
                      {item.original_bullet_points && item.original_bullet_points.length > 0 ? (
                        item.original_bullet_points.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))
                      ) : (
                        <li>No bullet points</li>
                      )}
                    </ul>
                  </div>

                  <div className="detail-section">
                    <p className="label">Description:</p>
                    <p className="text">{item.original_description || 'No description'}</p>
                  </div>
                </div>

                <div className="detail-column optimized-column">
                  <h5>Optimized</h5>
                  
                  <div className="detail-section">
                    <p className="label">Title:</p>
                    <p className="text">{item.optimized_title}</p>
                  </div>

                  <div className="detail-section">
                    <p className="label">Bullet Points:</p>
                    <ul className="detail-list">
                      {item.optimized_bullet_points && item.optimized_bullet_points.length > 0 ? (
                        item.optimized_bullet_points.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))
                      ) : (
                        <li>No bullet points</li>
                      )}
                    </ul>
                  </div>

                  <div className="detail-section">
                    <p className="label">Description:</p>
                    <p className="text">{item.optimized_description}</p>
                  </div>

                  <div className="detail-section">
                    <p className="label">Keywords:</p>
                    <div className="keywords-list">
                      {item.keywords && item.keywords.length > 0 ? (
                        item.keywords.map((keyword, index) => (
                          <span key={index} className="keyword-badge">{keyword}</span>
                        ))
                      ) : (
                        <span>No keywords</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
