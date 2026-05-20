/* eslint-disable */
const { useState, useEffect, useRef, useMemo } = React;

const KAKAO_HREF = "https://pf.kakao.com/_xleKLxj";

// ─── Utilities ──────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("ko-KR");

// Intersection-Observer hook — triggers once when element enters viewport
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.1, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// Wrapper that fades-up children when scrolled into view
function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={"fade-in-section " + (inView ? "visible" : "") + " " + className}
      style={{ transitionDelay: delay + "ms" }}
    >
      {children}
    </div>
  );
}

function useScrolled() {
  const [scrolled, set] = useState(false);
  useEffect(() => {
    const fn = () => set(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return scrolled;
}

// Global: mark images as loaded for fade-in
if (typeof document !== "undefined") {
  document.addEventListener("load", (e) => {
    if (e.target.tagName === "IMG") e.target.classList.add("loaded");
  }, true);
}

// Lock body scroll while a sheet is open. Uses `position: fixed` so
// Chrome mobile pull-to-refresh can't trigger and touch scroll inside
// the sheet doesn't bleed through to the page behind.
function useBodyLock() {
  useEffect(() => {
    const scrollY = window.scrollY;
    const hs = document.documentElement.style;
    const bs = document.body.style;
    const prev = {
      htmlOverflow: hs.overflow,
      bodyOverflow: bs.overflow,
      bodyPosition: bs.position,
      bodyTop: bs.top,
      bodyWidth: bs.width,
    };
    hs.overflow = "hidden";
    bs.overflow = "hidden";
    bs.position = "fixed";
    bs.top = `-${scrollY}px`;
    bs.width = "100%";
    return () => {
      hs.overflow = prev.htmlOverflow;
      bs.overflow = prev.bodyOverflow;
      bs.position = prev.bodyPosition;
      bs.top = prev.bodyTop;
      bs.width = prev.bodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, []);
}

// ─── Expandable text ───────────────────────────────────────
function ExpandableText({ text, limit = 60 }) {
  const [open, setOpen] = useState(false);
  if (text.length <= limit) return <p className="intro-desc">{text}</p>;
  if (open) {
    return (
      <p className="intro-desc">
        {text}
        <button type="button" className="intro-more" onClick={() => setOpen(false)}>접기</button>
      </p>
    );
  }
  return (
    <p className="intro-desc">
      {text.slice(0, limit)}…
      <button type="button" className="intro-more" onClick={() => setOpen(true)}>더보기</button>
    </p>
  );
}

function isOpenNow() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun … 4=Thu … 6=Sat
  if (day === 0) return false; // 매주 일요일 휴무
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= 11 * 60 && mins < 19 * 60;
}

// ─── Featured Slider ────────────────────────────────────────
function FeaturedSlider({ title, meta, list, openStyle }) {
  return (
    <section className="section featured-section">
      <div className="section-head">
        <h3>{title}</h3>
        {meta && <span className="meta">{meta}</span>}
      </div>
      <div className="designer-scroll-wrap">
        <div className="designer-scroll">
          {list.map((s) => (
            <button key={s.id} className="feat-card" onClick={() => openStyle({ ...s, category: s.categoryName, categoryId: s.categoryId })}>
              <div className="feat-thumb">
                <img src={s.img} alt={s.name} />
              </div>
              <div className="feat-info">
                <div className="feat-headline">{s.name}</div>
                <div className="feat-price">{fmt(s.price)}<span className="won">원</span></div>
              </div>
            </button>
          ))}
          <div className="designer-scroll-end" />
        </div>
      </div>
    </section>
  );
}

// ─── Accordion Item (UIUX-DH v0.5.3) ──────────────────────
function AccordionItem({ item, id, open, onToggle }) {
  const triggerId = "acc-trigger-" + id;
  const panelId = "acc-panel-" + id;
  return (
    <div className={"acc-item " + (open ? "open" : "")}>
      <button
        className="acc-trigger"
        id={triggerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="acc-label">{item.q}</span>
        <svg className="acc-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="acc-panel" id={panelId} role="region" aria-labelledby={triggerId}>
          {item.a}
        </div>
      )}
    </div>
  );
}

// Home uses multi-open accordion
function HomeFaqItem({ item, id }) {
  const [open, setOpen] = useState(false);
  return <AccordionItem item={item} id={"home-" + id} open={open} onToggle={() => setOpen(!open)} />;
}

// ─── App bar ────────────────────────────────────────────────
function AppBar({ title, onBack, scrolled, dark, onToggleTheme }) {
  return (
    <div className={"appbar " + (scrolled ? "shadow" : "")}>
      {onBack && (
        <button className="iconbtn" onClick={onBack} aria-label="뒤로 가기"><I.Back /></button>
      )}
      <div className="pagetitle">{title || "도화원플라워"}</div>
      <div className="grow" />
      <button
        className={"theme-toggle " + (dark ? "on" : "")}
        onClick={onToggleTheme}
        aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
        aria-pressed={dark}
      >
        <span className="theme-toggle-track">
          <span className="theme-toggle-icon sun"><I.Sun size={14} strokeWidth={2} /></span>
          <span className="theme-toggle-icon moon"><I.Moon size={13} strokeWidth={2} /></span>
          <span className="theme-toggle-knob" />
        </span>
      </button>
      <button className="iconbtn" onClick={shareSite} aria-label="공유하기"><I.Share /></button>
      <a className="iconbtn" href={KAKAO_HREF} target="_blank" rel="noreferrer" aria-label="카톡 문의"><I.Send /></a>
    </div>
  );
}

async function shareSite() {
  const data = {
    title: "도화원플라워",
    text: "평범한 일상도 꽃 한 송이가 더해지면 특별한 순간이 됩니다. 계절을 듬뿍 머금은 다채로운 꽃들로, 당신의 오늘을 가장 아름답게 피워내겠습니다.",
    url: window.location.href,
  };
  try {
    if (navigator.share) {
      await navigator.share(data);
      return;
    }
  } catch (e) { /* user dismissed */ }
  try {
    await navigator.clipboard.writeText(data.url);
    showShareToast("링크가 복사되었어요");
  } catch {
    showShareToast("공유가 지원되지 않는 환경이에요");
  }
}

function showShareToast(text) {
  const t = document.createElement("div");
  t.className = "toast share-toast";
  t.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 10 17 19 8"/></svg> ${text}`;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity 200ms"; }, 1600);
  setTimeout(() => { t.remove(); }, 1900);
}

// ─── Bottom Nav ─────────────────────────────────────────────
function BottomNav({ route, go }) {
  const tabs = [
    { id: "home",     label: "홈",       icon: I.Home },
    { id: "styles",   label: "디자인",   icon: I.Flower },
    { id: "booking",  label: "예약요청", icon: I.Clipboard },
    { id: "faq",     label: "질문/답변", icon: I.Help },
  ];
  return (
    <nav className="bottomnav" aria-label="기본 메뉴">
      {tabs.map((t) => {
        const Ic = t.icon;
        const active = route.startsWith(t.id);
        return (
          <button key={t.id} className={active ? "on" : ""} onClick={() => go(t.id)} aria-current={active}>
            <Ic size={22} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── HOME ────────────────────────────────────────────────────
function HomeScreen({ go, openStyle, openDesigner }) {
  return (
    <div>
      <section className="hero" aria-label="도화원플라워">
        <div className="hero-img">
          <img src="img/hero.jpg" alt="도화원플라워 매장" />
        </div>
      </section>

      <FadeIn>
        <section className="intro">
          <div className="intro-meta">대구광역시 | 달서구</div>
          <h2 className="intro-name">도화원플라워</h2>
          <p className="intro-desc">평범한 일상도 꽃 한 송이가 더해지면 특별한 순간이 됩니다.{"\n\n"}계절을 듬뿍 머금은 다채로운 꽃들로, 당신의 오늘을 가장 아름답게 피워내겠습니다.</p>

          <div className="intro-map" aria-label="매장 위치 지도">
            <img src="img/map.png" alt="도화원플라워 매장 위치" className="intro-map-img" />
            <a className="intro-map-cta" href="https://map.naver.com/p/search/대구 달서구 당산로 99" target="_blank" rel="noreferrer" aria-label="네이버 지도에서 열기">
              <img src="img/naver_map.png" alt="" className="naver-map-icon" /> 네이버 지도
            </a>
          </div>

          <ul className="intro-list">
            <li>
              <span className="intro-list-icon"><I.Map size={18} /></span>
              <span className="intro-list-text">대구 달서구 당산로 99 1층 도화원플라워</span>
            </li>
            <li>
              <span className="intro-list-icon"><I.Calendar size={18} /></span>
              <span className="intro-list-text">
                11:00 ~ 19:00 · 매주 일요일 휴무
                <span className="intro-open-status" data-open={isOpenNow()}>
                  {isOpenNow() ? "현재 영업 중" : "현재 영업 종료"}
                </span>
              </span>
            </li>
          </ul>
        </section>
      </FadeIn>

      <FadeIn delay={80}>
        <div className="info-banner">
          <span className="info-banner-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8h.01M11 12h1v5h1" />
            </svg>
          </span>
          <p className="info-banner-text">예약요청 탭을 통해 간편히 예약을 요청해보세요!</p>
        </div>
      </FadeIn>

      <FadeIn><FeaturedSlider title="풍성한 꽃다발 추천" list={BUSINESS_STYLES} openStyle={openStyle} /></FadeIn>
      <FadeIn><FeaturedSlider title="특별한 날, 꽃바구니 선물!" list={MZ_STYLES} openStyle={openStyle} /></FadeIn>
      <FadeIn><FeaturedSlider title="아름다운 효도, 용돈박스" list={STARTER_STYLES} openStyle={openStyle} /></FadeIn>
      <FadeIn><FeaturedSlider title="특색있는 아크릴백" list={ACRYLIC_STYLES} openStyle={openStyle} /></FadeIn>

      <FadeIn>
        <section className="section home-faq-section">
          <div className="section-head">
            <h3>주문 전 자주하는 질문</h3>
          </div>
          <div className="accordion" data-mode="multi">
            {FAQ_ITEMS.slice(0, 6).map((it, i) => (
              <HomeFaqItem key={i} item={it} id={i} />
            ))}
          </div>
          <button className="home-faq-more" type="button" onClick={() => go("faq")}>
            전체 질문 보기 <I.Arrow size={14} />
          </button>
        </section>
      </FadeIn>

      <FadeIn>
        <div className="footer footer-cta">
          <a href="https://www.instagram.com/parkhaddd/" target="_blank" rel="noreferrer" className="btn-secondary">
            <I.Insta size={18} /> 인스타그램 둘러보기
          </a>
          <a href={KAKAO_HREF} target="_blank" rel="noreferrer" className="btn btn-kakao">
            카톡 문의 <I.Send size={18} />
          </a>
        </div>
      </FadeIn>
    </div>
  );
}

// ─── STYLES (카탈로그) ───────────────────────────────────────
function StylesScreen({ activeCat, setActiveCat, onPick }) {
  const tabRef = useRef(null);
  useEffect(() => {
    const el = tabRef.current?.querySelector(`[data-tab='${activeCat}']`);
    if (el) el.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [activeCat]);

  const cat = HAIR_CATEGORIES.find((c) => c.id === activeCat) || HAIR_CATEGORIES[0];
  const list = HAIR_STYLES[cat.id] || [];

  return (
    <div>
      <div className="tabbar">
        <div className="tabbar-scroll" ref={tabRef}>
          {HAIR_CATEGORIES.map((c) => (
            <button key={c.id} data-tab={c.id} className={"tab " + (c.id === activeCat ? "on" : "")} onClick={() => setActiveCat(c.id)}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="styles-head anim-fade-in" key={cat.id + "-head"}>
        <div className="styles-sub">{cat.sub}</div>
        <h2>{cat.blurb}</h2>
      </div>

      <div className="styles-grid" key={cat.id + "-grid"}>
        {list.map((s, i) => (
          <button className="style-card anim-stagger" style={{ animationDelay: (i * 60) + "ms" }} key={cat.id + "-" + i} onClick={() => onPick({ ...s, category: cat.name, categoryId: cat.id })}>
            <div className="style-thumb" data-cat={cat.id}>
              {s.img ? (
                <img src={s.img} alt={s.name} loading="lazy" />
              ) : (
                <span className="style-thumb-no">{String(i + 1).padStart(2, "0")}</span>
              )}
              {s.tag && <span className="style-tag">{s.tag}</span>}
            </div>
            <div className="style-body">
              <div className="style-name">{s.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── STYLE SHEET (상세) ─────────────────────────────────────
function StyleSheet({ item, onClose, onBook }) {
  useBodyLock();
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  if (!item) return null;
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={item.name}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <h4>{item.category}</h4>
          <button className="sheet-close" onClick={onClose} aria-label="닫기"><I.Close size={18} /></button>
        </div>
        <div className="sheet-body">
          <div className="style-thumb large" data-cat={item.categoryId}>
            {item.img ? (
              <img src={item.img} alt={item.name} />
            ) : (
              <span className="style-thumb-no">{item.name}</span>
            )}
            {item.tag && <span className="style-tag">{item.tag}</span>}
          </div>
          <div className="sheet-meta">
            <div className="name">{item.name}</div>
            <div className="row" style={{ display: "flex", gap: 14, marginTop: 10, alignItems: "center" }}>
              {item.time && <><span className="style-time"><I.Clock size={14} /> {item.time}분</span><span className="dotsep">·</span></>}
              <span className="price">{fmt(item.price)}<span className="won">원</span></span>
            </div>
            <p className="sheet-desc">{item.desc}</p>
          </div>
        </div>
        <div className="sheet-foot">
          <button className="btn-secondary" onClick={onClose}>닫기</button>
          <button className="btn" onClick={() => onBook(item)}>
            <I.Calendar size={18} strokeWidth={2} /> 이 옵션으로 주문하기
          </button>
        </div>
      </div>
    </>
  );
}

// ─── DESIGNER SHEET ─────────────────────────────────────────
function DesignerSheet({ designer, onClose, onBook }) {
  useBodyLock();
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  if (!designer) return null;
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={designer.name}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <h4>{designer.rank}</h4>
          <button className="sheet-close" onClick={onClose} aria-label="닫기"><I.Close size={18} /></button>
        </div>
        <div className="sheet-body">
          <div className="designer-hero" data-rank={designer.rank}>
            <span className="designer-hero-initial">{designer.initial}</span>
            <span className="designer-hero-en">{designer.enName}</span>
          </div>
          <div className="sheet-meta">
            <div className="designer-name-lg">{designer.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--sm-content-tertiary)", marginTop: 4, fontSize: 13 }}>
              <span>{designer.role}</span>
              <span className="dotsep">·</span>
              <span>경력 {designer.years}년</span>
            </div>
            <p className="sheet-desc">{designer.bio}</p>
            <div className="designer-tags" style={{ marginTop: 6 }}>
              {designer.specialty.map((s, i) => <span key={i} className="designer-tag">{s}</span>)}
            </div>
          </div>
        </div>
        <div className="sheet-foot">
          <button className="btn-secondary" onClick={onClose}>닫기</button>
          <button className="btn" onClick={() => onBook(designer)}>
            <I.Calendar size={18} strokeWidth={2} /> {designer.name} 디자이너에게 예약
          </button>
        </div>
      </div>
    </>
  );
}

// ─── BOOKING (꽃 예약) ───────────────────────────────────────
const FLOWER_CATEGORIES = [
  { id: "bouquet", label: "꽃다발" },
  { id: "basket",  label: "꽃바구니" },
  { id: "acrylic", label: "아크릴백" },
];
const CATEGORY_ID_MAP = { "꽃다발": "bouquet", "꽃바구니": "basket", "용돈박스": "bouquet", "아크릴백": "acrylic" };

const BOOKING_SIZES = {
  bouquet: [
    { id: "bouquet-s",       label: "꽃다발 S",       price: 35000 },
    { id: "bouquet-m",       label: "꽃다발 M",       price: 50000 },
    { id: "bouquet-l",       label: "꽃다발 L",       price: 80000 },
    { id: "bouquet-premium", label: "프리미엄 꽃다발", price: 100000 },
    { id: "bouquet-large",   label: "대형 꽃다발",     price: 150000 },
  ],
  basket: [
    { id: "basket-s",       label: "꽃바구니 S",             price: 60000 },
    { id: "basket-m",       label: "꽃바구니 M (기본/BEST)", price: 80000 },
    { id: "basket-l",       label: "꽃바구니 L",             price: 100000 },
    { id: "basket-premium", label: "프리미엄 꽃바구니",       price: 150000 },
  ],
  acrylic: [
    { id: "acrylic-real",       label: "아크릴백 (생화)", price: 130000 },
    { id: "acrylic-artificial", label: "아크릴백 (조화)", price: 90000 },
  ],
};

const FLOWER_OPTIONS = [
  { id: "bag", label: "쇼핑백", price: 1000 },
];

function BookingScreen({ initial }) {
  const [mode, setMode] = useState("pickup");
  const [form, setForm] = useState({
    category: "",
    product: "",
    color: "",
    options: [],
    request: "",
    name: "",
    contact: "",
    pickupDate: "",
    pickupTime: "",
    deliveryDate: "",
    deliveryTime: "",
    deliveryAddress: "",
    recipientName: "",
    recipientContact: "",
  });
  useEffect(() => {
    if (initial) setForm((f) => ({
      ...f,
      ...(initial.category ? { category: initial.category } : {}),
      ...(initial.product ? { product: initial.product } : {}),
    }));
  }, [initial]);

  const [toast, setToast] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [catSheetOpen, setCatSheetOpen] = useState(false);
  const [productSheetOpen, setProductSheetOpen] = useState(false);

  const isPickup = mode === "pickup";
  const catObj = FLOWER_CATEGORIES.find((c) => c.id === form.category);
  const products = form.category ? (BOOKING_SIZES[form.category] || []) : [];
  const productObj = products.find((p) => p.id === form.product);
  const optionObjs = form.options.map((id) => FLOWER_OPTIONS.find((o) => o.id === id)).filter(Boolean);
  const optionTotal = optionObjs.reduce((sum, o) => sum + o.price, 0);
  const totalPrice = (productObj?.price || 0) + optionTotal;

  const dateTimeDone = isPickup
    ? !!(form.pickupDate.trim() && form.pickupTime.trim())
    : !!(form.deliveryDate.trim() && form.deliveryTime.trim());
  const requiredChecks = isPickup
    ? [dateTimeDone, !!form.category, !!form.product, !!form.name.trim(), !!form.contact.trim()]
    : [dateTimeDone, !!form.deliveryAddress.trim(), !!form.recipientName.trim(), !!form.recipientContact.trim(), !!form.category, !!form.product, !!form.name.trim(), !!form.contact.trim()];
  const done = requiredChecks.filter(Boolean).length;
  const total = requiredChecks.length;

  const toggleOption = (id) => {
    setForm((f) => ({
      ...f,
      options: f.options.includes(id) ? f.options.filter((o) => o !== id) : [...f.options, id],
    }));
  };

  const [orderModal, setOrderModal] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const send = () => {
    if (done < total) {
      setToast("필수 항목을 모두 입력해주세요");
      setTimeout(() => setToast(null), 2200);
      return;
    }
    const lines = [
      isPickup ? "[방문수령 주문서]" : "[퀵서비스 주문서]",
      "",
    ];
    if (isPickup) {
      lines.push("픽업 일시: " + formatDateKR(form.pickupDate) + " " + form.pickupTime);
    } else {
      lines.push("배송요청 일시: " + formatDateKR(form.deliveryDate) + " " + form.deliveryTime);
      lines.push("배송지 주소: " + form.deliveryAddress);
      lines.push("수령인 성함: " + form.recipientName);
      lines.push("수령인 연락처: " + form.recipientContact);
    }
    lines.push("상품: " + productObj.label);
    lines.push("가격: " + fmt(productObj.price) + "원");
    if (form.color.trim()) lines.push("원하는 색상: " + form.color);
    if (optionObjs.length) lines.push("옵션: " + optionObjs.map((o) => `${o.label} (+${fmt(o.price)}원)`).join(", "));
    if (form.request.trim()) lines.push("요청사항: " + form.request);
    lines.push("");
    lines.push("주문자 성함: " + form.name);
    lines.push("주문자 연락처: " + form.contact);
    lines.push("");
    lines.push("최종 결제비용: " + fmt(totalPrice) + "원");
    const body = lines.join("\n");

    navigator.clipboard.writeText(body).catch(() => {});
    setCountdown(3);
    setOrderModal(true);
  };

  useEffect(() => {
    if (!orderModal) return;
    if (countdown <= 0) {
      setOrderModal(false);
      window.open(KAKAO_HREF, "_blank");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [orderModal, countdown]);

  return (
    <div>
      <div className="order-hero">
        <span className="step-pill"><I.Calendar size={12} strokeWidth={2.2} /> 꽃 주문 예약</span>
        <h2>{isPickup ? "편한 픽업 일시를" : "배송 받으실 정보를"}<br />{isPickup ? "선택해주세요" : "입력해주세요"}</h2>
        <p>예약 요청이 접수되면 카카오톡으로 확정 안내를 드려요.</p>
      </div>

      <div className="mode-toggle">
        <button className={"mode-btn " + (isPickup ? "on" : "")} onClick={() => setMode("pickup")}>방문수령</button>
        <button className={"mode-btn " + (!isPickup ? "on" : "")} onClick={() => setMode("delivery")}>퀵서비스</button>
      </div>

      <div className="progress" aria-label={`${done}/${total} 입력 완료`}>
        {Array.from({ length: total }, (_, i) => <span key={i} className={i < done ? "on" : ""} />)}
      </div>
      <div className="progress-meta">
        <span>입력 진행</span>
        <span className="num">{done}/{total}</span>
      </div>

      <div className="form">
        {/* 날짜/시간 */}
        <button type="button" className={"field selectable " + (dateTimeDone ? "done" : "")} onClick={() => setPickerOpen(true)}>
          <div className="field-label">
            <span className="lbl">1. {isPickup ? "픽업 일시" : "배송요청 일시"}</span>
            {dateTimeDone
              ? <I.Check size={16} strokeWidth={2.4} style={{ color: "var(--sm-interactive-brand-default)" }} />
              : <I.Arrow size={14} style={{ color: "var(--sm-content-tertiary)" }} />}
          </div>
          <div className={"field-val " + (!dateTimeDone ? "placeholder" : "")}>
            {dateTimeDone
              ? `${formatDateKR(isPickup ? form.pickupDate : form.deliveryDate)} · ${isPickup ? form.pickupTime : form.deliveryTime}`
              : "달력에서 날짜와 시간을 선택하세요"}
          </div>
        </button>

        {/* 퀵서비스 전용: 배송지 + 수령인 */}
        {!isPickup && (
          <>
            <div className={"field " + (form.deliveryAddress.trim() ? "done" : "")}>
              <div className="field-label">
                <span className="lbl">2. 배송지 주소</span>
                {form.deliveryAddress.trim() && <I.Check size={16} strokeWidth={2.4} style={{ color: "var(--sm-interactive-brand-default)" }} />}
              </div>
              <input type="text" value={form.deliveryAddress} placeholder="배송받으실 주소를 입력해 주세요" onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} />
            </div>

            <div className={"field " + (form.recipientName.trim() ? "done" : "")}>
              <div className="field-label">
                <span className="lbl">3. 수령인 성함</span>
                {form.recipientName.trim() && <I.Check size={16} strokeWidth={2.4} style={{ color: "var(--sm-interactive-brand-default)" }} />}
              </div>
              <input type="text" value={form.recipientName} placeholder="수령인 성함을 입력해 주세요" onChange={(e) => setForm({ ...form, recipientName: e.target.value })} />
            </div>

            <div className={"field " + (form.recipientContact.trim() ? "done" : "")}>
              <div className="field-label">
                <span className="lbl">4. 수령인 연락처</span>
                {form.recipientContact.trim() && <I.Check size={16} strokeWidth={2.4} style={{ color: "var(--sm-interactive-brand-default)" }} />}
              </div>
              <input type="tel" value={form.recipientContact} placeholder="수령인 연락처를 입력해 주세요" onChange={(e) => setForm({ ...form, recipientContact: e.target.value })} />
            </div>
          </>
        )}

        {/* 상품선택 */}
        <button type="button" className={"field selectable " + (form.category ? "done" : "")} onClick={() => setCatSheetOpen(true)}>
          <div className="field-label">
            <span className="lbl">{isPickup ? "2" : "5"}. 상품선택</span>
            {form.category
              ? <I.Check size={16} strokeWidth={2.4} style={{ color: "var(--sm-interactive-brand-default)" }} />
              : <I.Arrow size={14} style={{ color: "var(--sm-content-tertiary)" }} />}
          </div>
          <div className={"field-val " + (!catObj ? "placeholder" : "")}>
            {catObj ? catObj.label : "상품 종류를 선택해주세요"}
          </div>
        </button>

        {/* 사이즈 선택 */}
        <button type="button" className={"field selectable " + (form.product ? "done" : "")} onClick={() => { if (form.category) setProductSheetOpen(true); else { setToast("상품을 먼저 선택해주세요"); setTimeout(() => setToast(null), 2200); } }}>
          <div className="field-label">
            <span className="lbl">{isPickup ? "3" : "6"}. 사이즈 선택</span>
            {form.product
              ? <I.Check size={16} strokeWidth={2.4} style={{ color: "var(--sm-interactive-brand-default)" }} />
              : <I.Arrow size={14} style={{ color: "var(--sm-content-tertiary)" }} />}
          </div>
          <div className={"field-val " + (!productObj ? "placeholder" : "")}>
            {productObj ? `${productObj.label} · ${fmt(productObj.price)}원` : "사이즈를 선택해주세요"}
          </div>
        </button>

        {/* 원하는 색상 */}
        <div className="field">
          <div className="field-label">
            <span className="lbl">{isPickup ? "4" : "7"}. 원하는 색상 <span className="opt-mark">선택</span></span>
          </div>
          <input type="text" value={form.color} placeholder="EX) 파스텔톤, 핑크계열, 화이트 등" onChange={(e) => setForm({ ...form, color: e.target.value })} />
        </div>

        {/* 옵션 */}
        <div className="field">
          <div className="field-label">
            <span className="lbl">{isPickup ? "5" : "8"}. 옵션 <span className="opt-mark">선택</span></span>
          </div>
          <div className="checkbox-list">
            {FLOWER_OPTIONS.map((opt) => {
              const checked = form.options.includes(opt.id);
              return (
                <label key={opt.id} className={"checkbox-row " + (checked ? "on" : "")}>
                  <input type="checkbox" checked={checked} onChange={() => toggleOption(opt.id)} />
                  <span className="checkbox-mark" aria-hidden="true">
                    {checked && <I.Check size={12} strokeWidth={2.8} />}
                  </span>
                  <span className="checkbox-label">{opt.label}</span>
                  <span className="checkbox-price">+{fmt(opt.price)}원</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 요청사항 */}
        <div className="field">
          <div className="field-label">
            <span className="lbl">{isPickup ? "6" : "9"}. 요청사항 <span className="opt-mark">선택</span></span>
          </div>
          <textarea
            className="field-textarea"
            value={form.request}
            placeholder="추가 요청사항이 있으시면 적어주세요"
            onChange={(e) => setForm({ ...form, request: e.target.value })}
            rows={3}
          />
        </div>

        {/* 주문자 성함 */}
        <div className={"field " + (form.name.trim() ? "done" : "")}>
          <div className="field-label">
            <span className="lbl">{isPickup ? "7" : "10"}. 주문자 성함</span>
            {form.name.trim() && <I.Check size={16} strokeWidth={2.4} style={{ color: "var(--sm-interactive-brand-default)" }} />}
          </div>
          <input type="text" value={form.name} placeholder="주문자 성함을 입력해 주세요" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        {/* 주문자 연락처 */}
        <div className={"field " + (form.contact.trim() ? "done" : "")}>
          <div className="field-label">
            <span className="lbl">{isPickup ? "8" : "11"}. 주문자 연락처</span>
            {form.contact.trim() && <I.Check size={16} strokeWidth={2.4} style={{ color: "var(--sm-interactive-brand-default)" }} />}
          </div>
          <input type="tel" value={form.contact} placeholder="연락처를 입력해 주세요" onChange={(e) => setForm({ ...form, contact: e.target.value })} />
        </div>
      </div>

      {totalPrice > 0 && (
        <div className="price-summary">
          <div className="price-summary-row">
            <span className="price-summary-label">예상 합계</span>
            <span className="price-summary-value">{fmt(totalPrice)}<span className="won">원</span></span>
          </div>
          <div className="price-summary-meta">
            {productObj ? productObj.label : ""}{optionObjs.length ? ` + 옵션 ${optionObjs.length}개` : ""}
          </div>
        </div>
      )}

      <div className="notice">
        <h5>NOTICE</h5>
        <h6>예약 시 확인해주세요</h6>
        <ul>
          <li>특정 꽃을 원하시면 2~3일 전에 예약해주세요.</li>
          <li>당일 주문은 매장 보유 꽃으로 제작됩니다.</li>
          <li>자연 소재 특성상 100% 동일 제작은 어렵습니다.</li>
          <li>퀵서비스 비용은 별도이며, 배송 지역에 따라 상이합니다.</li>
        </ul>
      </div>

      <div className="dock">
        <button className="btn" onClick={send}>
          <I.Chat size={18} strokeWidth={2} /> 예약 요청 보내기
        </button>
        <div className="dock-sub">
          또는 <a href={KAKAO_HREF} target="_blank" rel="noreferrer">카톡으로 바로 문의하기</a>
        </div>
      </div>

      {toast && <div className="toast"><I.Check size={16} strokeWidth={2.4} /> {toast}</div>}

      {orderModal && (
        <>
          <div className="scrim" />
          <div className="order-modal">
            <div className="order-modal-icon"><I.Check size={32} strokeWidth={2.4} /></div>
            <h3>성공적으로 주문서가 복사되었어요</h3>
            <p><strong>{countdown}초</strong> 후 카카오톡으로 연결되며,<br />그대로 붙여넣기 해주시면 됩니다!</p>
          </div>
        </>
      )}

      {pickerOpen && (
        <DateTimePicker
          initialDate={isPickup ? form.pickupDate : form.deliveryDate}
          initialTime={isPickup ? form.pickupTime : form.deliveryTime}
          onClose={() => setPickerOpen(false)}
          onConfirm={({ date, time }) => {
            if (isPickup) setForm((f) => ({ ...f, pickupDate: date, pickupTime: time }));
            else setForm((f) => ({ ...f, deliveryDate: date, deliveryTime: time }));
            setPickerOpen(false);
          }}
        />
      )}
      {catSheetOpen && (
        <OptionSheet
          title="상품 선택"
          options={FLOWER_CATEGORIES}
          value={form.category}
          renderRow={(c) => <span className="option-label">{c.label}</span>}
          onClose={() => setCatSheetOpen(false)}
          onPick={(opt) => { setForm((f) => ({ ...f, category: opt.id, product: "" })); setCatSheetOpen(false); }}
        />
      )}
      {productSheetOpen && (
        <OptionSheet
          title="사이즈 선택"
          options={products}
          value={form.product}
          renderRow={(p) => (
            <>
              <span className="option-label">{p.label}</span>
              <span className="option-price">{fmt(p.price)}<span className="won">원</span></span>
            </>
          )}
          onClose={() => setProductSheetOpen(false)}
          onPick={(opt) => { setForm((f) => ({ ...f, product: opt.id })); setProductSheetOpen(false); }}
        />
      )}
    </div>
  );
}

// ─── Option Sheet (custom dropdown) ─────────────────────────
function OptionSheet({ title, options, value, renderRow, onClose, onPick }) {
  useBodyLock();
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <h4>{title}</h4>
          <button className="sheet-close" onClick={onClose} aria-label="닫기"><I.Close size={18} /></button>
        </div>
        <div className="sheet-body option-sheet-body">
          <ul className="option-list">
            {options.map((opt) => {
              const selected = opt.id === value;
              return (
                <li key={opt.id}>
                  <button
                    type="button"
                    className={"option-row " + (selected ? "on" : "")}
                    onClick={() => onPick(opt)}
                  >
                    <span className="option-row-text">
                      {renderRow ? renderRow(opt) : <span className="option-label">{opt.label}</span>}
                    </span>
                    {selected && (
                      <span className="option-check" aria-hidden="true">
                        <I.Check size={16} strokeWidth={2.6} />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

// ─── DateTime Picker ────────────────────────────────────────
function DateTimePicker({ initialDate, initialTime, onClose, onConfirm }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [view, setView] = useState(() => {
    const d = initialDate ? new Date(initialDate) : today;
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [date, setDate] = useState(initialDate || "");
  const [time, setTime] = useState(initialTime || "");

  useBodyLock();
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0 (Sun) … 6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday   = (d) => d && d.getTime() === today.getTime();
  const isPast    = (d) => d && d < today;
  const isPicked  = (d) => d && fmtDate(d) === date;
  const dow = (d) => d.getDay();

  // 일요일 휴무 + 운영시간 외 비활성화
  const isClosed  = (d) => d && dow(d) === 0;

  const TIMES = [];
  for (let h = 11; h < 19; h++) {
    TIMES.push(`${String(h).padStart(2, "0")}:00`);
    TIMES.push(`${String(h).padStart(2, "0")}:30`);
  }

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet sheet-tall" role="dialog" aria-modal="true">
        <div className="sheet-handle" />
        <div className="sheet-head"><h4>날짜·시간 선택</h4>
          <button className="sheet-close" onClick={onClose} aria-label="닫기"><I.Close size={18} /></button>
        </div>
        <div className="sheet-body" style={{ paddingBottom: 8 }}>
          <div className="cal-head">
            <button className="cal-nav" onClick={() => setView(new Date(year, month - 1, 1))} aria-label="이전 달"><I.ChevL size={18} /></button>
            <div className="cal-title">{year}.{String(month + 1).padStart(2, "0")}</div>
            <button className="cal-nav" onClick={() => setView(new Date(year, month + 1, 1))} aria-label="다음 달"><I.ChevR size={18} /></button>
          </div>
          <div className="cal-grid cal-dow">
            {["일","월","화","수","목","금","토"].map((d, i) => (
              <span key={d} className={"cal-dow-lbl " + (i === 0 ? "sun" : i === 4 ? "off" : i === 6 ? "sat" : "")}>{d}</span>
            ))}
          </div>
          <div className="cal-grid">
            {cells.map((d, i) => {
              if (!d) return <span key={i} className="cal-cell empty" />;
              const past = isPast(d);
              const closed = isClosed(d);
              const disabled = past || closed;
              const sel = isPicked(d);
              return (
                <button
                  key={i}
                  className={"cal-cell " + (sel ? "sel " : "") + (disabled ? "disabled " : "") + (isToday(d) && !sel ? "today " : "")}
                  data-dow={dow(d)}
                  onClick={() => { if (!disabled) setDate(fmtDate(d)); }}
                  disabled={disabled}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          <div className="cal-section">
            <div className="cal-section-title">시간 선택</div>
            <div className="time-grid">
              {TIMES.map((t) => (
                <button key={t} className={"time-cell " + (t === time ? "sel" : "")} onClick={() => setTime(t)}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="sheet-foot">
          <button className="btn-secondary" onClick={onClose}>취소</button>
          <button className="btn" disabled={!date || !time} onClick={() => onConfirm({ date, time })}>
            선택 완료
          </button>
        </div>
      </div>
    </>
  );
}

// ─── FAQ ────────────────────────────────────────────────────
function FaqScreen() {
  const [activeCat, setActiveCat] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [query, setQuery] = useState("");

  const cats = [{ id: "all", label: "전체" }, ...FAQ_CATEGORIES];
  const filtered = FAQ_ITEMS.filter((it) => {
    if (activeCat !== "all" && it.cat !== activeCat) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q);
    }
    return true;
  });
  const catLabel = (id) => FAQ_CATEGORIES.find((c) => c.id === id)?.label || "";

  return (
    <div>
      <div className="faq-hero">
        <span className="step-pill"><I.Help size={12} strokeWidth={2.2} /> 자주 묻는 질문</span>
        <h2>궁금한 점을 빠르게 찾아드려요</h2>
        <p>꽃 주문 시 고객님들이 자주 하시는 질문에 대한 답변을 모아두었어요. 해당 질문/답변 외에 궁금한 것은 카카오톡으로 문의주세요!</p>
        <div className="faq-search">
          <I.Search size={18} strokeWidth={2} />
          <input type="text" placeholder="질문 검색하기" value={query} onChange={(e) => setQuery(e.target.value)} />
          {query && (
            <button className="faq-clear" onClick={() => setQuery("")} aria-label="검색어 지우기">
              <I.Close size={14} strokeWidth={2.4} />
            </button>
          )}
        </div>
      </div>
      <div className="faq-tabs">
        {cats.map((c) => (
          <button key={c.id} className={"faq-tab " + (c.id === activeCat ? "on" : "")} onClick={() => setActiveCat(c.id)}>{c.label}</button>
        ))}
      </div>
      <div className="accordion faq-list" data-mode="single">
        {filtered.length === 0 ? (
          <div className="faq-empty">
            <I.Search size={28} strokeWidth={1.5} />
            <h4>검색 결과가 없어요</h4>
            <p>다른 키워드로 검색해주세요.</p>
          </div>
        ) : filtered.map((it, i) => {
          const id = `${it.cat}-${i}`;
          const isOpen = openId === id;
          return (
            <AccordionItem key={id} item={it} id={"faq-" + id} open={isOpen} onToggle={() => setOpenId(isOpen ? null : id)} />
          );
        })}
      </div>
      <div className="faq-foot">
        <h4>여전히 궁금한 점이 있으신가요?</h4>
        <p>카카오톡으로 문의주시면 빠르게 답변드려요.</p>
        <div className="footer-row">
          <a href={KAKAO_HREF} target="_blank" rel="noreferrer" className="btn btn-kakao">카톡 문의 <I.Send size={18} /></a>
        </div>
      </div>
    </div>
  );
}

// ─── Utilities (dates) ──────────────────────────────────────
function fmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function formatDateKR(s) {
  if (!s) return "";
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const dow = ["일","월","화","수","목","금","토"][dt.getDay()];
  return `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")} (${dow})`;
}

// ─── App root ────────────────────────────────────────────────
function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "brand": "#EAB308",
    "dark": false
  }/*EDITMODE-END*/;
  const [t, setTweak] = (window.useTweaks ? window.useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}]);

  useEffect(() => {
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
  }, [t.dark]);

  const [route, setRoute] = useState(() => {
    const h = (location.hash || "").replace("#", "");
    if (h.startsWith("styles") || h === "booking" || h === "faq") return h;
    return "home";
  });
  const [activeCat, setActiveCat] = useState("best");
  const [styleSheet, setStyleSheet] = useState(null);
  const [designerSheet, setDesignerSheet] = useState(null);
  const [bookingSeed, setBookingSeed] = useState(null);

  // styles:catId 경로 지원
  const styleCat = route.startsWith("styles") ? (route.split(":")[1] || activeCat) : activeCat;
  useEffect(() => { if (route.startsWith("styles") && route.includes(":")) setActiveCat(route.split(":")[1]); }, [route]);

  const go = (r) => {
    setRoute(r);
    location.hash = r === "home" ? "" : r;
    window.scrollTo(0, 0);
  };

  const bookStyle = (it) => {
    setBookingSeed({
      category: CATEGORY_ID_MAP[it.categoryName] || "",
      product: "",
    });
    setStyleSheet(null);
    go("booking");
  };
  const bookDesigner = (d) => {
    setDesignerSheet(null);
    go("booking");
  };

  const scrolled = useScrolled();
  useEffect(() => { window.scrollTo(0, 0); }, [route]);

  let title = null;
  let onBack = null;
  if (route.startsWith("styles")) { title = "디자인 둘러보기"; onBack = () => go("home"); }
  if (route === "booking")        { title = "예약요청"; onBack = () => go("home"); }
  if (route === "faq")            { title = "질문/답변"; onBack = () => go("home"); }

  const mainRoute = route.split(":")[0];

  return (
    <div className="app">
      <div className="app-frame">
        <AppBar
          title={title}
          onBack={onBack}
          scrolled={scrolled}
          dark={!!t.dark}
          onToggleTheme={() => setTweak("dark", !t.dark)}
        />
        <div className="appbar-spacer" />
        {mainRoute === "home"    && <HomeScreen go={go} openStyle={setStyleSheet} openDesigner={setDesignerSheet} />}
        {mainRoute === "styles"  && <StylesScreen activeCat={styleCat} setActiveCat={setActiveCat} onPick={setStyleSheet} />}
        {mainRoute === "booking" && <BookingScreen initial={bookingSeed} />}
        {mainRoute === "faq"     && <FaqScreen />}
        {styleSheet && <StyleSheet item={styleSheet} onClose={() => setStyleSheet(null)} onBook={bookStyle} />}
        {designerSheet && <DesignerSheet designer={designerSheet} onClose={() => setDesignerSheet(null)} onBook={bookDesigner} />}
      </div>
      <BottomNav route={mainRoute} go={go} />
      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection title="Theme">
            <window.TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak("dark", v)} />
          </window.TweakSection>
          <window.TweakSection title="Quick actions">
            <window.TweakButton onClick={() => go("home")}>Home</window.TweakButton>
            <window.TweakButton onClick={() => go("styles")}>Styles</window.TweakButton>
            <window.TweakButton onClick={() => go("booking")}>Booking</window.TweakButton>
            <window.TweakButton onClick={() => go("faq")}>FAQ</window.TweakButton>
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
