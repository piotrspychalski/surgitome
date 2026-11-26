/* SURGITOME — panel autora. (c) 2026 Piotr Spychalski · MIT License
 * Szyfrowanie danych panelu hasłem: PBKDF2-HMAC-SHA-256 (hasło → klucz AES-256), potem AES-GCM.
 * Ten sam kod działa w przeglądarce (odszyfrowanie) i w Node 20+ (zaszyfrowanie przy publikacji): oba używają WebCrypto.
 * Sól i liczba iteracji są stałe, żeby klucz zapamiętany na urządzeniu („Zapamiętaj”) działał także po codziennym odświeżeniu danych;
 * każda paczka ma własny losowy wektor IV. */
(function (root) {
  'use strict';
  var SOL = 'surgitome-admin/v1', ITER = 600000;
  var te = new TextEncoder(), td = new TextDecoder();
  function subtle() { return (root.crypto || globalThis.crypto).subtle; }

  function doB64(u8) {
    var s = '', CH = 0x8000;
    for (var i = 0; i < u8.length; i += CH) s += String.fromCharCode.apply(null, u8.subarray(i, i + CH));
    return btoa(s);
  }
  function zB64(s) {
    var b = atob(s), u8 = new Uint8Array(b.length);
    for (var i = 0; i < b.length; i++) u8[i] = b.charCodeAt(i);
    return u8;
  }

  /* klucz AES z hasła (nie da się go wyeksportować z przeglądarki — extractable: false) */
  async function klucz(haslo, iter, sol) {
    var baza = await subtle().importKey('raw', te.encode(String(haslo).normalize('NFC')), 'PBKDF2', false, ['deriveKey']);
    return subtle().deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: te.encode(sol || SOL), iterations: iter || ITER },
      baza, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }

  async function zaszyfruj(obj, k) {
    var iv = (root.crypto || globalThis.crypto).getRandomValues(new Uint8Array(12));
    var ct = await subtle().encrypt({ name: 'AES-GCM', iv: iv }, k, te.encode(JSON.stringify(obj)));
    return { format: 'surgitome-admin', wersja: 1, alg: 'PBKDF2-SHA-256 + AES-256-GCM', iter: ITER, sol: SOL, iv: doB64(iv), dane: doB64(new Uint8Array(ct)) };
  }

  /* zwraca obiekt albo rzuca błąd (złe hasło = błąd uwierzytelnienia AES-GCM) */
  async function odszyfruj(paczka, k) {
    var pt = await subtle().decrypt({ name: 'AES-GCM', iv: zB64(paczka.iv) }, k, zB64(paczka.dane));
    return JSON.parse(td.decode(pt));
  }

  var API = { SOL: SOL, ITER: ITER, klucz: klucz, zaszyfruj: zaszyfruj, odszyfruj: odszyfruj };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Szyfr = API;
})(typeof window !== 'undefined' ? window : globalThis);
