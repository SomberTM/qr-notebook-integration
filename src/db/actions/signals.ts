"use server";

import {
	SignalsResponse,
	formatSignalsResponse,
} from "@/lib/formatSignalsResponse";
import { ActionResponse } from ".";
import mockData from "@/lib/signalsMockData.json";

export type FormattedSignalsResponse<T = unknown> = Record<string, T>[];

export async function getDataFromEid(
	eid: string
): Promise<ActionResponse<FormattedSignalsResponse>> {
	if (eid === "xyz")
		return {
			success: true,
			data: formatSignalsResponse(mockData as SignalsResponse),
		};

	try {
		const signalsBaseEndpoint = process.env.SIGNALS_ENDPOINT;
		if (!signalsBaseEndpoint)
			return {
				success: false,
				message:
					"Signals endpoint not set in configuration. Please set SIGNALS_ENDPOINT environment variable.",
			};

		const url = new URL(eid, signalsBaseEndpoint);
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Error! Status: ${response.status}`);
		}

		const result: SignalsResponse = await response.json();
		const data = formatSignalsResponse(result);
		return { success: true, data };
	} catch (error) {
		return { success: false, message: (error as any).message };
	}
}
