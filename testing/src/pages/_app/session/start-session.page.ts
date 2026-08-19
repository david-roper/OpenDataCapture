import type { Locator, Page } from '@playwright/test';

import { AppPage } from '../route.page';

export class StartSessionPage extends AppPage {
  readonly errorMessages: Locator;
  readonly pageHeader: Locator;
  readonly selectField: Locator;
  readonly sessionForm: Locator;
  readonly subjectIdField: Locator;
  readonly subjectIdOptions: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.getByTestId('page-header');
    this.sessionForm = page.getByTestId('start-session-form');
    this.selectField = page.locator('[name="subjectIdentificationMethod"]');
    this.successMessage = page.getByRole('heading', { name: 'Session Successfully Started' });
    this.errorMessages = page.getByTestId('error-message-text');
    this.subjectIdField = this.sessionForm.locator('[name="subjectId"]');
    this.subjectIdOptions = page.getByTestId('subjectId-combobox-content').getByRole('option');
  }

  async fillCustomIdentifier(customIdentifier: string, sex: string) {
    const subjectIdField = this.sessionForm.locator('[name="subjectId"]');
    const dateOfBirthField = this.sessionForm.locator('[name="subjectDateOfBirth"]');
    const sexSelector = this.sessionForm.locator('[name="subjectSex"]');
    const sessionTypeSelector = this.sessionForm.locator('[name="sessionType"]');
    const sessionDate = this.sessionForm.locator('[name="sessionDate"]');

    await subjectIdField.waitFor({ state: 'visible' });
    await subjectIdField.fill(customIdentifier);

    await dateOfBirthField.waitFor({ state: 'visible' });
    await dateOfBirthField.fill('1990-01-01');

    await sexSelector.selectOption(sex);

    await sessionTypeSelector.selectOption('Retrospective');

    await sessionDate.waitFor({ state: 'visible' });
    const expectedSessionDate = new Date().toISOString().split('T')[0]!;
    await sessionDate.fill(expectedSessionDate);
  }

  async fillSessionForm(firstName: string, lastName: string, sex: string) {
    const firstNameField = this.sessionForm.locator('[name="subjectFirstName"]');
    const lastNameField = this.sessionForm.locator('[name="subjectLastName"]');
    const dateOfBirthField = this.sessionForm.locator('[name="subjectDateOfBirth"]');
    const sexSelector = this.sessionForm.locator('[name="subjectSex"]');
    const sessionTypeSelector = this.sessionForm.locator('[name="sessionType"]');
    const sessionDate = this.sessionForm.locator('[name="sessionDate"]');

    await firstNameField.waitFor({ state: 'visible' });
    await firstNameField.fill(firstName);

    await lastNameField.waitFor({ state: 'visible' });
    await lastNameField.fill(lastName);

    await dateOfBirthField.waitFor({ state: 'visible' });
    await dateOfBirthField.fill('1990-01-01');

    await sexSelector.selectOption(sex);

    await sessionTypeSelector.selectOption('Retrospective');

    await sessionDate.waitFor({ state: 'visible' });
    const expectedSessionDate = new Date().toISOString().split('T')[0]!;
    await sessionDate.fill(expectedSessionDate);
  }

  /** Opens the custom-identifier combobox with no filter applied, so every option is listed. */
  async openSubjectIdOptions() {
    await this.subjectIdField.waitFor({ state: 'visible' });
    await this.subjectIdField.click();
    await this.subjectIdOptions.first().waitFor({ state: 'visible' });
  }

  async selectIdentificationMethod(methodName: string) {
    await this.selectField.selectOption(methodName);
  }

  /** Picks an existing subject from the custom-identifier combobox. Typing does not set the value. */
  async selectSubjectId(subjectId: string) {
    await this.openSubjectIdOptions();
    await this.$ref.getByTestId(`subjectId-combobox-item-${subjectId}`).click();
  }

  async submitForm() {
    const submitButton = this.sessionForm.getByLabel('Submit');

    await submitButton.waitFor({ state: 'visible' });

    await submitButton.click();
  }
}
