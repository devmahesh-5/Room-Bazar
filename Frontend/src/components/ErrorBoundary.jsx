// src/components/ErrorBoundary.jsx
import { Component } from 'react';
import ErrorPage from '../pages/ErrorPage.jsx';

export class ErrorBoundary extends Component {
  state = { hasError: false };
    
    
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    console.log(this.state.hasError);
    
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children; 
  }
}