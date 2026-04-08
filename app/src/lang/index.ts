import { createI18n, I18nOptions } from 'vue-i18n';
import availableLanguages from './available-languages.yaml';
import datetimeFormats from './date-formats.yaml';
import numberFormats from './number-formats.yaml';
import enUSBase from './translations/en-US.yaml';
import { RequestError } from '@/api';
import { extractFirstError } from '@/utils/extract-error-code';

export const i18n = createI18n({
	legacy: false,
	locale: 'en-US',
	fallbackLocale: 'en-US',
	messages: {
		'en-US': enUSBase,
	} as I18nOptions['messages'],
	silentTranslationWarn: true,
	datetimeFormats,
	numberFormats,
});

export type Language = keyof typeof availableLanguages;

export const loadedLanguages: Language[] = ['en-US'];

export function translateAPIError(error: RequestError | string): string {
	const defaultMsg = i18n.global.t('unexpected_error');

	if (typeof error === 'string') {
		return error;
	}

	const { code, extensions: errorExtensions, message: errorMessage } = extractFirstError(error);

	if (!code || code === 'UNKNOWN') return defaultMsg;

	// Prefer specific validation detail messages over generic FAILED_VALIDATION.
	if (code === 'FAILED_VALIDATION' && errorExtensions) {
		if (errorExtensions['field'] === 'password' && errorExtensions['type'] === 'regex') {
			const passwordPolicyKey = 'password_policy_validation_error';

			if (i18n.global.te(passwordPolicyKey)) {
				return i18n.global.t(passwordPolicyKey);
			}
		}

		if (typeof errorExtensions['type'] === 'string') {
			const validationKey = `validationError.${errorExtensions['type']}`;

			if (i18n.global.te(validationKey)) {
				return i18n.global.t(validationKey, errorExtensions);
			}
		}

		if (errorMessage) {
			return errorMessage;
		}
	}

	const key = `errors.${code}`;
	const exists = i18n.global.te(key);

	if (exists === false) return defaultMsg;

	return i18n.global.t(key);
}
