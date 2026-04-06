import { describe, expect, test } from 'vitest';
import { translateAPIError } from './index';

describe('translateAPIError', () => {
	test('returns dedicated password policy message for FAILED_VALIDATION password regex', () => {
		const error = {
			response: {
				data: {
					errors: [
						{
							message: 'Validation failed for field "password". Value doesn\'t have the correct format.',
							extensions: {
								code: 'FAILED_VALIDATION',
								field: 'password',
								type: 'regex',
								invalid: 'test',
							},
						},
					],
				},
			},
		};

		expect(translateAPIError(error as any)).toBe("Password doesn't meet the configured password policy");
	});

	test('falls back to detailed server message for FAILED_VALIDATION when no mapped type exists', () => {
		const error = {
			errors: [
				{
					message: 'Validation failed for field "password". Value is not acceptable.',
					extensions: {
						code: 'FAILED_VALIDATION',
						field: 'password',
						type: 'custom',
					},
				},
			],
		};

		expect(translateAPIError(error as any)).toBe('Validation failed for field "password". Value is not acceptable.');
	});
});
