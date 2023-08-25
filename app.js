const http = require('http');
const fs = require('fs');
const { wrap } = require('module');
const port = 4000;

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        fs.readFile('message.txt',{encoding:'utf-8'}, (err,data)=>{
            if(err){
                console.log(err)
            }
            res.write('<html>');
            res.write('<head><title>Enter Message</title></head>')
            res.write(`<body>${data}</body>`)
            res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></input></form></body>')
            res.write('</html>');
            return res.end();
        })
    }

    else if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        })
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFile('message.txt', message, (err) => {
                if(err){
                    console.log(err);
                }
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        })
    }
    else{
        res.setHeader('Content-Type', 'text/html')
        res.write('<html>');
        res.write('<head><title>First Node.js Page</title></head>')
        res.write('<body><h1>Hello World!</h1></body>')
        res.write('</html>');
        res.end();
    }
})

server.listen(port);