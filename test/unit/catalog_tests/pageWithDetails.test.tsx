import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {useDispatch} from 'react-redux';
const { expect, describe, it } = require('@jest/globals');

import { ProductDetails } from '../../../src/client/components/ProductDetails';
import { Product } from '../../../src/common/types';
import { addToCart } from '../../../src/client/store';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
}));
jest.mock('../../../src/client/components/Image', () => ({
    Image: jest.fn(() => <img data-testid="mock-image" />),
}));

jest.mock('../../../src/client/components/CartBadge', () => ({
    CartBadge: jest.fn(() => <span data-testid="mock-cart-badge">Item in cart</span>),
}));

beforeEach(() => {
    const mockDispatch = jest.fn();
    jest.mocked(useDispatch).mockReturnValue(mockDispatch);
})

const product: Product = {
    id: 1,
    name: 'Product',
    description: 'Description',
    price: 99.99,
    color: 'red',
    material: 'plastic',
};

describe('Страница с подробной информацией', () => {
    it('на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', () => {
        const { getByText, getByTestId } = render(
            <ProductDetails product={product} />
        );
        expect(getByText(product.name)).toBeInTheDocument();
        expect(getByText(product.description)).toBeInTheDocument();
        expect(getByText(`$${product.price}`)).toBeInTheDocument();
        expect(getByText('Add to Cart')).toBeInTheDocument();
        expect(getByTestId('mock-image')).toBeInTheDocument();
        expect(getByTestId('mock-cart-badge')).toBeInTheDocument();
        expect(getByText('Color')).toBeInTheDocument();
        expect(getByText(product.color)).toBeInTheDocument();
        expect(getByText('Material')).toBeInTheDocument();
        expect(getByText(product.material)).toBeInTheDocument();
    });
});