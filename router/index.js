"use strict";

module.exports = server => {
    /*
    this.path + '/product/:pid' GET 查询产品信息
    this.path + '/product/:pid/price/:flightNO/:flightDate' GET 获取航班相关的价格信息
    */
    require('./query')(server);

    /*
    '/product'  POST    增加产品信息
    */
    require('./admin')(server);

    /*
    '/product/flightDelay/join/:NO/:Date' GET 加入互助
    */
    require('./business')(server);
}