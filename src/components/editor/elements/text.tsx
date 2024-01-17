"use client";

import React, { useContext, useMemo } from "react";
import ReactHtmlParser from "react-html-parser";
import { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CanvasContext, ICanvasComponent } from "../index";
import { fontList, sizeList } from "../toolbar";
import dynamic from "next/dynamic";

const Size = Quill.import("attributors/style/size");
Size.whitelist = sizeList;

const Font = Quill.import("attributors/style/font");
Font.whitelist = fontList;

Quill.register(Font, true);
Quill.register(Size, true);

const TextElement = (props: ICanvasComponent) => {
	const { content, id, isReadOnly } = props;
	const { actions } = useContext(CanvasContext);
	const editorRef = React.useRef(null);
	const ReactQuill = useMemo(
		() => dynamic(() => import("react-quill"), { ssr: false }),
		[]
	);

	const updateEditorValue = (value: string) => {
		actions?.updateCanvasData({ id, content: value });
	};

	const modules = {
		toolbar: "#toolbar",
	};

	return (
		<>
			<div>
				{isReadOnly ? (
					<div
						className="ql-editor"
						style={{
							fontFamily: "Arial",
							fontSize: "13px",
							padding: 0,
						}}
					>
						{ReactHtmlParser(content || "")}
					</div>
				) : (
					<ReactQuill
						// @ts-expect-error
						ref={editorRef}
						readOnly={isReadOnly}
						theme="snow"
						className="quill-container"
						modules={modules}
						value={content}
						onChange={updateEditorValue}
					/>
				)}
			</div>
		</>
	);
};

export default TextElement;
