import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '30px',
          margin: '20px',
          background: '#fee2e2',
          border: '2px solid #ef4444',
          borderRadius: '8px',
          color: '#991b1b',
          fontFamily: 'sans-serif'
        }}>
          <h2 style={{ margin: '0 0 10px 0' }}>⚠️ Render Error Encountered</h2>
          <p style={{ margin: '0 0 10px 0', fontWeight: 600 }}>{this.state.error?.toString()}</p>
          <pre style={{
            background: '#ffffff',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            overflowX: 'auto',
            border: '1px solid #fca5a5'
          }}>
            {this.state.errorInfo?.componentStack || 'No stack trace available'}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              background: '#b91c1c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Reload FloodLens
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

