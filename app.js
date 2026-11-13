(function () {
  'use strict';
  var D = window.CAM_NANG;
  var app = document.getElementById('app');
  var COLORS = { 'khong-tin': 'var(--tin)', 'khong-tien': 'var(--tien)', 'khong-voi': 'var(--voi)', 'khong-can': 'var(--can)' };
  var ICONS = {
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 15h2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>'
  };
  var STEP_SHORT = ['Lắng nghe', 'Đồng cảm', 'Làm rõ / cô lập vấn đề', 'Trả lời / giải thích', 'Xác nhận & chủ động chốt'];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(name, size) {
    return '<svg viewBox="0 0 24 24" width="' + (size || 24) + '" height="' + (size || 24) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + '</svg>';
  }
  var CHEV = '<svg class="chev" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>';
  var BACK = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>';
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function groupIndex(id) { for (var i = 0; i < D.groups.length; i++) if (D.groups[i].id === id) return i; return -1; }

  function objItem(g, i, showGroup) {
    var it = g.items[i];
    return '<li><a class="oitem" style="--c:' + COLORS[g.id] + '" href="#/nhom/' + g.id + '/' + (i + 1) + '">' +
      '<span class="num">' + pad(i + 1) + '</span><span class="txt">' +
      (showGroup ? '<span class="tag">Nhóm ' + (groupIndex(g.id) + 1) + ' · ' + esc(g.name) + '</span>' : '') +
      esc(it.title) + '</span>' + CHEV + '</a></li>';
  }

  /* ---------- B2: HOME — 4 nhóm trì hoãn ---------- */
  function home() {
    var cards = D.groups.map(function (g, i) {
      return '<a class="gcard" style="--c:' + COLORS[g.id] + '" href="#/nhom/' + g.id + '">' +
        '<span class="gicon">' + icon(g.icon) + '</span>' +
        '<span class="gno">NHÓM ' + (i + 1) + '</span>' +
        '<h3>' + esc(g.name) + '</h3>' +
        '<p>' + esc(g.desc) + '</p>' +
        '<span class="gcount">' + g.items.length + ' lời hóa giải →</span></a>';
    }).join('');
    var steps = STEP_SHORT.map(function (s, i) { return '<div><b>' + (i + 1) + '</b>' + s + '</div>'; }).join('');
    var intro = D.intro.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    var outro = D.outro.paras.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');

    app.innerHTML =
      '<section class="hero"><div class="wrap">' +
        '<div><span class="eyebrow">Cẩm nang Tư vấn viên</span>' +
        '<h1>Hóa giải <span>sự trì hoãn</span> của khách hàng</h1>' +
        '<p>Chọn nhóm trì hoãn bạn đang gặp để xem toàn bộ cách hóa giải và lời hóa giải mẫu theo 5 bước.</p></div>' +
        '<img src="assets/cover.webp" alt="Cẩm nang hóa giải sự trì hoãn từ khách hàng" width="200" height="300">' +
      '</div></section>' +
      '<div class="wrap fade">' +
        '<h2 class="section-title">Chọn nhóm trì hoãn</h2>' +
        '<div class="groups">' + cards + '</div>' +
        '<div class="search"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>' +
        '<input id="q" type="search" placeholder="Tìm nhanh lời trì hoãn… (vd: phá sản, tiết kiệm)" aria-label="Tìm lời trì hoãn"></div>' +
        '<ul class="results olist" id="results"></ul>' +
        '<h2 class="section-title">5 bước hóa giải</h2>' +
        '<div class="steps5">' + steps + '</div>' +
        '<h2 class="section-title">Lời dẫn & Lời kết</h2>' +
        '<details class="prose"><summary>Lời dẫn</summary>' + intro + '</details>' +
        '<details class="prose" style="margin-top:10px"><summary>Lời kết</summary><p><strong>' + esc(cap(D.outro.title)) + '</strong></p>' + outro + '<img src="assets/loi-ket.png" alt="Lời kết — Bảo Việt Nhân thọ" style="margin:16px auto 0;border-radius:12px;width:100%;max-width:500px">' + '</details>' +
      '</div>';

    var q = document.getElementById('q'), res = document.getElementById('results');
    q.addEventListener('input', function () {
      var v = norm(q.value.trim());
      if (v.length < 2) { res.innerHTML = ''; return; }
      var out = [];
      D.groups.forEach(function (g) {
        g.items.forEach(function (it, i) {
          var hay = norm(it.title + ' ' + it.steps.map(function (s) { return s.paras.map(function (p) { return p.t; }).join(' '); }).join(' '));
          if (hay.indexOf(v) > -1) out.push(objItem(g, i, true));
        });
      });
      res.innerHTML = out.length ? out.join('') : '<li class="prose" style="padding:14px">Không tìm thấy kết quả phù hợp.</li>';
    });
  }
  function cap(s) { return s.charAt(0) + s.slice(1).toLowerCase(); }
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }

  /* ---------- B3: GROUP — tổng thể cách hóa giải ---------- */
  function group(g) {
    var gi = groupIndex(g.id);
    app.innerHTML =
      '<section class="ghead" style="--c:' + COLORS[g.id] + '"><div class="wrap">' +
        '<a class="crumb" href="#/">' + BACK + '4 nhóm trì hoãn</a>' +
        '<div class="gno">NHÓM ' + (gi + 1) + '</div><h1>' + esc(g.name) + '</h1><p>' + esc(g.desc) + '</p>' +
      '</div></section>' +
      '<div class="wrap fade">' +
        '<div class="note"><strong>Lưu ý cho TVV</strong><ul>' + g.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul></div>' +
        '<h2 class="section-title">Lời hóa giải mẫu <span class="step-no">' + g.items.length + '</span></h2>' +
        '<ul class="olist">' + g.items.map(function (_, i) { return objItem(g, i); }).join('') + '</ul>' +
        '<h2 class="section-title">Các lời trì hoãn thường gặp</h2>' +
        '<div class="chips">' + g.common.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</div>' +
      '</div>';
  }

  /* ---------- B4: DETAIL — lời hóa giải mẫu ---------- */
  function detail(g, idx) {
    var it = g.items[idx], gi = groupIndex(g.id);
    var steps = it.steps.map(function (s, si) {
      var body = '', list = [];
      function flush() { if (list.length) { body += '<ul>' + list.join('') + '</ul>'; list = []; } }
      s.paras.forEach(function (p) {
        var t = p.t;
        if (p.b) { list.push('<li>' + esc(t) + '</li>'); return; }
        flush();
        var m = t.match(/^Hoặc\s*:?\s*(.*)$/);
        if (m) { body += '<span class="or">Hoặc</span>'; t = m[1]; if (!t) return; }
        var act = /^\(.*\)$/.test(t);
        body += '<p' + (act ? ' class="act"' : '') + '>' + esc(t) + '</p>';
      });
      flush();
      return '<li class="tstep"><span class="dot">' + (si + 1) + '</span><div class="box">' +
        '<h3>Bước ' + (si + 1) + ' · ' + esc(s.label.replace(/\s*\/\s*/g, ' / ')) + '</h3>' + body +
        (si > 0 ? '<button class="copy" data-copy="' + si + '">Sao chép lời thoại</button>' : '') +
        '</div></li>';
    }).join('');

    var prev = idx > 0 ? '<a class="prev" href="#/nhom/' + g.id + '/' + idx + '"><small>← Trước</small><span>' + esc(g.items[idx - 1].title) + '</span></a>' : '';
    var next = idx < g.items.length - 1 ? '<a class="next" href="#/nhom/' + g.id + '/' + (idx + 2) + '"><small>Tiếp →</small><span>' + esc(g.items[idx + 1].title) + '</span></a>' : '';

    app.innerHTML =
      '<section class="ghead" style="--c:' + COLORS[g.id] + '"><div class="wrap">' +
        '<a class="crumb" href="#/nhom/' + g.id + '">' + BACK + 'Nhóm ' + (gi + 1) + ' · ' + esc(g.name) + '</a>' +
        '<div class="quote"><small>Lời trì hoãn ' + pad(idx + 1) + '/' + pad(g.items.length) + '</small>' + esc(it.title) + '</div>' +
      '</div></section>' +
      '<div class="wrap fade">' +
        '<h2 class="section-title">Lời hóa giải mẫu</h2>' +
        '<ol class="timeline">' + steps + '</ol>' +
        '<nav class="pager">' + prev + next + '</nav>' +
        '<a class="btn btn-ghost" href="#/nhom/' + g.id + '" style="width:100%">Xem tất cả lời hóa giải nhóm ' + esc(g.name) + '</a>' +
      '</div>';

    app.querySelectorAll('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var s = it.steps[+b.dataset.copy];
        copyText(s.paras.map(function (p) { return p.t; }).join('\n'));
      });
    });
  }

  /* ---------- Router ---------- */
  function route() {
    var parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    var g = parts[0] === 'nhom' ? D.groups[groupIndex(parts[1])] : null;
    if (g && parts[2]) {
      var n = parseInt(parts[2], 10) - 1;
      if (n >= 0 && n < g.items.length) { detail(g, n); setTitle(g.items[n].title); }
      else { location.hash = '#/nhom/' + g.id; return; }
    } else if (g) { group(g); setTitle('Nhóm ' + g.name); }
    else { home(); setTitle(); }
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }
  function setTitle(t) {
    document.title = (t ? t + ' · ' : '') + 'Cẩm nang hóa giải sự trì hoãn | Bảo Việt Nhân thọ';
  }
  window.addEventListener('hashchange', route);
  route();

  /* ---------- B1: QR / link ---------- */
  var modal = document.getElementById('qrModal'), box = document.getElementById('qrBox');
  document.getElementById('qrBtn').addEventListener('click', function () {
    var url = location.href;
    box.innerHTML = '';
    document.getElementById('qrUrl').textContent = url;
    if (window.QRCode) {
      new QRCode(box, { text: url, width: 480, height: 480, colorDark: '#06438a', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
      setTimeout(function () {
        var c = box.querySelector('canvas');
        if (c) document.getElementById('qrDownload').href = c.toDataURL('image/png');
      }, 50);
    } else {
      box.textContent = 'Không tải được thư viện QR. Hãy dùng nút Sao chép link.';
    }
    modal.hidden = false;
  });
  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.hasAttribute('data-close')) modal.hidden = true;
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.hidden = true; });
  document.getElementById('qrCopy').addEventListener('click', function () { copyText(location.href); });

  var toastT;
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast('Đã sao chép'); }, fallback);
    } else fallback();
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('Đã sao chép'); } catch (e) { toast('Không sao chép được'); }
      ta.remove();
    }
  }
})();
