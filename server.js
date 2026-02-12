const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const formidable = require('formidable');


const server = http.createServer((req, res) => {

   
        if (req.method === 'POST' && req.url === '/upload') {

    const uploadDir = path.join(process.cwd(), 'uploads');

    try {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
    } catch (err) {
        console.error("Directory creation failed:", err);
        res.writeHead(500);
        res.end("Server error creating upload directory");
        return;
    }

    const form = new formidable.IncomingForm({
        uploadDir: uploadDir,
        keepExtensions: true,
        multiples: false
    });

    form.parse(req, (err, fields, files) => {
    if (err) {
        console.error("Upload error:", err);
        res.writeHead(500);
        res.end("Upload failed");
        return;
    }

    
    res.writeHead(302, {
            Location: '/?success=true'
        });
        res.end();
    });


    return;
}


    
    let filePath = path.join(__dirname, 'public',
        req.url === '/' ? 'index.html' : req.url
    );

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('404 Not Found');
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
