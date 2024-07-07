import React from 'react';
import { render } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
const { expect, describe, it } = require('@jest/globals');
import '@testing-library/jest-dom'


import { Home } from "../../src/client/pages/Home";
import { Delivery } from "../../src/client/pages/Delivery";
import { Contacts } from "../../src/client/pages/Contacts";


describe('Страницы', () => {
  it('главная страница должна иметь статическое содержимое', async () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });

  it('страница с условиями доставки должна иметь статическое содержимое', async () => {
    const { container } = render(<Delivery />);
    expect(container).toMatchSnapshot();
  });

  it('страница с контактами должна иметь статическое содержимое', async () => {
    const { container } = render(<Contacts />);
    expect(container).toMatchSnapshot();
  });
});


