import { render, screen } from '@testing-library/react';
import { getLadder, getSnakes } from './util';

describe('utils', () => {
  test('get Snakes', () => {
    expect(getSnakes()).toHaveLength(6);
  });

  test('get Ladder', () => {
    expect(getLadder()).toHaveLength(5);
  });
});
