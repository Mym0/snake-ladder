import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageContainer from './ImageContainer.component';

describe('container for the Image', () => {
  test('should display an image with alternativ text', () => {
    render(<ImageContainer />);
    const image = screen.getByAltText('snakeladder');
    expect(image).toBeInTheDocument();
  });
});
