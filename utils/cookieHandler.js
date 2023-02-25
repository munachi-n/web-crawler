class CookieHandler {
  constructor() {
    this.jars = new Map();
  }

  parseCookies(setCookieHeaders, domain) {
    if (!setCookieHeaders) return;
    const headers = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];

    headers.forEach((header) => {
      const parts = header.split(';').map((p) => p.trim());
      const [nameValue] = parts;
      const [name, ...rest] = nameValue.split('=');
      const value = rest.join('=');

      const cookie = { name: name.trim(), value, domain };

      parts.slice(1).forEach((attr) => {
        const [key, val] = attr.split('=');
        const k = key.trim().toLowerCase();
        if (k === 'path') cookie.path = val;
        else if (k === 'expires') cookie.expires = new Date(val);
        else if (k === 'max-age') cookie.maxAge = parseInt(val);
        else if (k === 'httponly') cookie.httpOnly = true;
        else if (k === 'secure') cookie.secure = true;
      });

      if (!this.jars.has(domain)) this.jars.set(domain, new Map());
      this.jars.get(domain).set(cookie.name, cookie);
    });
  }

  getCookieString(domain) {
    const jar = this.jars.get(domain);
    if (!jar) return '';

    const now = new Date();
    const valid = [];
    for (const [name, cookie] of jar) {
      if (cookie.expires && cookie.expires < now) {
        jar.delete(name);
        continue;
      }
      valid.push(`${cookie.name}=${cookie.value}`);
    }

    return valid.join('; ');
  }

  getCookies(domain) {
    const jar = this.jars.get(domain);
    return jar ? Array.from(jar.values()) : [];
  }

  clearDomain(domain) {
    this.jars.delete(domain);
  }

  clearAll() {
    this.jars.clear();
  }
}

module.exports = CookieHandler;
