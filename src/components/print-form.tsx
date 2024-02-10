"use client";

import { Label, Printer } from "@/db/schema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FormattedSignalsResponse } from "@/db/actions/signals";
import { populateLabels } from "@/lib/populateLabel";
import { useState } from "react";
import { CanvasElement } from "./editor/utils";
import LabelEditor from "./editor";
import { Button } from "./ui/button";

interface PrintFormProps {
	labels: (Label & { printer: Printer })[];
	data: FormattedSignalsResponse;
}

interface PrintForm {}

export function PrintForm({ labels, data }: PrintFormProps) {
	const [editors, setEditors] = useState<CanvasElement[][]>([]);
	const [label, setLabel] = useState<
		(Label & { printer: Printer }) | undefined
	>(undefined);

	return (
		<div className="flex flex-col items-center gap-2">
			<div className="flex gap-2">
				<Select
					onValueChange={(id) => {
						const label = labels.find((label) => label.id === id);
						if (!label) return;
						setLabel(label);
						setEditors(populateLabels(label, data));
					}}
				>
					<SelectTrigger className="w-96">
						<SelectValue placeholder="Select a label template" />
					</SelectTrigger>
					<SelectContent>
						{labels.map((label) => (
							<SelectItem key={label.id} value={label.id}>
								{label.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{label && (
					<Button>
						Print to <strong className="ml-4">{label.printer.name}</strong>
					</Button>
				)}
			</div>
			<div className="flex justify-center flex-wrap gap-x-4 gap-y-8">
				{label &&
					editors.length > 0 &&
					editors.map((editor, idx) => (
						<LabelEditor
							key={idx}
							data={editor}
							onDataChange={(data) => {
								setEditors((previousEditors) => {
									previousEditors.splice(idx, 1, data);
									return [...previousEditors];
								});
							}}
						>
							<LabelEditor.Toolbar />
							<LabelEditor.Canvas
								width={label.widthIn * label.printer.dpi}
								length={label.lengthIn * label.printer.dpi}
							/>
						</LabelEditor>
					))}
			</div>
		</div>
	);
}
