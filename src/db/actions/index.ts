export interface ActionResponseSuccess<T> {
	success: true;
	data: T;
}

export interface ActionResponseFailure {
	success: false;
	message: string;
}

export type ActionResponse<T = unknown> =
	| ActionResponseSuccess<T>
	| ActionResponseFailure;
