const http = require("http");
const path = require("path");
const fs = require("fs");

const utf8Decoder = new TextDecoder('utf-8')
const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
	let data = '';
	req.on('data', chunk => data += utf8Decoder.decode(chunk));
	req.on('end', () => {
		// write json data
		if(data) {
			console.log(data);
			fs.writeFile('data.json', data, (err) => {if(err) throw err});
		} // end of if
	}); // end of request on end
	
	// get url
	const url = req.url.split('?')[0];
	
	// Build file path
	let filePath = path.join(
		__dirname,
		url === "/" ? "index.html" : url
	);
	
	// Extension of file
	let extname = path.extname(filePath);
	
	// Initial content type
	let contentType = "text/html";
	
	// Check ext and set content type
	switch (extname) {
		case ".js":
			contentType = "text/javascript";
			break;
		case ".css":
			contentType = "text/css";
			break;
		case ".json":
			contentType = "application/json";
			break;
		case ".pdf":
			contentType = "application/pdf";
			break;
		case ".png":
			contentType = "image/png";
			break;
		case ".jpg":
			contentType = "image/jpg";
			break;
		case ".svg":
			contentType = "image/svg+xml";
			break;
	}
	
	 // Check if contentType is text/html but no .html file extension
	if (contentType == "text/html" && extname == "") filePath += ".html";

	// Read File
	fs.readFile(filePath, (err, content) => {
		if (err) {
			if (err.code == "ENOENT") {
				// Page not found
				fs.readFile(
					path.join(__dirname, "public", "404.html"),
					(err, content) => {
						res.writeHead(404, { "Content-Type": "text/html" });
						res.end('404 error: page does not exist', "utf8");
					}
				);
			} else {
				//	Some server error
				res.writeHead(500);
				res.end(`Server Error: ${err.code}`);
			}
		} else {
			// Success
			res.writeHead(200, { "Content-Type": contentType });
			res.end(content, "utf8");
		}
	});
}); //*/
server.listen(PORT, () => console.log(`Hosting on port ${PORT}`));