export interface FormActionResponseSuccess<T> {
	success: true;
	data: T;
}

export interface FormActionResponseFailure {
	success: false;
	message: string;
}

export type FormActionResponse<T = unknown> =
	| FormActionResponseSuccess<T>
	| FormActionResponseFailure;
