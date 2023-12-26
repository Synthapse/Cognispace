import { render, screen } from '@testing-library/react';
import App from './App';

test('renders COGNISPACE', () => {
  render(<App />);
  const linkElement = screen.getByText(/COGNISPACE/i);
  expect(linkElement).toBeInTheDocument();
});
