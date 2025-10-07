(function () {
  function replace(el, html){ el.outerHTML = html; }
  function errorBox(src, msg){
    replace(el, '<div style="border:1px solid #c00;padding:.75rem;background:#fee;color:#900;font:14px/1.5 monospace">'
                    + 'Include failed: <b>'+src+'</b><br>'+msg+'</div>');
  }
  function urlFor(src){
    try { return new URL(src, document.baseURI).href; }
    catch { return src; }
  }
  function load(el){
    var src = el.getAttribute('data-include');
    if(!src) return;
    fetch(urlFor(src), { credentials: 'same-origin' })
      .then(function(r){
        if(!r.ok) throw new Error(r.status + ' ' + r.statusText);
        return r.text();
      })
      .then(function(html){ replace(el, html); })
      .catch(function(err){
        console.error('Include error →', src, err);
        replace(el, '<!-- include failed: '+src+' -->');
        el.outerHTML = '<div style="border:1px solid #c00;padding:.75rem;background:#fee;color:#900;font:14px/1.5 monospace">'
                     + 'Include failed: <b>'+src+'</b><br>'+err.message+'</div>';
      });
  }
  function run(){ document.querySelectorAll('[data-include]').forEach(load); }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', run); }
  else { run(); }
})();

