import React from 'react';
import { render } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
const { expect, describe, it } = require('@jest/globals');
import '@testing-library/jest-dom'


import { Catalog } from '../../../src/client/pages/Catalog';
import { ProductItem } from "../../../src/client/components/ProductItem";
import { ExampleStore } from '../../../src/server/data';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('../../../src/client/components/ProductItem', () => ({
    ProductItem: jest.fn(() => <div data-testid="product-item" />),
}));

const mockDispatch = jest.fn();
const mockProduct = { id: 1, name: 'Test Product' };

beforeEach(() => {
    jest.mocked(useDispatch).mockReturnValue(mockDispatch);
    jest.mocked(useSelector).mockImplementation(selector => selector({
        products: [mockProduct],
    }));
});

afterEach(() => {
    jest.clearAllMocks();
});


describe('в каталоге должны отображаться товары, список которых приходит с сервера', () => {
    it('список товаров приходит с сервера', () => {
      const store = new ExampleStore();
      expect(store.getAllProducts(0).length).toBe(27);
    });
    it('в каталоге отображаются товары', () => {
      const {container, getByTestId } = render(<Catalog />);
      expect(getByTestId(mockProduct.id)).toBeInTheDocument();
      expect(ProductItem).toHaveBeenCalledWith({ product: mockProduct }, {});
    });
    
});
