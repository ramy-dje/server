function ensureHttps(url:any) {
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    console.log(url)
    return url; // If it does not start with 'http://', return the original url
}

export default ensureHttps