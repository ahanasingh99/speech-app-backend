'use client'
import React, { Component } from 'react'
import Error from '@/components/Error'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Error
          localerror="Client side error"
          localmessage={`Something went wrong: ${this.state.error.toString()}`}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
