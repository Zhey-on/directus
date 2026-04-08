import type { DirectusError } from '@directus/sdk';
import type { RequestError } from '@/api';
import type { APIError } from '@/types/error';

export type FirstError = {
	code: string;
	extensions?: Record<string, unknown>;
	message?: string;
};

export function extractErrorCode(error: unknown): string {
	return (
		(error as RequestError).response?.data?.errors?.[0]?.extensions?.code ||
		(error as DirectusError)?.errors?.[0]?.extensions?.code ||
		(error as APIError)?.extensions?.code ||
		'UNKNOWN'
	);
}

export function extractFirstError(error: unknown): FirstError {
	const firstError =
		(error as RequestError).response?.data?.errors?.[0] ||
		(error as DirectusError)?.errors?.[0] ||
		(error as APIError);

	return {
		code: firstError?.extensions?.code ?? 'UNKNOWN',
		extensions: firstError?.extensions,
		message: firstError?.message,
	};
}
