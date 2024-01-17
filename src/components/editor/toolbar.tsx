"use client";

import React, { useContext } from "react";
import { CanvasContext } from "./index";
import { Button } from "../ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export const sizeList = [
	"8px",
	"9px",
	"10px",
	"11px",
	"12px",
	"14px",
	"16px",
	"18px",
	"20px",
	"72px",
];

export const fontList = [
	"Arial",
	"Arial Black",
	"Arial Unicode MS",
	"Calibri",
	"Cambria",
	"Cambria Math",
	"Candara",
	`Segoe UI, wf_segoe-ui_normal, helvetica, arial, sans-serif`,
	"Comic Sans MS",
	"Consolas",
	"Constantia",
	"Corbel",
	"Courier New",
	"Georgia",
	"Lucida Sans Unicode",
	"Tahoma",
	"Times New Roman",
	"Trebuchet MS",
	"Verdana",
];

interface IToolbarProps {
	isEditEnable: boolean;
}

export default function Toolbar({ isEditEnable }: IToolbarProps) {
	const { actions } = useContext(CanvasContext);
	const addElement = (type: string) => {
		actions?.addElement(type);
	};
	return (
		<div className="flex bg-transparent py-4 gap-2">
			<Button onClick={() => addElement("TEXT")}>T</Button>
			{isEditEnable && (
				<div className="bg-white" id="toolbar">
					<select className="ql-font">
						{fontList.map((font, idx) => (
							<option key={`${font}-${idx}`} value={font}>
								{font}
							</option>
						))}
					</select>
					<select className="ql-size">
						{sizeList.map((size, idx) => (
							<option key={`${size}-${idx}`} value={size}>
								{size}
							</option>
						))}
					</select>
					<button className="ql-bold" />
					<button className="ql-italic" />
					<button className="ql-underline" />
					<select className="ql-align" />
				</div>
			)}
		</div>
	);
}
