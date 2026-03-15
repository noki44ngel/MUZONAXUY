// ==UserScript==
// @name         муЗОН
// @namespace    https://lolz.live/
// @version      1.0.7
// @description  MUZON
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @match        https://zelenka.guru/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const AUDIO_EXTS = /\.(mp3|ogg|wav|flac|aac|m4a|opus|webm)(\?[^"'\s]*)?$/i;
  const seen = new Set();

  GM_addStyle(`
    .lolz-ap { display:block; width:100%; max-width:480px; margin:4px 0; box-sizing:border-box; }
    .lolz-ap audio { display:block; width:100%; height:32px; }
  `);

  function replaceLinks(root) {
    const links = root.querySelectorAll('a[href]');
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const href = link.href;
      if (link.dataset.lolzAp || !AUDIO_EXTS.test(href)) continue;
      link.dataset.lolzAp = '1';

      const wrap = document.createElement('span');
      wrap.className = 'lolz-ap';

      const audio = document.createElement('audio');
      audio.controls = true;
      audio.preload = seen.has(href) ? 'auto' : 'metadata';
      seen.add(href);
      audio.src = href;

      wrap.appendChild(audio);
      link.parentNode.insertBefore(wrap, link.nextSibling);
      link.remove();
    }
  }

  const observer = new MutationObserver(mutations => {
    let hasNew = false;
    for (let i = 0; i < mutations.length; i++) {
      const added = mutations[i].addedNodes;
      for (let j = 0; j < added.length; j++) {
        if (added[j].nodeType === 1) {
          replaceLinks(added[j]);
          hasNew = true;
        }
      }
    }
    if (hasNew) setTimeout(() => replaceLinks(document.body), 400);
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener('DOMContentLoaded', () => replaceLinks(document.body), { once: true });

})();
