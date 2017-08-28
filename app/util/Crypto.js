import CryptoJS from 'crypto-js';

// 密钥 24 位
const secretKey = CryptoJS.enc.Utf8.parse('wds^7#9%=jwdf%76==9i87tf');
// 初始向量 initial vector 8 位
const iv = CryptoJS.enc.Utf8.parse('01234567');

class Crypto {
  // Triple DES 加密
  static encrypt(plainText) {
    let encrypted = CryptoJS.TripleDES.encrypt(plainText, secretKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    // 转换为字符串
    encrypted = encrypted.toString();
    console.log(encrypted);
    return encrypted;
  }

  // Triple DES 解密
  static decrypt(encryptText) {
    let decrypted = CryptoJS.TripleDES.decrypt(encryptText, secretKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    decrypted = decrypted.toString(CryptoJS.enc.Utf8);
    console.log(decrypted);
    return decrypted;
  }
}

export default Crypto;
