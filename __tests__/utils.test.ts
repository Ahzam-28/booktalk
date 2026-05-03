import { cn } from '../lib/utils';

describe('Utility Functions - Test Suite', () => {
    describe('cn()', () => {
        it('merges generic tailwind classes correctly', () => {
            const result = cn('bg-red-500', 'text-white');
            expect(result).toBe('bg-red-500 text-white');
        });

        it('handles conditional classes properly', () => {
            const isActive = true;
            const result = cn('base-class', isActive && 'active-class');
            expect(result).toBe('base-class active-class');
        });

        it('resolves tailwind conflicts using tailwind-merge', () => {
            // Evaluates taking the last provided utility for the same CSS property
            const result = cn('px-2 py-1', 'p-4'); 
            expect(result).toBe('p-4');
        });
    });
});