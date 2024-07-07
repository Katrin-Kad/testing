import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
const { expect, describe, it } = require('@jest/globals');

import { Cart } from '../../src/client/pages/Cart';
import { clearCart, checkout } from '../../src/client/store';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('../../src/client/store', () => ({
    clearCart: jest.fn(),
    checkout: jest.fn(),
}));


describe('Корзина', () => {
    const mockDispatch = jest.fn();
    const mockProducts = {
        1: { id: 1, name: 'Product 1', price: 10, count: 1 },
        2: { id: 2, name: 'Product 2', price: 20, count: 2 },
    };
    const mockLatestOrderId = '12345';

    beforeEach(() => {
        jest.mocked(useDispatch).mockReturnValue(mockDispatch);
        jest.mocked(useSelector).mockImplementation(selector => selector({
            cart: mockProducts,
            latestOrderId: mockLatestOrderId,
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('в корзине должна отображаться таблица с добавленными в нее товарами, где для каждого товара должны отображаться название, цена, количество , стоимость', () => {
        const { getByTestId } = render(<Cart />, { wrapper: MemoryRouter });

        expect(getByTestId('1').innerHTML).toBe('<th class="Cart-Index" scope="row">1</th><td class="Cart-Name">Product 1</td><td class="Cart-Price">$10</td><td class="Cart-Count">1</td><td class="Cart-Total">$10</td>');
        expect(getByTestId('2').innerHTML).toBe('<th class="Cart-Index" scope="row">2</th><td class="Cart-Name">Product 2</td><td class="Cart-Price">$20</td><td class="Cart-Count">2</td><td class="Cart-Total">$40</td>');
    });

    it('должна отображаться общая сумма заказа', () => {
        const total = Object.values(mockProducts).reduce((sum, { count, price }) => sum + count * price, 0);
        render(<Cart />, { wrapper: MemoryRouter });

        const totalPriceElement = document.querySelector('.Cart-OrderPrice') as Element;
        expect(totalPriceElement.innerHTML).toBe(`$${total}`);
    });


    it('если корзина пустая, должна отображаться ссылка на каталог товаров', () => {
        jest.mocked(useSelector).mockImplementation(selector => selector({
            cart: {},
            latestOrderId: null,
        }));

        const { container, getByRole } = render(<Cart />, { wrapper: MemoryRouter });
        expect(container).toContainHTML('Cart is empty. Please select products in the');
        expect(getByRole('link', { name: /catalog/i })).toHaveAttribute('href', '/catalog');
    });

    it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
        const { getByText } = render(<Cart />, { wrapper: MemoryRouter });
        const clearButton = getByText('Clear shopping cart');

        fireEvent.click(clearButton);

        await waitFor(() => {
            expect(clearCart).toHaveBeenCalledTimes(1);
        });
    });



});