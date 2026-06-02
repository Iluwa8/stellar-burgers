import { test, expect } from '@playwright/test';
import { mockIngredients } from './mocks/ingredients';
import { mockOrder } from './mocks/order';
import { mockUser } from './mocks/user';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock_access_token',
        domain: 'localhost',
        path: '/'
      },
      {
        name: 'refreshToken',
        value: 'mock_refresh_token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.route('**/api/ingredients', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockIngredients)
      });
    });

    await page.route('**/api/auth/user', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser)
      });
    });

    await page.route('**/api/orders', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrder)
      });
    });

    await page.goto('/');

    await page.evaluate(() => {
      localStorage.setItem('accessToken', 'mock_access_token');
      localStorage.setItem('refreshToken', 'mock_refresh_token');
    });

    await page.waitForSelector('[data-cy="ingredient-bun"]');
  });

  test.afterEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });

  test('должен добавлять булку в конструктор', async ({ page }) => {
    await expect(page.locator('[data-cy="constructor-bun-top"]')).toHaveCount(
      0
    );

    await page.locator('[data-cy="ingredient-bun"] button').first().click();

    await expect(page.locator('[data-cy="constructor-bun-top"]')).toBeVisible();
  });

  test('должен добавлять начинку в конструктор', async ({ page }) => {
    await expect(
      page.locator('[data-cy="constructor-ingredient"]')
    ).toHaveCount(0);

    await page.locator('[data-cy="ingredient-main"] button').first().click();

    await expect(
      page.locator('[data-cy="constructor-ingredient"]')
    ).toBeVisible();
  });

  test('должен добавлять соус в конструктор', async ({ page }) => {
    await expect(
      page.locator('[data-cy="constructor-ingredient"]')
    ).toHaveCount(0);

    await page.locator('[data-cy="ingredient-sauce"] button').first().click();

    await expect(
      page.locator('[data-cy="constructor-ingredient"]')
    ).toBeVisible();
  });

  test('должен открывать модальное окно ингредиента', async ({ page }) => {
    const bunName = 'Краторная булка N-200i';

    await page.locator('[data-cy="ingredient-bun"]').first().click();

    await expect(page.locator('[data-cy="modal"]')).toBeVisible();
    await expect(page.locator('[data-cy="modal"]')).toContainText(bunName);
    await expect(page.locator('[data-cy="modal"]')).toContainText(
      'Детали ингредиента'
    );
  });

  test('должен закрывать модальное окно по клику на крестик', async ({
    page
  }) => {
    await page.locator('[data-cy="ingredient-bun"]').first().click();

    await expect(page.locator('[data-cy="modal"]')).toBeVisible();

    await page.locator('[data-cy="modal-close"]').click();

    await expect(page.locator('[data-cy="modal"]')).not.toBeVisible();
  });

  test('должен закрывать модальное окно по клику на оверлей', async ({
    page
  }) => {
    await page.locator('[data-cy="ingredient-bun"]').first().click();

    await expect(page.locator('[data-cy="modal"]')).toBeVisible();

    await page
      .locator('[data-cy="modal-overlay"]')
      .evaluate((el) => (el as HTMLElement).click());

    await expect(page.locator('[data-cy="modal"]')).not.toBeVisible();
  });

  test('должен создавать заказ и показывать номер', async ({ page }) => {
    // Булка
    await expect(page.locator('[data-cy="constructor-bun-top"]')).toHaveCount(
      0
    );
    await page.locator('[data-cy="ingredient-bun"] button').first().click();
    await expect(page.locator('[data-cy="constructor-bun-top"]')).toBeVisible();

    // Начинка
    await expect(
      page.locator('[data-cy="constructor-ingredient"]')
    ).toHaveCount(0);
    await page.locator('[data-cy="ingredient-main"] button').first().click();
    await expect(
      page.locator('[data-cy="constructor-ingredient"]')
    ).toBeVisible();

    // Соус
    const ingredientCount = await page
      .locator('[data-cy="constructor-ingredient"]')
      .count();
    await page.locator('[data-cy="ingredient-sauce"] button').first().click();
    await expect(
      page.locator('[data-cy="constructor-ingredient"]')
    ).toHaveCount(ingredientCount + 1);

    // Оформляем заказ
    await page.locator('[data-cy="order-button"]').click();

    // Модалка открылась, номер внутри модалки
    await expect(page.locator('[data-cy="modal"]')).toBeVisible();
    await expect(
      page.locator('[data-cy="modal"] [data-cy="order-number"]')
    ).toContainText('12345');

    // Закрываем модалку
    await page.locator('[data-cy="modal-close"]').click();
    await expect(page.locator('[data-cy="modal"]')).not.toBeVisible();

    // Конструктор очищен
    await expect(page.locator('[data-cy="constructor-bun-top"]')).toHaveCount(
      0
    );
    await expect(
      page.locator('[data-cy="constructor-ingredient"]')
    ).toHaveCount(0);
  });
});
