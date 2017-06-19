// From repo: updated: 2017-06-05 15:00:00 +0000
"use strict";

var FindProxyForURL = (function () {

    /*
        Version: 0.2
        __SUCH_NAMES__ are template placeholders that MUST be replaced for the script to work.
    */

    var HTTPS_PROXIES = 'HTTPS your_proxy.here:8080;'; //'HTTPS proxy.antizapret.prostovpn.org:3143; HTTPS gw2.anticenz.org:443';
    var PROXY_PROXIES = ';'; //'PROXY proxy.antizapret.prostovpn.org:3128; PROXY gw2.anticenz.org:8080;';
    var PROXY_STRING  = HTTPS_PROXIES + PROXY_PROXIES + 'DIRECT';

    
  

    
    function areSubsCensored(host) {

      var x = host.lastIndexOf('.');
      do {
        x = host.lastIndexOf('.', x - 1);

        if(host.substring(x + 1) in hosts) {
          return true;
        }
      } while(x > -1);
      return false;

    }

    return function FindProxyForURL(url, host) {

      if (/*@cc_on!@*/!1) {
        throw new TypeError('https://rebrand.ly/ac-anticensority');
      }

      // Remove last dot.
      if (host[host.length - 1] === '.') {
        host = host.substring(0, host.length - 1);
      }
      

      return (function isCensored(){

        // In the worst case both IP and host checks must be done (two misses).
        // IP hits are more probeble, so we check them first.
        const ip = dnsResolve(host);
        if (ip && (false || (ip in ips))) {
          return true;
        };

        return areSubsCensored(host);

      })() ? PROXY_STRING : 'DIRECT';

    }

  })()