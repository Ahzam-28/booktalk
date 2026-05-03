import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingOverlay from '../../components/LoadingOverlay';

describe('LoadingOverlay Component', () => {
    it('renders the default loading message when no message prop is provided', () => {
        render(<LoadingOverlay />);
        
        // Assert default title is present
        expect(screen.getByText('Synthesizing Your Book')).toBeInTheDocument();
        
        // Assert default message is present
        expect(screen.getByText('Please wait while we process your PDF and prepare your interactive literary experience.')).toBeInTheDocument();
    });

    it('renders a custom loading message when message prop is provided', () => {
        const customMessage = 'Processing chapter 1...';
        render(<LoadingOverlay message={customMessage} />);
        
        // Assert custom message is present
        expect(screen.getByText(customMessage)).toBeInTheDocument();
        
        // Assert default message is NOT present
        expect(screen.queryByText('Please wait while we process your PDF and prepare your interactive literary experience.')).not.toBeInTheDocument();
    });
});
