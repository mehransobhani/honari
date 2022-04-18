(function(d,t) {
    var BASE_URL="http://185.213.10.90:3000";
    var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src=BASE_URL+"/packs/js/sdk.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g,s);
    g.onload=function(){
      window.chatwootSDK.run({
        websiteToken: '5pRR26SehjSNWbKoezHiQbVD',
        baseUrl: BASE_URL
      })
    }
  })(document,"script");