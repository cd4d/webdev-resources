import React from 'react';
import { render } from '@testing-library/react';
import App from '../app/App';
import { BrowserRouter } from 'react-router-dom';

test('renders "Web resources" default text', () => {
  const { getByText } = render(<BrowserRouter><App /></BrowserRouter>);
  const linkElement = getByText("Web resources");
  expect(linkElement).toBeInTheDocument();
});
