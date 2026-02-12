const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const formidable = require('formidable');

const server = http.createServer((req, res) => {

    // Handle File Upload
    if (req.method === 'POST' && req.url === '/upload') {
        const form = formidable({
            uploadDir: path.join(__dirname, 'uploads'),
            keepExtensions: true
        });

        if (!fs.existsSync('./uploads')) {
            fs.mkdirSync('./uploads');
        }

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(500);
                res.end('Upload Error');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h2>File Uploaded Successfully</h2>');
        });

        return;
    }

    // Static File Serving
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, {
                'Content-Type': mime.lookup(filePath) || 'application/octet-stream'
            });
            res.end(content);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
