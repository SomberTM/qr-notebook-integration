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

	// Set dimensions of label to the same as image
	label.width = png.width;
	label.height = png.height;

	// Create Graphic
	const graphic = new Graphic();
	label.content.push(graphic);
	graphic.width = png.width;
	graphic.height = png.height;

	// Convert to monochrome
	let index = 0;
	const imageBits = [];
	
	for (let y = 0; y < png.height; y++) {
    	for (let x = 0; x < png.width; x++) {
        	const red = png.data[index++];
        	const green = png.data[index++];
        	const blue = png.data[index++];
        	const opacity = png.data[index++];
        
			let value = (opacity > 128) ? 1 : 0;

        	imageBits.push(value);
    	}
}


	const graphicData = new GraphicData(png.width, png.height, imageBits);
	graphic.data = graphicData;

	const zpl = label.generateZPL();

	console.log(zpl);
	return zpl;
}
