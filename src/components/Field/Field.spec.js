import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { toHaveClass, toBeInTheDocument, toHaveTextContent } from '@testing-library/jest-dom';
import { create } from 'react-test-renderer';

import Field from './Field';

expect.extend({ toHaveClass, toBeInTheDocument, toHaveTextContent });


const renderComponent = (overrides = {}, useReactTestRenderer = false) => {
  const props = {
    currentLevel: '1',
    goBack: jest.fn(),
    ...overrides,
  };

  if (!useReactTestRenderer) {
    /* eslint-disable react/prop-types, react/jsx-props-no-spreading */
    return render(
      <Field {...props} />,
    );
    /* eslint-enable react/prop-types, react/jsx-props-no-spreading */
  }

  /* eslint-disable react/prop-types, react/jsx-props-no-spreading */
  return create(
    <Field {...props} />,
  );
  /* eslint-enable react/prop-types, react/jsx-props-no-spreading */
};

it('should render field with 100(10x10) cells', async () => {
  const goBack = jest.fn();
  const $ = renderComponent({
    goBack: goBack,
  });

  const cells = await $.findAllByTestId('cell');
  expect(cells.length).toBe(100);

  const goBackButton = $.getByText('Back to start');
  fireEvent.click(goBackButton);
  expect(goBack).toHaveBeenCalledTimes(1);
});

it('should render field with 800(40x20) cells', async () => {
  const $ = renderComponent({
    currentLevel: '2',
  });

  const cells = await $.findAllByTestId('cell');
  expect(cells.length).toBe(800);
});

it('should render field with 5000(100x50) cells', async () => {
  const $ = renderComponent({
    currentLevel: '3',
  });

  const cells = await $.findAllByTestId('cell');
  expect(cells.length).toBe(5000);
});

it('should render field with 25000(500x50) cells', async () => {
  const $ = renderComponent({
    currentLevel: '4',
  });

  const cells = await $.findAllByTestId('cell');
  expect(cells.length).toBe(25000);
});
