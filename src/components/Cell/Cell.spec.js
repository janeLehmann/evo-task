import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { toHaveClass, toBeInTheDocument, toHaveAttribute } from '@testing-library/jest-dom';
import { create } from 'react-test-renderer';

import Cell from './Cell';

expect.extend({ toHaveClass, toBeInTheDocument, toHaveAttribute });

const renderComponent = (overrides = {}, useReactTestRenderer = false) => {
  const props = {
    cellClick: jest.fn(),
    title: '□',
    isBomb: false,
    ...overrides,
  };

  if (!useReactTestRenderer) {
    /* eslint-disable react/prop-types, react/jsx-props-no-spreading */
    return render(
      <Cell {...props} />,
    );
    /* eslint-enable react/prop-types, react/jsx-props-no-spreading */
  }

  /* eslint-disable react/prop-types, react/jsx-props-no-spreading */
  return create(
    <Cell {...props} />,
  );
  /* eslint-enable react/prop-types, react/jsx-props-no-spreading */
};

it('should render closed cell and fire a click event on it', () => {
  const cellClick = jest.fn();
  const $ = renderComponent({
    cellClick: cellClick,
  });

  const cellButton = $.getByTestId('cell');
  expect(cellButton).toHaveAttribute('type', 'button');
  expect(cellButton).toHaveClass('cell');
  expect($.getByText('closed-bg.svg')).toBeInTheDocument();

  fireEvent.click(cellButton);
  expect(cellClick).toHaveBeenCalledTimes(1);
});

it('should render open cell with no digit', () => {
  const $ = renderComponent({
    title: '0',
  });

  expect($.getByText('open-bg.svg')).toBeInTheDocument();
});

it('should render open cell with title 1', () => {
  const $ = renderComponent({
    title: '1',
  });

  const cellButton = $.getByTestId('cell');
  expect(cellButton).toHaveClass('cell_blue');
  expect($.getByText('open-bg.svg')).toBeInTheDocument();
  expect($.getByText('1')).toBeInTheDocument();
});

it('should render open cell with title 2', () => {
  const $ = renderComponent({
    title: '2',
  });

  const cellButton = $.getByTestId('cell');
  expect(cellButton).toHaveClass('cell_green');
  expect($.getByText('open-bg.svg')).toBeInTheDocument();
  expect($.getByText('2')).toBeInTheDocument();
});

it('should render open cell with title 3', () => {
  const $ = renderComponent({
    title: '3',
  });

  const cellButton = $.getByTestId('cell');
  expect(cellButton).toHaveClass('cell_red');
  expect($.getByText('open-bg.svg')).toBeInTheDocument();
  expect($.getByText('3')).toBeInTheDocument();
});

it('should render open cell with title 4', () => {
  const $ = renderComponent({
    title: '4',
  });

  const cellButton = $.getByTestId('cell');
  expect(cellButton).toHaveClass('cell_dark-red');
  expect($.getByText('open-bg.svg')).toBeInTheDocument();
  expect($.getByText('4')).toBeInTheDocument();
});


it('should render open cell with title 5', () => {
  const $ = renderComponent({
    title: '5',
  });

  const cellButton = $.getByTestId('cell');
  expect(cellButton).toHaveClass('cell_burgundy');
  expect($.getByText('open-bg.svg')).toBeInTheDocument();
  expect($.getByText('5')).toBeInTheDocument();
});

it('should render cell with possible bomb icon', () => {
  const $ = renderComponent({
    isBomb: true,
  });

  expect($.getByText('possible-bomb.svg')).toBeInTheDocument();
});
