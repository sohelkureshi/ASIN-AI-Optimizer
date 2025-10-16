import React from 'react';
import '../styles/ComparisonView.css';

const ComparisonView = ({ data }) => {
  const { original, optimized } = data;

  return (
    <div className="comparison-view">
      <div className="comparison-grid">
        {/* Original Section */}
        <div className="comparison-column original">
          <div className="column-header">
            <h3>Original Listing</h3>
          </div>

          <div className="section">
            <h4>Title</h4>
            <p className="content">{original.title}</p>
          </div>

          <div className="section">
            <h4>Bullet Points</h4>
            <ul className="bullet-list">
              {original.bulletPoints && original.bulletPoints.length > 0 ? (
                original.bulletPoints.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))
              ) : (
                <li className="no-data">No bullet points available</li>
              )}
            </ul>
          </div>

          <div className="section">
            <h4>Description</h4>
            <p className="content">{original.description || 'No description available'}</p>
          </div>
        </div>

        {/* Optimized Section */}
        <div className="comparison-column optimized">
          <div className="column-header">
            <h3>AI-Optimized Listing</h3>
          </div>

          <div className="section">
            <h4>Title</h4>
            <p className="content">{optimized.title}</p>
          </div>

          <div className="section">
            <h4>Bullet Points</h4>
            <ul className="bullet-list">
              {optimized.bulletPoints && optimized.bulletPoints.length > 0 ? (
                optimized.bulletPoints.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))
              ) : (
                <li className="no-data">No bullet points generated</li>
              )}
            </ul>
          </div>

          <div className="section">
            <h4>Description</h4>
            <p className="content">{optimized.description}</p>
          </div>

          <div className="section keywords-section">
            <h4>Suggested Keywords</h4>
            <div className="keywords-container">
              {optimized.keywords && optimized.keywords.length > 0 ? (
                optimized.keywords.map((keyword, index) => (
                  <span key={index} className="keyword-tag">{keyword}</span>
                ))
              ) : (
                <span className="no-data">No keywords generated</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
