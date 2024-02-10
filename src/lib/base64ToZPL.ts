import { PNG } from "pngjs";
import {
	Label,
	PrintDensity,
	PrintDensityName,
	Graphic,
	GraphicData,
	// @ts-expect-error no types for jszpl available anywhere
} from "jszpl";

export function base64ToZPL(base64String: string) {
	// Label Creation
	const label = new Label();
	label.printDensity = new PrintDensity(PrintDensityName["8dpmm"]);

	// Create PNG
	const base64Data = base64String.replace(/^data:image\/png;base64,/, "");
	const imageBuffer = Buffer.from(base64Data, "base64");
	const png = PNG.sync.read(imageBuffer);
	const { width, height, data } = png;

	// Set dimensions of label to the same as image
	label.width = width;
	label.height = height;

	// Convert to monochrome
	let imageBits = [];
	for (let i = 0; i < data.length; i += 4) {
		const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;
		const blackOrWhite = grayscale < 128 ? 1 : 0;
		imageBits.push(blackOrWhite);
	}

	const graphicData = new GraphicData(width, height, imageBits);
	const graphic = new Graphic();
	label.content.push(graphic);
	graphic.width = width;
	graphic.height = height;
	graphic.data = graphicData;

	const zpl = label.generateZPL();

	console.log(zpl);

	return zpl;
}
