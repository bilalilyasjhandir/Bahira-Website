/**
 * Urdu and Saraiki pages only. Until their fonts have arrived (3 seconds at most), the page
 * body (main and footer) waits, hidden, and then appears in its final layout.
 *
 * Why: the browser lays text out in a stand-in font while Nastaliq downloads. Nastaliq is
 * wider, so when it arrives the lines wrap again and everything below them jumps (a layout
 * shift). Its text is invisible until then anyway (font-display: block), so hiding the
 * body costs nothing. The header shows at once: no size in it depends on the font.
 *
 * It must be the first thing in <body>. A script there runs only after the stylesheets in
 * <head> have loaded, so the browser already knows the fonts it is asked to wait for.
 * Without JavaScript, or if anything fails, the page simply shows as usual. The class it
 * sets on <html> is why the layout's <html> has suppressHydrationWarning.
 */
const WAIT_MS = 3000; // the length of font-display: block

export function FontWait({ families }: { families: string[] }) {
  const script =
    "(function(){var r=document.documentElement,f=document.fonts,shown=false;" +
    'if(!f||!f.load||typeof Promise==="undefined")return;' +
    'function show(){if(!shown){shown=true;r.classList.remove("font-wait")}}' +
    `try{setTimeout(show,${WAIT_MS});` +
    `Promise.all(${JSON.stringify(families)}.map(function(n){return f.load("1em "+n)})).then(show,show);` +
    'r.classList.add("font-wait")}catch(e){show()}})();';
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
