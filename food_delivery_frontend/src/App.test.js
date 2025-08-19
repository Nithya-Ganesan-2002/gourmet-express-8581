import { render, screen } from '@testing-library/react';
import AppWithProviders from './App';

test('renders navbar restaurants link', () => {
  render(<AppWithProviders />);
  const linkElement = screen.getByText(/Restaurants/i);
  expect(linkElement).toBeInTheDocument();
});
