/* =========================================================
   汽车网站 · 交互脚本
   1) 无 JS 兜底：移除 html.no-js，启用滚动揭示
   2) 移动端汉堡菜单
   3) 滚动揭示（IntersectionObserver + 3 秒强制兜底）
   4) 车型品类筛选
   ========================================================= */
(function () {
  'use strict';

  /* 页面已由 JS 增强，移除 no-js 类 */
  document.documentElement.classList.remove('no-js');

  /* ---------- 移动端汉堡菜单 ---------- */
  var btn = document.getElementById('navBtn');
  var nav = document.getElementById('navLinks');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && window.innerWidth <= 760) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 滚动揭示（含无 JS / 超时兜底） ---------- */
  var els = [].slice.call(document.querySelectorAll('.rv'));
  function revealAll() {
    els.forEach(function (el) { el.classList.add('in'); });
  }
  if (!('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
    /* 保险：3 秒后强制显示所有未揭示内容，避免任何情况下内容不可见 */
    setTimeout(function () {
      els.forEach(function (el) {
        if (!el.classList.contains('in')) el.classList.add('in');
      });
    }, 3000);
  }

  /* ---------- 车型品类筛选 ---------- */
  var bar = document.getElementById('filterBar');
  var count = document.getElementById('filterCount');
  if (bar) {
    var cards = [].slice.call(document.querySelectorAll('.car-card'));
    var btns = [].slice.call(bar.querySelectorAll('.f-btn'));
    var OTHER = ['sports', 'pickup', 'mini'];

    function apply(filter) {
      var shown = 0;
      cards.forEach(function (card) {
        var cats = (card.getAttribute('data-cat') || '').split(/\s+/);
        var show = filter === 'all' ||
          (filter === 'other' ? cats.some(function (c) { return OTHER.indexOf(c) > -1; })
                              : cats.indexOf(filter) > -1);
        card.classList.toggle('is-hidden', !show);
        if (show) shown++;
      });
      if (count) {
        count.textContent = '当前展示 ' + shown + ' / ' + cards.length + ' 款';
      }
      btns.forEach(function (b) {
        var on = b.getAttribute('data-f') === filter;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    bar.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('.f-btn') : null;
      if (b) apply(b.getAttribute('data-f'));
    });

    apply('all');
  }
})();
