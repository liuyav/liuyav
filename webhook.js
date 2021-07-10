const http = require('http');
const createHandler = require('github-webhook-handler');
const handler = createHandler({
    path: '/webhook',
    secret: '123456'
})

const { spawn } = require('child_process');
function run_cmd(cmd, args, cb) {
    const child = spawn(cmd, args);
    let resp = '';
    child.stdout.on('data', (buffer) => {
        resp += buffer.toString();
    })
    child.stdout.on('end', () => {
        cb(resp);
    })
}

http.createServer((req, res) => {
    handler(req, res, err => {
        res.statusCode = 404,
        res.end('no such location')
    })
}).listen(7777, () => {
    console.log('webhook listen at 7777')
})

handler.on('error', err => {
    console.err('Error:', err.message)
})

handler.on('*', event => {
    run_cmd('sh', ['./ssh-deploy.sh'], text => {
        console.log(text)
    })
})