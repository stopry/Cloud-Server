/**
 * Created by Alvis on 2017/3/13.
 */
function checkOpenId() {

    var cacheExpire = localStorage.getItem('CACHE_EXPIRE');
    if (cacheExpire == 'null' || cacheExpire == '' || cacheExpire == null || cacheExpire == 'undefined') {
        clearCache();
    } else {
        var expire = localStorage.getItem('CACHE_EXPIRE');
        var now = (new Date()).valueOf();
        if (expire <= now) {
            clearCache();
        }
    }
    var openid = localStorage.getItem('WX_AUTH_OPENID');
    if (openid == null || openid == '' || openid == 'undefined') {
        localStorage.setItem('WX_AUTH_OPENID', 'oFkRQtxqwVFr5F9MD8lriKUX9K-8');
        //window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx38fb9ed2db12ab75&redirect_uri=http%3A%2F%2Fwap.atjuqi.com%2Fapi%2FwxLogin&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
    }
}


function clearCache() {
    localStorage.removeItem('WX_AUTH_OPENID');
    localStorage.removeItem('USER_MOBILE');
    var now = (new Date()).valueOf();
    localStorage.setItem('CACHE_EXPIRE',now+86400000);
}
checkOpenId();





