import { test, expect } from '@playwright/test';
import { mockIngredients } from './mocks/ingredients';
import { mockUser } from './mocks/user';
import { mockOrder } from './mocks/order';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token',
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.route('**/api/ingredients', async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockIngredients)
      });
    });

    await page.route('**/api/auth/user', async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser)
      });
    });

    await page.route('**/api/orders', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrder)
      });
    });

    await page.goto('/');
    await page.waitForSelector('[data-cy="ingredient-bun"]');
  });

  test('должен добавлять булку в конструктор', async ({ page }) => {
    const bunCard = page.locator('[data-cy="ingredient-bun"]').first();
    await bunCard.locator('button').click();

    await expect(page.locator('[data-cy="constructor-bun-top"]')).toBeVisible();
    await expect(
      page.locator('[data-cy="constructor-bun-bottom"]')
    ).toBeVisible();
  });

  test('должен добавлять начинку в конструктор', async ({ page }) => {
    const mainCard = page.locator('[data-cy="ingredient-main"]').first();
    await mainCard.locator('button').click();

    await expect(
      page.locator('[data-cy="constructor-ingredient"]')
    ).toHaveCount(1);
  });

  test('должен добавлять соус в конструктор', async ({ page }) => {
    const sauceCard = page.locator('[data-cy="ingredient-sauce"]').first();
    await sauceCard.locator('button').click();

    // eslint-disable-next-line prettier/prettier
    await expect(page.locator('[data-cy="constructor-ingredient"]')).toHaveCount(
      1
    );
  });

  test('должен открывать модальное окно ингредиента', async ({ page }) => {
    await page.locator('[data-cy="ingredient-bun"]').first().click();

    await expect(page.locator('[data-cy="modal"]')).toBeVisible();
    await expect(page.locator('[data-cy="modal-title"]')).toContainText(
      'Детали ингредиента'
    );
  });

  test('должен закрывать модальное окно по клику на крестик', async ({
    page
  }) => {
    await page.locator('[data-cy="ingredient-bun"]').first().click();
    await page.locator('[data-cy="modal-close"]').click();
    await expect(page.locator('[data-cy="modal"]')).not.toBeVisible();
  });

  test('должен закрывать модальное окно по клику на оверлей', async ({
    page
  }) => {
    await page.locator('[data-cy="ingredient-bun"]').first().click();
    await page.locator('[data-cy="modal-overlay"]').click({
      position: { x: 10, y: 10 }
    });
    await expect(page.locator('[data-cy="modal"]')).not.toBeVisible();
  });

  test('должен создавать заказ и показывать номер', async ({ page }) => {
    await page
      .locator('[data-cy="ingredient-bun"]')
      .first()
      .locator('button')
      .click();
    await page
      .locator('[data-cy="ingredient-main"]')
      .first()
      .locator('button')
      .click();
    await page
      .locator('[data-cy="ingredient-sauce"]')
      .first()
      .locator('button')
      .click();

    await page.locator('[data-cy="order-button"]').click();

    await expect(page.locator('[data-cy="modal"]')).toBeVisible();
    await expect(page.locator('[data-cy="order-number"]')).toContainText(
      String(mockOrder.order.number)
    );

    await page.locator('[data-cy="modal-close"]').click();
    await expect(page.locator('[data-cy="modal"]')).not.toBeVisible();

    await expect(
      page.locator('[data-cy="constructor-bun-top"]')
    ).not.toBeVisible();
    await expect(
      page.locator('[data-cy="constructor-ingredient"]')
    ).toHaveCount(0);
  });
});
