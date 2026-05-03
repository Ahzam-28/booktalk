import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../../components/ui/button';

describe('Button Component', () => {
    it('renders correctly with default props', () => {
        render(<Button>Click Me</Button>);
        const button = screen.getByRole('button', { name: 'Click Me' });
        
        expect(button).toBeInTheDocument();
        // Since we are using tailwind-merge, it should contain the primary classes
        expect(button).toHaveClass('bg-primary');
    });

    it('applies destructive variant classes when variant="destructive"', () => {
        render(<Button variant="destructive">Delete</Button>);
        const button = screen.getByRole('button', { name: 'Delete' });
        
        expect(button).toHaveClass('bg-destructive');
    });

    it('renders as a custom child when asChild is true', () => {
        render(
            <Button asChild>
                <a href="/login">Login Link</a>
            </Button>
        );
        
        // Should render an anchor tag with the button classes
        const link = screen.getByRole('link', { name: 'Login Link' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/login');
        expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });

    it('is disabled when disabled prop is passed', () => {
        render(<Button disabled>Disabled Button</Button>);
        const button = screen.getByRole('button', { name: 'Disabled Button' });
        
        expect(button).toBeDisabled();
    });
});
