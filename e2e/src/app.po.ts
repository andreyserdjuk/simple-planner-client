import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.tagName('h4')).getText() as Promise<string>;
  }

  async createNewTask(title: string, priority: string): Promise<void | string> {
    return element(by.className('add-task')).click().then(async () => {
      await element(by.id('title')).sendKeys(title);
      await element(by.xpath('//option[@value="high"]')).click();
      await element(by.xpath('//button[@type="submit"]')).click();
    });
  }
}
