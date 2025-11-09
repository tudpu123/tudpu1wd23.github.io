// 支付相关配置
const PAYMENT_CONFIG = {
    API_URL: 'https://2a.mazhifupay.com/',
    PID: '131517535',
    KEY: 'dRJK919JJ8VD691Zw68n0DrDec9CJ6dn',
    PRICE: 39.99 // 统一价格
};

// MD5算法实现
function md5(str) {
    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else return (lResult ^ lX8 ^ lY8);
    }

    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }

    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function ConvertToWordArray(str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }

    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }

        return utftext;
    }

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    str = Utf8Encode(str);
    x = ConvertToWordArray(str);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }
    
    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    return temp.toLowerCase();
}

// 生成唯一订单号
function generateOrderNo() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORDER${timestamp}${random}`;
}

// 计算签名
function calculateSign(params) {
    // 复制参数并移除sign字段
    const sortedParams = {};
    Object.keys(params)
        .sort()
        .forEach(key => {
            if (key !== 'sign' && params[key]) {
                sortedParams[key] = params[key];
            }
        });
    
    // 构建签名字符串
    let signStr = '';
    Object.keys(sortedParams).forEach(key => {
        signStr += `${key}=${sortedParams[key]}&`;
    });
    signStr += `key=${PAYMENT_CONFIG.KEY}`;
    
    // 确保MD5函数可用
    if (typeof md5 !== 'function') {
        console.error('MD5函数未定义');
        // 使用备用的简单加密（仅用于演示，实际应使用标准MD5）
        return simpleHash(signStr).toUpperCase();
    }
    
    return md5(signStr).toUpperCase();
}

// 简单的哈希函数（备用，实际应使用标准MD5）
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
}

// MD5加密函数
function md5(str) {
    // 简化版MD5实现，实际项目中建议使用专业的加密库
    const crypto = {
        md5: function(s) {
            function L(k, d) {
                return (k << d) | (k >>> (32 - d));
            }
            function K(G, k) {
                var d = (G & 2147483648);
                var e = (k & 2147483648);
                var f = (G & 1073741824);
                var h = (k & 1073741824);
                var i = (G & 536870912) ^ d;
                var j = (k & 536870912) ^ e;
                var l = (G & 268435456) ^ f;
                var m = (k & 268435456) ^ h;
                return (((i | j) & (l | m)) | ((i & j) & (l & m))) ^ G ^ k;
            }
            function H(G, k) {
                var d = (G & 2147483648) ^ (k & 1073741824);
                var e = (G & 1073741824) ^ (k & 268435456);
                var f = (G & 536870912) ^ (k & 268435456);
                var h = (G & 268435456) ^ (k & 2147483648);
                return ((d | e) & (f | h)) | ((d & e) & (f & h)) ^ G ^ k;
            }
            function I(G, k) {
                return G ^ k;
            }
            function J(G, k) {
                var d = (G & 2147483648) ^ (k & 2147483648);
                var e = (G & 1073741824) ^ (k & 1073741824);
                var f = (G & 536870912) ^ (k & 536870912);
                var h = (G & 268435456) ^ (k & 268435456);
                return ((d | e) & (f | h)) | ((d & e) & (f & h)) ^ G;
            }
            function F(G) {
                var k = Array(80);
                var d;
                var e;
                var f = 1732584193;
                var h = 4023233417;
                var i = 2562383102;
                var j = 271733878;
                var l = 3285377520;
                for (d = 0; d < G.length; d += 16) {
                    var m = f;
                    var n = h;
                    var o = i;
                    var p = j;
                    var q = l;
                    for (e = 0; e < 80; e++) {
                        if (e < 16) {
                            k[e] = G[d + e];
                        } else {
                            k[e] = L(k[e - 3] ^ k[e - 8] ^ k[e - 14] ^ k[e - 16], 1);
                        }
                        var r = L(f, 25) + J(k[e], L(h & (i | j), 4) + K(h, i | j) + l + 1518500249);
                        l = j;
                        j = i;
                        i = L(h, 9);
                        h = f;
                        f = r;
                        r = L(m, 30) + J(k[e], L(n & (o | p), 4) + I(n, o | p) + q + 1859775393);
                        q = p;
                        p = o;
                        o = L(n, 9);
                        n = m;
                        m = r;
                    }
                    f += m;
                    h += n;
                    i += o;
                    j += p;
                    l += q;
                }
                return [f, h, i, j, l];
            }
            function E(k) {
                var d = Array();
                var e = (1 << 16) - 1;
                for (var f = 0; f < k.length * 8; f += 16) {
                    d[f >> 5] |= (k.charCodeAt(f / 8) & 255) << (16 - f % 16);
                }
                d[d.length] = k.length * 8;
                d[d.length] = 0;
                return d;
            }
            function D(G) {
                var k = '';
                var d = '';
                for (var e = 0; e < 32 * G.length; e += 8) {
                    d += String.fromCharCode((G[e >> 5] >>> (16 - e % 16)) & 255);
                }
                for (e = 0; e < d.length; e++) {
                    k += '%' + ('0' + d.charCodeAt(e).toString(16)).slice(-2);
                }
                return k;
            }
            function C(k) {
                var d = E(k);
                var e = F(d);
                return D(e);
            }
            function B(k) {
                return unescape(C(k));
            }
            function A(k) {
                var d = Array();
                var e = 0;
                var f = 0;
                for (var h = 0; h < k.length * 2; h++) {
                    f++;
                    d[e] = ("0" + parseInt(k.charAt(h), 16).toString(2)).slice(-4);
                    if (f == 4) {
                        e++;
                        f = 0;
                    }
                }
                return d.join("");
            }
            function z(k) {
                var d = '';
                var e = Array();
                var f = 0;
                for (var h = 0; h < k.length; h++) {
                    e[f] = k.charAt(h);
                    f++;
                    if (f == 2) {
                        d += String.fromCharCode(parseInt(e.join(""), 16));
                        f = 0;
                        e = Array();
                    }
                }
                return d;
            }
            if (s === null) {
                return "null";
            }
            var t = C(s);
            var u = t.substring(0, t.length - 1);
            return u;
        }
    };
    return crypto.md5(str);
}

// 当前选中的城市
let selectedCity = '';

// 选择城市函数
function selectCity(city) {
    selectedCity = city;
    // 更新选中状态的UI
    const cityTags = document.querySelectorAll('.city-tag');
    cityTags.forEach(tag => {
        if (tag.textContent === city) {
            tag.classList.add('selected');
        } else {
            tag.classList.remove('selected');
        }
    });
    // 更新显示的选择城市
    const selectedLocationElement = document.getElementById('selectedLocation');
    if (selectedLocationElement) {
        selectedLocationElement.textContent = city;
    }
}

// 自定义城市选择
function customCitySelect() {
    const input = document.getElementById('customCityInput');
    if (input && input.value.trim()) {
        selectCity(input.value.trim());
        input.value = '';
    } else {
        alert('请输入有效的城市名称');
    }
}

// 验证城市选择
function validateLocationSelection() {
    return selectedCity !== '';
}

// 获取选中的位置信息
function getSelectedLocation() {
    return {
        city: selectedCity,
        fullLocation: selectedCity
    };
}

// 处理支付
function processPayment() {
    // 验证城市选择
    if (!selectedCity) {
        alert('请选择您的城市');
        return;
    }
    
    // 获取服务类型
    const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
    const serviceName = serviceType === 'group' ? '城市群聊' : '红娘牵线';
    
    // 生成订单信息
    const orderNo = generateOrderNo();
    const description = `${serviceName} - ${selectedCity}`;
    
    // 构造支付参数
    const params = {
        pid: PAYMENT_CONFIG.PID,
        out_trade_no: orderNo,
        name: description,
        money: PAYMENT_CONFIG.PRICE,
        notify_url: window.location.href,
        return_url: window.location.href,
        clientip: getClientIp(),
        time: Math.floor(new Date().getTime() / 1000)
    };
    
    // 提交表单进行支付
    createAndSubmitForm(params);
}

// 获取客户端IP（简化版）
function getClientIp() {
    // 实际项目中可能需要通过其他方式获取真实IP
    return '127.0.0.1';
}

// 创建并提交表单
function createAndSubmitForm(params) {
    // 生成签名
    params.sign = calculateSign(params);
    
    console.log('支付参数:', params);
    
    // 创建表单
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = PAYMENT_CONFIG.API_URL;
    form.style.display = 'none';
    
    // 添加表单字段
    Object.keys(params).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
    });
    
    // 添加到页面
    document.body.appendChild(form);
    
    // 添加加载提示
    showLoading();
    
    // 延迟提交，确保用户看到加载提示
    setTimeout(() => {
        form.submit();
    }, 500);
}

// 更新支付金额显示
function updatePaymentAmount() {
    const amountElement = document.getElementById('paymentAmount');
    if (amountElement) {
        amountElement.textContent = `¥${PAYMENT_CONFIG.PRICE}`;
    }
}

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 更新支付金额显示
    updatePaymentAmount();
    
    // 为支付按钮添加事件监听
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.addEventListener('click', processPayment);
    }
});

// 显示加载提示
function showLoading() {
    // 创建加载遮罩
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    
    // 创建加载内容
    const loadingContent = document.createElement('div');
    loadingContent.style.cssText = `
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    loadingContent.innerHTML = `
        <div style="margin-bottom: 15px;">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#4facfe" stroke-width="3" stroke-dasharray="28.27 28.27" stroke-linecap="round">
                    <animate attributeName="stroke-dashoffset" calcMode="linear" values="0; 56.54" dur="1s" repeatCount="indefinite" />
                </circle>
            </svg>
        </div>
        <p style="font-size: 16px; margin: 0; color: #333;">正在跳转到支付页面...</p>
    `;
    
    // 添加到页面
    loadingOverlay.appendChild(loadingContent);
    document.body.appendChild(loadingOverlay);
}

// 检查URL参数，处理支付回调
function checkPaymentCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const orderNo = urlParams.get('out_trade_no');
    
    if (status === 'success') {
        // 显示支付成功提示
        alert('支付成功！请添加客服微信获取服务详情');
        // 可以在这里添加其他逻辑，如记录订单等
    } else if (status === 'error') {
        // 显示支付失败提示
        alert('支付失败，请稍后重试');
    }
}

// 页面加载时检查是否有支付回调
window.onload = function() {
    // 确保cities.js中的初始化函数已经执行
    setTimeout(() => {
        // 检查支付回调
        checkPaymentCallback();
    }, 100);
};