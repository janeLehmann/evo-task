import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { toHaveClass, toBeInTheDocument, toHaveTextContent } from '@testing-library/jest-dom';
import { create } from 'react-test-renderer';

import ChooseLevel from './ChooseLevel';

expect.extend({ toHaveClass, toBeInTheDocument, toHaveTextContent });

const levels = [
  {
    title: '1',
    desc: '10x10 cells',
    onClick: jest.fn(),
  },
  {
    title: '2',
    desc: '20x40 cells',
    onClick: jest.fn(),
  },
];

const renderComponent = (overrides = {}, useReactTestRenderer = false) => {
  const props = {
    levels: levels,
    ...overrides,
  };

  if (!useReactTestRenderer) {
    /* eslint-disable react/prop-types, react/jsx-props-no-spreading */
    return render(<ChooseLevel {...props} />);
    /* eslint-enable react/prop-types, react/jsx-props-no-spreading */
  }

  /* eslint-disable react/prop-types, react/jsx-props-no-spreading */
  return create(<ChooseLevel {...props} />);
  /* eslint-enable react/prop-types, react/jsx-props-no-spreading */
};

it('should render list of 2 items', () => {
  const buttonClick1 = jest.fn();
  const buttonClick2 = jest.fn();
  const $ = renderComponent({
    levels: [
      {
        ...levels[0],
        onClick: buttonClick1,
      },
      {
        ...levels[1],
        onClick: buttonClick2,
      },
    ],
  });

  const items = $.getAllByTestId('choose-level-item');
  expect(items.length).toBe(2);
  const button1 = $.getByText('Level 1');
  const button2 = $.getByText('Level 2');
  expect(button1).toBeInTheDocument();
  expect(button2).toBeInTheDocument();

  fireEvent.click(button1);
  expect(buttonClick1).toHaveBeenCalledTimes(1);

  fireEvent.click(button2);
  expect(buttonClick2).toHaveBeenCalledTimes(1);

  expect($.container).toMatchSnapshot();
});
