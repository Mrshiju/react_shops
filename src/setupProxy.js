const {createProxyMiddleware} = require("http-proxy-middleware");
 
module.exports = function(app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://shop-wx.yunrongt.com",//跨域地址
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/"
       },
    })
  );
};