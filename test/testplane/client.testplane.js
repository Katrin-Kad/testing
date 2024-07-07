const main_url = "http://localhost:3000/hw/store/?bug_id=2"
const catalog_url = "http://localhost:3000/hw/store/catalog"

describe('вёрстка должна адаптироваться под ширину экрана', function() {

    const viewports = [
        { width: 1400, maxWidth: 1320 },
        { width: 1200, maxWidth: 1140 },
        { width: 992, maxWidth: 960 },
        { width: 768, maxWidth: 720 },
        { width: 576, maxWidth: 540 },
    ];

    viewports.forEach(viewport => {
        it(`верстка корректно применяется на ширине ${viewport.width}px`, async ({ browser }) => {
            await browser.setWindowSize(viewport.width, 1000); 
            await browser.url(main_url);
            
            const containers = await browser.$$('.container');

            for (let container of containers) {
                const containerMaxWidth = await container.getCSSProperty('max-width');
                expect(parseInt(containerMaxWidth.value)).toBe(viewport.maxWidth);
            }
        });
    });
});

describe('Общие требования', function() {
    it('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', async ({ browser }) => { 
        await browser.url(main_url); 
 
        const navItems = await browser.$$('.navbar-nav .nav-link'); 

        const expectedLinks = [
            { text: 'Catalog', href: '/hw/store/catalog' },
            { text: 'Delivery', href: '/hw/store/delivery' },
            { text: 'Contacts', href: '/hw/store/contacts' },
            { text: 'Cart', href: '/hw/store/cart' }
        ];

        for (let i = 0; i < navItems.length; i++) {
            const item = navItems[i];
            const itemText = await item.getText();
            const itemHref = await item.getAttribute('href');

            const expectedLink = expectedLinks.find(link => link.text === itemText);
            expect(expectedLink).toBeDefined();
            expect(itemHref).toContain(expectedLink.href);
        }
    })

    it('название магазина в шапке должно быть ссылкой на главную страницу', async ({ browser }) => { 
        await browser.url(main_url); 
 
        const link = await browser.$('.navbar .Application-Brand.navbar-brand'); 
        const linkHref = await link.getAttribute('href')  
        expect(linkHref).toEqual('/hw/store') 

    })

    it('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async ({ browser }) => {
        await browser.url(main_url); 
        await browser.setWindowSize(575, 1000);

        const button = await browser.$('.navbar-toggler');
        const buttonDisplay = await button.getCSSProperty('display');
        expect(buttonDisplay.value).not.toBe("none");

        const navBar = await browser.$('.navbar-collapse');
        const navBarDisplay = await navBar.getCSSProperty('display');
        expect(navBarDisplay.value).not.toBe("flex");

        const nav = await browser.$('.navbar-nav');
        const navFlexDirection = await nav.getCSSProperty('flex-direction');
        expect(navFlexDirection.value).not.toBe("row");
        
    })

    it('при выборе элемента из меню "гамбургера", меню должно закрываться', async ({browser}) => {
        await browser.url(main_url);
        await browser.setWindowSize(575, 1000);

        const button = await browser.$('.navbar-toggler');
        await button.click();

        const menuItemHref = '/hw/store/catalog';
        const menuItem = await browser.$(`.navbar-nav .nav-link[href="${menuItemHref}"]`);
        await menuItem.click();

        const navBar = await browser.$('.navbar-collapse');
        const navBarDisplayAfterClick = await navBar.getCSSProperty('display');
        expect(navBarDisplayAfterClick.value).toBe("none");
    })
});

describe('Каталог', function() {
    it('для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async ({ browser }) => {
            await browser.url(catalog_url);
            const productName = await browser.$('.ProductItem-Name');
            const productPrice = await browser.$('.ProductItem-Price');
            const productLink = await browser.$('.ProductItem-DetailsLink');
            const href = await productLink.getAttribute('href');
    
            expect(productName.isDisplayed()).toBeTruthy();
            expect(productPrice.isDisplayed()).toBeTruthy();
            expect(productLink.isDisplayed()).toBeTruthy();
            expect(href).toBe('/hw/store/catalog/0');
    });

    it('при клике отображается соответсвующая страница товара', async ({ browser }) => {
        await browser.url(catalog_url);
        const productName = await browser.$('.ProductItem-Name').getText();
        const productPrice = await browser.$('.ProductItem-Price').getText();
        const productLink = await browser.$('.ProductItem-DetailsLink');

        await productLink.click();
        const productNameOnPage = await browser.$('.ProductDetails-Name').getText();
        const productPriceOnPage = await browser.$('.ProductDetails-Price').getText();

        expect(productName).toEqual(productNameOnPage);
        expect(productPrice).toEqual(productPriceOnPage);

    });
});

describe('Корзина', function() {
    it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async ({ browser }) => {
        await browser.url(catalog_url + "/1");
        const addToCartButton = await browser.$('.ProductDetails-AddToCart');
        await addToCartButton.click();
        
        await browser.$('.navbar-nav').$(':last-child').click();
        const indexCart = await browser.$('.Cart-Index').getText();
        const priceCart = await browser.$('.Cart-Price').isDisplayed();
        const countCart = await browser.$('.Cart-Count').isDisplayed();
        const totalCart = await browser.$('.Cart-Total').isDisplayed();

        expect(indexCart).toBe('1');
        expect(priceCart).toBeTruthy();
        expect(countCart).toBeTruthy();
        expect(totalCart).toBeTruthy();

        const clearButton = await browser.$('.Cart-Clear');
        await clearButton.click();

        const empty = await browser.$('.Cart').getText();
        expect(empty).toBe(`Shopping cart\nCart is empty. Please select products in the catalog.`);
    });
})