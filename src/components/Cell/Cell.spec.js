import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cell from './Cell.component';

describe('container for the Image', () => {
  test('should display an image with alternativ text', () => {
    render(<Cell />);
    const cell = screen.getByTestId('cell');
    expect(cell).toBeInTheDocument();
  });
});
