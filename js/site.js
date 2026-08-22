/* 锐枫皮业 · Grok Bot 版。无网络请求。语言记在 localStorage ruifeng-lang */
(function () {
  "use strict";

  var LANG_KEY = "ruifeng-lang";
  var INQ_KEY = "ruifeng-inquiries";

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function getLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "en" || q === "zh") return q;
    try {
      return localStorage.getItem(LANG_KEY) === "en" ? "en" : "zh";
    } catch (e) {
      return "zh";
    }
  }

  function applyLang(lang) {
    var l = lang === "en" ? "en" : "zh";
    try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
    document.documentElement.setAttribute("data-lang", l);
    document.documentElement.lang = l === "en" ? "en" : "zh-CN";
    qsa("[data-lang-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang-btn") === l ? "true" : "false");
    });
    rewriteLinks(l);
    try {
      var u = new URL(location.href);
      u.searchParams.set("lang", l);
      history.replaceState({}, "", u.pathname.split("/").pop() + u.search + u.hash);
    } catch (e) {}
  }

  function withLang(href, lang) {
    if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0) return href;
    if (/^https?:/i.test(href)) return href;
    var hash = "";
    var hashAt = href.indexOf("#");
    if (hashAt >= 0) { hash = href.slice(hashAt); href = href.slice(0, hashAt); }
    var path = href;
    var query = "";
    var qAt = href.indexOf("?");
    if (qAt >= 0) { path = href.slice(0, qAt); query = href.slice(qAt + 1); }
    var params = new URLSearchParams(query);
    params.set("lang", lang);
    return path + "?" + params.toString() + hash;
  }

  function rewriteLinks(lang) {
    qsa("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      if (a.hasAttribute("data-keep-href")) return;
      a.setAttribute("href", withLang(href, lang));
    });
  }

  function hideById(id) {
    var data = window.RUIFENG;
    if (!data) return null;
    for (var i = 0; i < data.hides.length; i++) {
      if (data.hides[i].id === id) return data.hides[i];
    }
    return null;
  }

  function swatchPath(colorId) {
    return "img/swatches/" + colorId + ".png";
  }

  function categoryOf(h) {
    var cats = (window.RUIFENG && window.RUIFENG.categories) || [];
    for (var i = 0; i < cats.length; i++) {
      if (cats[i].id === h.category) return cats[i];
    }
    return null;
  }

  function hidePhoto(h) {
    var c = categoryOf(h);
    if (c && c.photo) return c.photo;
    return swatchPath(h.colors[0]);
  }

  function colorName(colorId, lang) {
    var c = window.RUIFENG.colors[colorId];
    if (!c) return colorId;
    return lang === "en" ? c.en : c.zh;
  }

  function colorCode(colorId) {
    var c = window.RUIFENG.colors[colorId];
    return (c && c.code) ? c.code : "";
  }

  function colorEntries() {
    var colors = (window.RUIFENG && window.RUIFENG.colors) || {};
    var fams = (window.RUIFENG && window.RUIFENG.colorFamilies) || [];
    var order = {};
    fams.forEach(function (f, i) { order[f.id] = i; });
    return Object.keys(colors).map(function (id) {
      return { id: id, c: colors[id] };
    }).sort(function (a, b) {
      var fa = order.hasOwnProperty(a.c.family) ? order[a.c.family] : 99;
      var fb = order.hasOwnProperty(b.c.family) ? order[b.c.family] : 99;
      if (fa !== fb) return fa - fb;
      return String(a.c.code || "").localeCompare(String(b.c.code || ""));
    });
  }

  function fillColorSelects(selected) {
    qsa("[data-color-select], select[name=color_code]").forEach(function (sel) {
      var current = selected || sel.value || "";
      sel.innerHTML = "";
      var blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "—";
      sel.appendChild(blank);
      colorEntries().forEach(function (x) {
        if (!x.c || !x.c.code) return;
        var o = document.createElement("option");
        o.value = x.c.code;
        o.textContent = x.c.code + " · " + x.c.zh + " / " + x.c.en;
        if (current && (current === x.c.code || current === x.id)) o.selected = true;
        sel.appendChild(o);
      });
    });
  }

  function imgWithFallback(src, fallback, cls) {
    var extra = cls ? ' class="' + cls + '"' : "";
    var chain = [];
    if (Object.prototype.toString.call(fallback) === "[object Array]") {
      chain = fallback.filter(Boolean);
    } else if (fallback) {
      chain = [fallback];
    }
    return (
      '<img' + extra + ' src="' + src + '" alt="" data-fallback="' + chain.join("|") + '" ' +
      'onerror="(function(el){var p=(el.getAttribute(\'data-fallback\')||\'\').split(\'|\');var n=p.shift();if(!n){el.onerror=null;return;}el.setAttribute(\'data-fallback\',p.join(\'|\'));if(!p.length)el.onerror=null;el.src=n;})(this)">'
    );
  }

  function categoryFallbacks(c, colorId) {
    var list = [];
    if (c && c.photo_fallback) list.push(c.photo_fallback);
    if (colorId) list.push(swatchPath(colorId));
    else if (c && c.swatch) list.push(swatchPath(c.swatch));
    return list;
  }

  function initHeroAtelier() {
    var el = qs("#heroBg");
    if (!el) return;
    var atelier = el.getAttribute("data-atelier") || "img/atelier/hero-hide.png";
    var fallback = el.getAttribute("data-fallback") || "img/hero.jpg";
    var probe = new Image();
    probe.onload = function () {
      el.style.backgroundImage = "url('" + atelier + "')";
    };
    probe.onerror = function () {
      el.style.backgroundImage = "url('" + fallback + "')";
    };
    probe.src = atelier;
  }

  function priceBlock(h) {
    return (
      '<div class="price">' +
        '<div class="price-main">' +
          '<span class="lang-zh">参考价 ' + h.price_cny_per_sqft + ' 元/尺 · 具体再谈</span>' +
          '<span class="lang-en">from (reference) ¥' + h.price_cny_per_sqft + ' / sq ft · talk later</span>' +
        "</div>" +
        '<div class="price-sub">' +
          '<span class="lang-zh">约 US$' + h.price_usd_per_sqft + ' / sq ft · 不是实价</span>' +
          '<span class="lang-en">approx US$' + h.price_usd_per_sqft + ' / sq ft · not a live quote</span>' +
        "</div>" +
      "</div>"
    );
  }

  function hideCard(h) {
    var primary = h.colors[0];
    var dots = h.colors.map(function (cid) {
      var c = window.RUIFENG.colors[cid];
      var hex = c ? c.hex : "#ccc";
      return '<i class="card-dot" style="background:' + hex + '"></i>';
    }).join("");
    return (
      '<article class="hide-card">' +
        '<a class="card-link" href="product.html?id=' + encodeURIComponent(h.id) + '">' +
          '<div class="swatch-wrap">' +
            imgWithFallback(hidePhoto(h), categoryFallbacks(categoryOf(h), primary), "") +
          "</div>" +
          '<div class="card-body">' +
            '<p class="eyebrow">' +
              '<span class="lang-zh">' + h.category_zh + "</span>" +
              '<span class="lang-en">' + h.category_en + "</span>" +
            "</p>" +
            "<h3>" +
              '<span class="lang-zh">' + h.name_zh + "</span>" +
              '<span class="lang-en">' + h.name_en + "</span>" +
            "</h3>" +
            '<p class="meta">' +
              '<span class="lang-zh">' + h.thickness_mm + " mm</span>" +
              '<span class="lang-en">' + h.thickness_mm + " mm</span>" +
            "</p>" +
            '<p class="card-dots">' + dots + "</p>" +
            priceBlock(h) +
          "</div>" +
        "</a>" +
      "</article>"
    );
  }

  function initLangButtons() {
    qsa("[data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang-btn"));
      });
    });
  }

  function initNav() {
    var page = document.body.getAttribute("data-page") || "";
    qsa("nav a[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === page) a.setAttribute("aria-current", "page");
    });
    var toggle = qs("[data-nav-toggle]");
    var links = qs(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  }

  function initScroll() {
    var nav = qs("nav");
    var heroBg = qs("#heroBg");
    function onScroll() {
      var y = window.scrollY || 0;
      if (nav) {
        if (y > 80) nav.classList.add("scrolled");
        else nav.classList.remove("scrolled");
      }
      if (heroBg) {
        heroBg.style.transform = "scale(1.05) translateY(" + (y * 0.12) + "px)";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initReveal() {
    if (!("IntersectionObserver" in window)) {
      qsa(".reveal").forEach(function (el) { el.classList.add("active"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add("active");
      });
    }, { threshold: 0.12 });
    qsa(".reveal").forEach(function (el) { observer.observe(el); });
  }

  function renderHome() {
    var grid = qs("[data-home-cats]");
    if (!grid || !window.RUIFENG) return;
    grid.innerHTML = window.RUIFENG.categories.map(function (c) {
      var photo = c.photo || ("img/grains/" + c.id + ".png");
      var fallback = categoryFallbacks(c, c.swatch);
      return (
        '<a class="chapter" href="catalog.html?type=' + c.id + '">' +
          '<div class="chapter-photo">' +
            imgWithFallback(photo, fallback, "") +
          "</div>" +
          '<div class="chapter-cap">' +
            "<h3>" +
              '<span class="lang-zh">' + c.zh + "</span>" +
              '<span class="lang-en">' + c.en + "</span>" +
            "</h3>" +
            "<p>" +
              '<span class="lang-zh">' + (c.line_zh || "") + "</span>" +
              '<span class="lang-en">' + (c.line_en || "") + "</span>" +
            "</p>" +
          "</div>" +
        "</a>"
      );
    }).join("");
    rewriteLinks(getLang());
  }

  function thicknessBucket(mm) {
    if (mm < 1.2) return "thin";
    if (mm <= 1.8) return "mid";
    return "thick";
  }

  function hideMatchesColorFamily(h, family) {
    if (!family) return true;
    return h.colors.some(function (cid) {
      var c = window.RUIFENG.colors[cid];
      return c && c.family === family;
    });
  }

  function renderCatalog() {
    var mount = qs("[data-catalog]");
    if (!mount || !window.RUIFENG) return;
    var params = new URLSearchParams(location.search);
    var state = {
      type: params.get("type") || "",
      thick: params.get("thick") || "",
      color: params.get("color") || ""
    };

    var typeRow = qs("[data-filter-types]");
    if (typeRow && typeRow.getAttribute("data-built") !== "1") {
      typeRow.setAttribute("data-built", "1");
      var label = typeRow.querySelector(".filter-label");
      var chips = window.RUIFENG.categories.map(function (c) {
        return (
          '<button type="button" class="chip" data-filter-type="' + c.id + '">' +
            '<span class="lang-zh">' + c.zh + "</span>" +
            '<span class="lang-en">' + c.en + "</span>" +
          "</button>"
        );
      }).join("");
      typeRow.innerHTML = (label ? label.outerHTML : "") + chips;
    }

    var colorRow = qs("[data-filter-colors]");
    if (colorRow && colorRow.getAttribute("data-built") !== "1") {
      colorRow.setAttribute("data-built", "1");
      var colorLabel = colorRow.querySelector(".filter-label");
      var colorChips = (window.RUIFENG.colorFamilies || []).map(function (f) {
        return (
          '<button type="button" class="chip" data-filter-color="' + f.id + '">' +
            '<span class="lang-zh">' + f.zh + "</span>" +
            '<span class="lang-en">' + f.en + "</span>" +
          "</button>"
        );
      }).join("");
      colorRow.innerHTML = (colorLabel ? colorLabel.outerHTML : "") + colorChips;
    }

    function apply() {
      var list = window.RUIFENG.hides.filter(function (h) {
        if (state.type && h.category !== state.type) return false;
        if (state.thick && thicknessBucket(h.thickness_mm) !== state.thick) return false;
        if (state.color && !hideMatchesColorFamily(h, state.color)) return false;
        return true;
      });
      var countEl = qs("[data-result-count]");
      if (countEl) {
        countEl.innerHTML =
          '<span class="lang-zh">共 ' + list.length + " 条示例皮料</span>" +
          '<span class="lang-en">' + list.length + " sample hides</span>";
      }
      if (!list.length) {
        mount.innerHTML =
          '<p class="empty">' +
            '<span class="lang-zh">这组条件没有示例。换一个筛选，或看全部。</span>' +
            '<span class="lang-en">No samples for this filter. Clear one and try again.</span>' +
          "</p>";
      } else {
        mount.innerHTML = list.map(hideCard).join("");
      }
      rewriteLinks(getLang());
    }

    function bindGroup(name, key) {
      qsa("[data-filter-" + name + "]").forEach(function (btn) {
        var val = btn.getAttribute("data-filter-" + name);
        if (val === state[key]) btn.classList.add("is-on");
        btn.addEventListener("click", function () {
          state[key] = state[key] === val ? "" : val;
          qsa("[data-filter-" + name + "]").forEach(function (b) {
            b.classList.toggle("is-on", b.getAttribute("data-filter-" + name) === state[key]);
          });
          apply();
        });
      });
    }
    bindGroup("type", "type");
    bindGroup("thick", "thick");
    bindGroup("color", "color");

    var clear = qs("[data-filter-clear]");
    if (clear) {
      clear.addEventListener("click", function () {
        state.type = state.thick = state.color = "";
        qsa(".chip").forEach(function (b) { b.classList.remove("is-on"); });
        apply();
      });
    }
    apply();
  }

  function renderProduct() {
    var mount = qs("[data-product]");
    if (!mount || !window.RUIFENG) return;
    var id = new URLSearchParams(location.search).get("id") || "";
    var h = hideById(id);
    if (!h) {
      mount.innerHTML =
        '<div class="prose">' +
          "<h1>" +
            '<span class="lang-zh">没有这条皮</span>' +
            '<span class="lang-en">This hide is not in the demo</span>' +
          "</h1>" +
          "<p>" +
            '<span class="lang-zh">链接可能写错了。回目录再点一张。</span>' +
            '<span class="lang-en">The link may be wrong. Go back to the catalog.</span>' +
          "</p>" +
          '<p><a class="btn-ink" href="catalog.html">' +
            '<span class="lang-zh">回皮料目录</span>' +
            '<span class="lang-en">Back to catalog</span>' +
          "</a></p>" +
        "</div>";
      rewriteLinks(getLang());
      return;
    }

    document.title = h.name_zh + " / " + h.name_en + " · 锐枫皮业";

    var chips = h.colors.map(function (cid) {
      var cc = window.RUIFENG.colors[cid] || {};
      return (
        '<figure class="chip-color">' +
          '<img src="' + swatchPath(cid) + '" alt="' + (cc.code || cid) + '">' +
          "<figcaption>" +
            '<strong class="color-code">' + (cc.code || "") + "</strong>" +
            '<span class="color-duo">' + colorName(cid, "zh") + " / " + colorName(cid, "en") + "</span>" +
          "</figcaption>" +
        "</figure>"
      );
    }).join("");

    var inquiryHref = "inquiry.html?hide=" + encodeURIComponent(h.id);

    mount.innerHTML =
      '<div class="product-grid">' +
        '<div class="product-visual">' +
          imgWithFallback(hidePhoto(h), categoryFallbacks(categoryOf(h), h.colors[0]), "hero-swatch") +
          '<p class="fineprint" style="margin-top:14px">' +
            '<span class="lang-zh">系列皮面，图是占位。</span>' +
            '<span class="lang-en">Collection hide — image is a placeholder.</span>' +
          "</p>" +
        "</div>" +
        '<div class="product-copy">' +
          '<p class="eyebrow">' +
            '<span class="lang-zh">' + h.category_zh + " · " + h.id + "</span>" +
            '<span class="lang-en">' + h.category_en + " · " + h.id + "</span>" +
          "</p>" +
          "<h1>" +
            '<span class="lang-zh">' + h.name_zh + "</span>" +
            '<span class="lang-en">' + h.name_en + "</span>" +
          "</h1>" +
          '<table class="spec-table">' +
            "<tr>" +
              '<th><span class="lang-zh">厚度</span><span class="lang-en">Thickness</span></th>' +
              "<td>" + h.thickness_mm + " mm</td>" +
            "</tr>" +
            "<tr>" +
              '<th><span class="lang-zh">鞣法</span><span class="lang-en">Tannage</span></th>' +
              '<td><span class="lang-zh">' + h.tannage_zh + '</span><span class="lang-en">' + h.tannage_en + "</span></td>" +
            "</tr>" +
            "<tr>" +
              '<th><span class="lang-zh">手感</span><span class="lang-en">Hand</span></th>' +
              '<td><span class="lang-zh">' + h.finish_zh + '</span><span class="lang-en">' + h.finish_en + "</span></td>" +
            "</tr>" +
            "<tr>" +
              '<th><span class="lang-zh">适合</span><span class="lang-en">Best for</span></th>' +
              '<td><span class="lang-zh">' + h.best_for_zh + '</span><span class="lang-en">' + h.best_for_en + "</span></td>" +
            "</tr>" +
          "</table>" +
          '<p class="fineprint">' +
            '<span class="lang-zh">幅宽约 ' + h.width_cm + " cm · 小牛 · 认证占位 — 厂里有再补</span>" +
            '<span class="lang-en">Width approx ' + h.width_cm + " cm · calf · certificates: add only if the mill has them</span>" +
          "</p>" +
          priceBlock(h) +
          '<div class="color-row">' + chips + "</div>" +
          '<div class="cta-zh">' +
            '<div class="wechat-card">' +
              "<h2>中文这边：加微信问</h2>" +
              "<p>这是示例微信号，不是真客服。</p>" +
              '<p class="wechat-id">ruifeng-demo</p>' +
              '<button type="button" class="btn-ink" data-copy="ruifeng-demo">复制微信号</button>' +
              '<p class="fineprint" style="margin-top:14px">看中了就微信说皮的编号（' + h.id + '）和色号（例如 ' + (colorCode(h.colors[0]) || "RF-xxxx") + '）。要小样也可以先填询价表。</p>' +
              '<p style="margin-top:10px"><a class="text-link" href="' + inquiryHref + '">也可以先填询价表 →</a></p>' +
            "</div>" +
          "</div>" +
          '<div class="cta-en">' +
            "<h2>English: email or this form</h2>" +
            '<p>Reference only. Write <a data-keep-href href="mailto:hello@ruifengleather.com">hello@ruifengleather.com</a> or send the note below. Nothing is emailed by this page — it stays on this computer.</p>' +
            '<form class="mini-form" data-inquiry-form data-source="product">' +
              '<input type="hidden" name="hides" value="' + h.id + " " + h.name_en + '">' +
              '<label>Color code / 色号' +
                '<select name="color_code" required data-color-select><option value="">—</option></select>' +
              "</label>" +
              '<p class="fineprint">Order by code. Names can change; codes do not.</p>' +
              '<label>Your name <input name="name" required autocomplete="name"></label>' +
              '<label>Studio / brand <input name="brand" autocomplete="organization"></label>' +
              '<label>Email <input name="email" type="email" required autocomplete="email"></label>' +
              '<label>What is it for?' +
                '<select name="use">' +
                  '<option value="bags">Bags</option>' +
                  '<option value="shoes">Shoes</option>' +
                  '<option value="small">Small leather goods</option>' +
                  '<option value="other">Other</option>' +
                "</select>" +
              "</label>" +
              '<label>Qty (sq ft, example) <input name="qty" placeholder="e.g. 30"></label>' +
              '<label class="check"><input type="checkbox" name="swatch" checked> I want a swatch (demo request)</label>' +
              '<label>Note <textarea name="note" rows="3" placeholder="Color, thickness, deadline"></textarea></label>' +
              '<button type="submit" class="btn-ink">Save inquiry on this computer</button>' +
            "</form>" +
            '<p class="fineprint">Or use the full form on the Inquiry page.</p>' +
            '<p><a class="text-link" href="' + inquiryHref + '">Open full inquiry form →</a></p>' +
          "</div>" +
        "</div>" +
      "</div>";

    rewriteLinks(getLang());
    fillColorSelects(colorCode(h.colors[0]));
    bindCopy();
    bindInquiryForms();
  }

  function colorCardHtml(id, c) {
    return (
      '<figure class="color-card" data-family="' + c.family + '" data-code="' + (c.code || "") + '">' +
        '<a class="card-link" href="inquiry.html?code=' + encodeURIComponent(c.code || "") + '">' +
          '<img src="' + swatchPath(id) + '" alt="' + (c.code || id) + '">' +
          "<figcaption>" +
            '<strong class="color-code">' + (c.code || "") + "</strong>" +
            '<span class="color-duo"><b>' + c.zh + "</b> " + c.en + "</span>" +
          "</figcaption>" +
        "</a>" +
      "</figure>"
    );
  }

  function renderColors() {
    var mount = qs("[data-color-wall]");
    if (!mount || !window.RUIFENG) return;
    var fams = window.RUIFENG.colorFamilies || [];
    var params = new URLSearchParams(location.search);
    var family = params.get("family") || "";

    var bar = qs("[data-color-families]");
    if (bar && bar.getAttribute("data-built") !== "1") {
      bar.setAttribute("data-built", "1");
      bar.innerHTML =
        '<button type="button" class="chip" data-color-family="">' +
          '<span class="lang-zh">全部</span><span class="lang-en">All</span>' +
        "</button>" +
        fams.map(function (f) {
          return (
            '<button type="button" class="chip" data-color-family="' + f.id + '">' +
              '<span class="lang-zh">' + f.zh + "</span>" +
              '<span class="lang-en">' + f.en + "</span>" +
            "</button>"
          );
        }).join("");
    }

    function paint() {
      qsa("[data-color-family]").forEach(function (btn) {
        btn.classList.toggle("is-on", (btn.getAttribute("data-color-family") || "") === family);
      });
      var entries = colorEntries();
      var groups = fams.map(function (f) {
        if (family && family !== f.id) return "";
        var cards = entries.filter(function (x) { return x.c.family === f.id; });
        if (!cards.length) return "";
        return (
          '<section class="color-family">' +
            '<h2 class="family-head">' + f.zh + " <em>" + f.en + "</em></h2>" +
            '<div class="color-wall">' +
              cards.map(function (x) { return colorCardHtml(x.id, x.c); }).join("") +
            "</div>" +
          "</section>"
        );
      }).join("");
      mount.innerHTML = groups || (
        '<p class="empty">' +
          '<span class="lang-zh">这一系还没有色号。</span>' +
          '<span class="lang-en">No codes in this family yet.</span>' +
        "</p>"
      );
      rewriteLinks(getLang());
    }

    qsa("[data-color-family]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        family = btn.getAttribute("data-color-family") || "";
        paint();
      });
    });
    paint();
  }

  function readInquiries() {
    try {
      return JSON.parse(localStorage.getItem(INQ_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function writeInquiries(list) {
    try { localStorage.setItem(INQ_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function formToRecord(form) {
    var fd = new FormData(form);
    var wechat = (fd.get("wechat") || "").toString().trim();
    var email = (fd.get("email") || "").toString().trim();
    return {
      id: "inq-" + Date.now(),
      savedAt: new Date().toISOString(),
      name: (fd.get("name") || "").toString().trim(),
      brand: (fd.get("brand") || "").toString().trim(),
      wechat: wechat,
      email: email,
      hides: (fd.get("hides") || "").toString().trim(),
      color_code: (fd.get("color_code") || "").toString().trim(),
      use: (fd.get("use") || "").toString(),
      qty: (fd.get("qty") || "").toString().trim(),
      swatch: fd.get("swatch") ? true : false,
      note: (fd.get("note") || "").toString().trim(),
      source: form.getAttribute("data-source") || "inquiry"
    };
  }

  function bindInquiryForms() {
    qsa("[data-inquiry-form]").forEach(function (form) {
      if (form.getAttribute("data-bound") === "1") return;
      form.setAttribute("data-bound", "1");
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var rec = formToRecord(form);
        if (!rec.name) return;
        if (!rec.color_code) {
          var codeBox = qs("[data-form-msg]", form) || form.appendChild(document.createElement("p"));
          codeBox.className = "form-msg err";
          codeBox.setAttribute("data-form-msg", "");
          codeBox.innerHTML =
            '<span class="lang-zh">请选色号。下单按色号，不按名字。</span>' +
            '<span class="lang-en">Pick a color code. Orders go by code, not by name.</span>';
          return;
        }
        if (!rec.wechat && !rec.email) {
          var box = qs("[data-form-msg]", form) || form.appendChild(document.createElement("p"));
          box.className = "form-msg err";
          box.setAttribute("data-form-msg", "");
          box.innerHTML =
            '<span class="lang-zh">微信或邮箱留一个就行。</span>' +
            '<span class="lang-en">Leave a WeChat id or an email.</span>';
          return;
        }
        var list = readInquiries();
        list.unshift(rec);
        writeInquiries(list);
        form.reset();
        var msg = document.createElement("div");
        msg.className = "form-msg ok";
        msg.innerHTML =
          '<span class="lang-zh">已记在这台电脑（没有发到网上）。编号 ' + rec.id + "。</span>" +
          '<span class="lang-en">Saved on this computer only (not sent). Id ' + rec.id + ".</span>";
        form.parentNode.insertBefore(msg, form);
        renderInquiryList();
        try { msg.scrollIntoView({ block: "nearest" }); } catch (e) {}
      });
    });
  }

  function renderInquiryList() {
    var mount = qs("[data-inq-list]");
    if (!mount) return;
    var list = readInquiries();
    if (!list.length) {
      mount.innerHTML =
        '<p class="fineprint">' +
          '<span class="lang-zh">这台电脑还没有本地询价草稿。</span>' +
          '<span class="lang-en">No local inquiry drafts on this computer yet.</span>' +
        "</p>";
      return;
    }
    mount.innerHTML = "<ol class='inq-list'>" + list.map(function (r) {
      return (
        "<li>" +
          "<strong>" + escapeHtml(r.name || "—") + "</strong> · " +
          escapeHtml(r.brand || "") + "<br>" +
          '<span class="lang-zh">色号 ' + escapeHtml(r.color_code || "—") + " · 皮料 " + escapeHtml(r.hides || "—") + " · " + (r.swatch ? "要小样" : "不要小样") + "</span>" +
          '<span class="lang-en">Code ' + escapeHtml(r.color_code || "—") + " · hides " + escapeHtml(r.hides || "—") + " · " + (r.swatch ? "wants swatch" : "no swatch") + "</span>" +
          '<span class="fineprint">' + escapeHtml(r.savedAt) + " · " + escapeHtml(r.id) + "</span>" +
        "</li>"
      );
    }).join("") + "</ol>";
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function initInquiryPage() {
    var form = qs("[data-inquiry-form]");
    if (!form) return;
    var hideId = new URLSearchParams(location.search).get("hide") ||
                 new URLSearchParams(location.search).get("id") || "";
    if (hideId && window.RUIFENG) {
      var h = hideById(hideId);
      var field = qs("[name=hides]", form);
      if (field && h) {
        field.value = h.id + " / " + h.name_zh + " / " + h.name_en;
        field.setAttribute("value", field.value);
      } else if (field && hideId) {
        field.value = hideId;
        field.setAttribute("value", hideId);
      }
    }
    var codeParam = new URLSearchParams(location.search).get("code") ||
                    new URLSearchParams(location.search).get("color") || "";
    fillColorSelects(codeParam);
    bindInquiryForms();
    renderInquiryList();
    var wipe = qs("[data-inq-clear]");
    if (wipe) {
      wipe.addEventListener("click", function () {
        writeInquiries([]);
        renderInquiryList();
      });
    }
  }

  function bindCopy() {
    qsa("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy") || "";
        function done() {
          btn.textContent = document.documentElement.getAttribute("data-lang") === "en" ? "Copied" : "已复制";
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          done();
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(getLang());
    initLangButtons();
    initNav();
    initHeroAtelier();
    initScroll();
    initReveal();
    var page = document.body.getAttribute("data-page");
    if (page === "home") renderHome();
    if (page === "catalog") renderCatalog();
    if (page === "product") renderProduct();
    if (page === "colors") renderColors();
    if (page === "inquiry") initInquiryPage();
    bindCopy();
    rewriteLinks(getLang());
  });
})();
