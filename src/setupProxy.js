// const {createProxyMiddleware} = require("http-proxy-middleware");
 
// module.exports = function(app) {
//   app.use(
//     createProxyMiddleware("/api", {
//       // target: "http://shop-wx.yunrongt.com",//跨域地址
     
//       target:"http://shop-wx.yunrongt.com",
//       changeOrigin: true,
//       ws:true,
//       secure:false,
//       pathRewrite: {
//         "^/api": "/"
//        },
//     })
//   );
// };

const {createProxyMiddleware} = require('http-proxy-middleware');
var restream = function(proxyReq, req, res, options) {
       if (req.body) {
           let bodyData = JSON.stringify(req.body);
           // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
           proxyReq.setHeader('Content-Type','application/json');
           proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
           // stream the content
           proxyReq.write(bodyData);
       }
   }
var apiProxy = createProxyMiddleware('/api',  {
   target: 'https://shop-wx.yunrongt.com',
   secure: false,
   changeOrigin: true,
   pathRewrite:{
    "^/api": "/"
   },
   onProxyReq: restream
});
module.exports = function(app){
  app.use(apiProxy);

}