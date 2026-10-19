const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const types={'.ico':'image/x-icon','.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.png':'image/png','.xml':'application/xml','.txt':'text/plain'};
module.exports=async function serve({source=false,original=false}={}){
 const root=process.cwd();
 const shell=fs.readFileSync('_seo/shell.html','utf8').replace('/app-v2.js?v=20261016-email','/app-v2.js?v=20261016-seo').replace('</head>',original?'</head>':'<script src="/seo.js?v=20261016-seo"></script></head>');
 const server=http.createServer((req,res)=>{
  let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(p.includes('..')){res.writeHead(400);return res.end()}
  if(original&&p==='/app-v2.js'){res.setHeader('Content-Type',types['.js']);return res.end(fs.readFileSync('_seo/original-app.js'))}
  if(source&&!path.extname(p)){res.setHeader('Content-Type',types['.html']);return res.end(shell)}
  let file=path.join(root,p);
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory()){
   if(!p.endsWith('/')){res.writeHead(301,{Location:p+'/'});return res.end()}
   file=path.join(file,'index.html');
  }
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;file=path.join(root,'404.html')}
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 return {server,url:'http://127.0.0.1:'+server.address().port};
};
