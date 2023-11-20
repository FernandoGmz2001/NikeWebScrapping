const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto('https://www.nike.com/mx/w/hombres-calzado-nik1zy7ok');

        // Scroll several times to load all products
        for (let i = 0; i < 4; i++) {
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(2000); // wait for 2 seconds for the new products to load
        }

        const productImages = await page.$$('.product-card__hero-image.css-1fxh5tw');
        const productNameDivs = await page.$$('.product-card__title');
        const productPrice = await page.$$('[data-testid="product-price-reduced"], [data-testid="product-price"]');

        const products = [];

        for (let i = 0; i < productImages.length; i++) {
            const src = await productImages[i].getAttribute('src');
            const content = await productNameDivs[i].innerText();
            let price = '';
            if (productPrice[i]) {
                price = await productPrice[i].innerText();
            }

            const product = { 
                productDescription: 'Descripcion del tenis', 
                productGender: 'Hombre', 
                productImage: src, 
                productName: content, 
                productPrice: parseInt(price.replace(/[^0-9.-]+/g,"")) 
            };
            products.push(product);
        }

        // Write products to a JSON file
        fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

        await browser.close();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

run();