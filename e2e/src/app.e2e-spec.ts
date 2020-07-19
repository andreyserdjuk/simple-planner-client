import { AppPage } from './app.po';
import {browser, until, by, element, logging} from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display filter tasks message', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Filter tasks by status:');
  });

  it('should allow to create task', async () => {
    await page.navigateTo();
    await page.createNewTask('test task', 'high');
    await element(by.id('status-scheduled')).click();
    const el = await element(by.className('task'));

    expect(el.getText()).toContain('test task');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
