import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from './Board.component';
import { useOktaAuth } from '@okta/okta-react';  // Import the useOktaAuth hook

jest.mock('@okta/okta-react');  // Mock the useOktaAuth hook

describe('Board', () => {
  test('should display', () => {
    const mockAuth = {
      authState: {
        isAuthenticated: true,
        // Add any other properties needed for testing
      },
      oktaAuth : true
      // Add any other mock methods needed for testing
    };
    
  useOktaAuth.mockReturnValue(mockAuth);
   const container =  render(<Board />);
    expect(container).toMatchSnapshot();
  });
});
