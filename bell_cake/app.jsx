/* eslint-disable */
const { useState, useEffect, useRef, useMemo } = React;

const KAKAO_HREF = "https://pf.kakao.com/_txnxncb";

// ─── Utilities ──────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("ko-KR");

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

document.addEventListener("load", (e) => {
  if (e.target.tagName === "IMG") e.target.classList.add("loaded");
}, true);

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

// ─── Home FAQ item ──────────────────────────────────────────
function HomeFaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={"home-faq-item " + (open ? "open" : "")}>
      <button className="home-faq-q" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="home-faq-q-badge">Q</span>
        <span className="home-faq-q-text">{item.q}</span>
        <span className="home-faq-caret" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {open && <div className="home-faq-a acc-panel">{item.a}</div>}
    </li>
  );
}

// ─── App bar ────────────────────────────────────────────────
function AppBar({ title, onBack, scrolled, dark, onToggleTheme }) {
  return (
    <div className={"appbar " + (scrolled ? "shadow" : "")}>
      {onBack && (
        <button className="iconbtn" onClick={onBack} aria-label="뒤로 가기"><I.Back /></button>
      )}
      <div className="pagetitle">{title || "쌀케이크 전문점 벨케이크"}</div>
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
    title: "벨케이크",
    text: "세상에 단 하나뿐인 레터링케이크, 벨케이크 — 정성스러운 디자인과 좋은 재료로 완벽한 하루를 완성합니다.",
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
    { id: "styles",   label: "디자인",   icon: I.Cake },
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
  // 어드민(easysite admin) 에서 발행된 HOME_SECTIONS / FAQS 우선 사용. 비어 있으면 폴백.
  const HS = window.HOME_SECTIONS || [];
  const hero = (HS.find((s) => s && s.type === "hero") || {}).data || {};
  const sliderSections = HS.filter((s) => s && s.type === "slider").map((s) => s.data || {});
  const faqHome = (HS.find((s) => s && s.type === "faq") || {}).data || {};

  // `url("…")` (구버전 발행) 와 raw path 둘 다 안전 처리
  const unwrapUrl = (v) => {
    if (!v) return null;
    const m = String(v).match(/^url\(["']?([^"')]+)["']?\)$/);
    return m ? m[1] : v;
  };
  const heroImage = unwrapUrl(hero.image) || "img/hero.jpg";
  const region = hero.region || "대구광역시 | 수성구";
  const storeName = hero.storeName || "벨케이크";
  const storeDesc = hero.storeDesc || "No 밀가루, No 식물성크림. 100% 국내산 쌀가루로 만든 쌀케이크, 동물성 생크림케이크 전문점 벨케이크입니다:)\n\n1인운영매장이라, 전화를 못받을 수 있으니 부재시 카카오톡채널로 연락주세요^^";
  const mapImage = unwrapUrl(hero.mapImage) || "img/map.png";
  const mapAddress = hero.mapAddress || "대구 수성구 범어로20길 68";
  const address = hero.address || "대구 수성구 범어로20길 68 1층 왼쪽상가";
  const hours = hero.hours || "11:00 ~ 19:00 · 매주 일요일 휴무";
  const bannerText = hero.bannerText || "예약요청 탭을 통해 간편히 예약을 요청해보세요!";

  const allProducts = [].concat(...Object.values(window.HAIR_STYLES || {}));
  const productById = {};
  allProducts.forEach((p) => {
    if (p && p.productId) productById[p.productId] = p;
    if (p && p.id) productById[p.id] = p;
  });
  const resolvedSliders = sliderSections.length > 0
    ? sliderSections.map((s) => ({
        title: s.title || "",
        list: (s.pickedIds || []).map((id) => productById[id]).filter(Boolean),
      })).filter((s) => s.list.length > 0)
    : [
        { title: "귀여운 도시락케이크", list: FEATURED_STYLES },
        { title: "이달의 베스트 케이크", list: BUSINESS_STYLES },
        { title: "여심저격 베스트 디자인", list: MZ_STYLES },
        { title: "부모님 베스트픽 디자인", list: STARTER_STYLES },
      ];

  const allFaqs = (window.FAQS && window.FAQS.length > 0) ? window.FAQS : (window.FAQ_ITEMS || []);
  const homeFaqItems = (faqHome.pickedIds && faqHome.pickedIds.length > 0 && window.FAQS)
    ? faqHome.pickedIds.map((id) => window.FAQS.find((f) => f.id === id)).filter(Boolean)
    : allFaqs.slice(0, 6);
  const homeFaqTitle = faqHome.title || "주문 전 자주하는 질문";

  return (
    <div>
      <section className="hero" aria-label={storeName}>
        <div className="hero-img">
          <img src={heroImage} alt={`${storeName} 매장`} />
        </div>
      </section>

      <section className="intro">
        <div className="intro-meta">{region}</div>
        <h2 className="intro-name">{storeName}</h2>
        <p className="intro-desc">{storeDesc}</p>

        <div className="intro-map" aria-label="매장 위치 지도">
          <img src={mapImage} alt={`${storeName} 매장 위치`} className="intro-map-img" />
          <a className="intro-map-cta" href={`https://map.naver.com/p/search/${encodeURIComponent(mapAddress)}`} target="_blank" rel="noreferrer" aria-label="네이버 지도에서 열기">
            <img src="img/naver_map.png" alt="" className="naver-map-icon" /> 네이버 지도
          </a>
        </div>

        <ul className="intro-list">
          <li>
            <span className="intro-list-icon"><I.Map size={18} /></span>
            <span className="intro-list-text">{address}</span>
          </li>
          <li>
            <span className="intro-list-icon"><I.Calendar size={18} /></span>
            <span className="intro-list-text">
              {hours}
              <span className="intro-open-status" data-open={isOpenNow()}>
                {isOpenNow() ? "현재 영업 중" : "현재 영업 종료"}
              </span>
            </span>
          </li>
        </ul>
      </section>

      <FadeIn>
        <div className="info-banner">
          <span className="info-banner-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8h.01M11 12h1v5h1" />
            </svg>
          </span>
          <p className="info-banner-text">{bannerText}</p>
        </div>
      </FadeIn>

      {resolvedSliders.map((s, i) => (
        <FadeIn key={i} delay={i * 60}><FeaturedSlider title={s.title} list={s.list} openStyle={openStyle} /></FadeIn>
      ))}

      <FadeIn>
        <section className="section home-faq-section">
          <div className="section-head">
            <h3>{homeFaqTitle}</h3>
          </div>
          <ul className="home-faq-list">
            {homeFaqItems.map((it, i) => (
              <HomeFaqItem key={i} item={it} />
            ))}
          </ul>
          <button className="home-faq-more" type="button" onClick={() => go("faq")}>
            전체 질문 보기 <I.Arrow size={14} />
          </button>
        </section>
      </FadeIn>

      <FadeIn><div className="footer footer-cta">
        <a href="https://www.instagram.com/parkhaddd/" target="_blank" rel="noreferrer" className="btn-secondary">
          <I.Insta size={18} /> 인스타그램 둘러보기
        </a>
        <a href={KAKAO_HREF} target="_blank" rel="noreferrer" className="btn btn-kakao">
          카톡 문의 <I.Send size={18} />
        </a>
      </div></FadeIn>
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

      <div className="styles-head">
        <div className="styles-sub">{cat.sub}</div>
        <h2>{cat.blurb}</h2>
      </div>

      <div className="styles-grid">
        {list.map((s, i) => (
          <button className="style-card anim-stagger" key={i} style={{ animationDelay: (i * 60) + "ms" }} onClick={() => onPick({ ...s, category: cat.name, categoryId: cat.id })}>
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

// ─── BOOKING (케이크 예약) ───────────────────────────────────
const CAKE_SIZES = [
  { id: "type-dosirak", label: "도시락케이크 (9cm)",            price: 17000 },
  { id: "type-mini",    label: "미니케이크 (12cm, 1~2인)",      price: 30000 },
  { id: "type-1",       label: "1호 케이크 (16cm, 3~5인)",      price: 40000 },
  { id: "type-2",       label: "2호 케이크 (18cm, 6~8인)",      price: 50000 },
  { id: "type-3",       label: "3호 케이크 (21cm, 7~10인)",     price: 60000 },
];
const CAKE_FLAVORS = [
  { id: "vanilla-milk",      label: "바닐라 쌀시트 + 우유크림",                surcharge: 0 },
  { id: "vanilla-lemon",     label: "바닐라 쌀시트 + 레몬커스터드",            surcharge: 2000 },
  { id: "vanilla-blueberry", label: "바닐라 쌀시트 + 블루베리잼",              surcharge: 3000 },
  { id: "choco-oreo",        label: "초코 쌀시트 + 오레오쿠키 + 오레오크림",   surcharge: 3000 },
  { id: "choco-choco",       label: "초코 쌀시트 + 초코크림",                  surcharge: 3000 },
  { id: "mugwort",           label: "쑥 시트 + 쑥크림",                        surcharge: 3000 },
];
const CAKE_OPTIONS = [
  { id: "case",    label: "1단 투명케이스",     price: 5000 },
  { id: "bag-ice", label: "보냉백 + 아이스팩",  price: 6000 },
  { id: "bag-12",  label: "보냉가방 1~2호",      price: 7500 },
  { id: "bag-3",   label: "보냉가방 3호",         price: 8500 },
];

function BookingScreen({ initial }) {
  const [form, setForm] = useState({
    pickupDate: "",
    pickupTime: "",
    size: initial?.size || "",
    flavor: initial?.flavor || "",
    design: initial?.design || "",
    boardText: "",
    options: [],
    name: "",
    contact: "",
  });
  useEffect(() => {
    if (initial) setForm((f) => ({
      ...f,
      ...(initial.design ? { design: initial.design } : {}),
      ...(initial.size ? { size: initial.size } : {}),
      ...(initial.flavor ? { flavor: initial.flavor } : {}),
    }));
  }, [initial]);

  const [toast, setToast] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sizeSheetOpen, setSizeSheetOpen] = useState(false);
  const [flavorSheetOpen, setFlavorSheetOpen] = useState(false);

  const pickupDone = form.pickupDate.trim() && form.pickupTime.trim();
  const requiredKeys = ["size", "flavor", "name", "contact"];
  const done = (pickupDone ? 1 : 0) + requiredKeys.filter((k) => (form[k] || "").trim().length > 0).length;
  const total = requiredKeys.length + 1;

  const sizeObj = CAKE_SIZES.find((s) => s.id === form.size);
  const flavorObj = CAKE_FLAVORS.find((f) => f.id === form.flavor);
  const optionObjs = form.options.map((id) => CAKE_OPTIONS.find((o) => o.id === id)).filter(Boolean);
  const optionTotal = optionObjs.reduce((sum, o) => sum + o.price, 0);
  const totalPrice = (sizeObj?.price || 0) + (flavorObj?.surcharge || 0) + optionTotal;

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
    const body = [
      "[주문서 작성]",
      "",
      "픽업 일시: " + formatDateKR(form.pickupDate) + " " + form.pickupTime,
      "케이크 종류: " + sizeObj.label,
      "맛: " + flavorObj.label + (flavorObj.surcharge > 0 ? ` (+${fmt(flavorObj.surcharge)}원)` : ""),
      optionObjs.length ? "옵션: " + optionObjs.map((o) => `${o.label} (+${fmt(o.price)}원)`).join(", ") : "",
      form.design ? "디자인 설명: " + form.design : "",
      form.boardText ? "케이크 판 문구: " + form.boardText : "",
      "",
      "예약자 성함: " + form.name,
      "연락처: " + form.contact,
      "",
      "최종 결제비용: " + fmt(totalPrice) + "원",
    ].filter(Boolean).join("\n");

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
        <span className="step-pill"><I.Calendar size={12} strokeWidth={2.2} /> 케이크 예약</span>
        <h2>편한 픽업 일시를<br />선택해주세요</h2>
        <p>예약 요청이 접수되면 카카오톡으로 확정 안내를 드려요.</p>
      </div>

      <div className="progress" aria-label={`${done}/${total} 입력 완료`}>
        {Array.from({ length: total }, (_, i) => <span key={i} className={i < done ? "on" : ""} />)}
      </div>
      <div className="progress-meta">
        <span>입력 진행</span>
        <span className="num">{done}/{total}</span>
      </div>

      <div className="form">
        {/* 1. 픽업 일시 */}
        <button type="button" className={"field selectable " + (form.pickupDate && form.pickupTime ? "done" : "")} onClick={() => setPickerOpen(true)}>
          <div className="field-label">
            <span className="lbl">1. 픽업 일시</span>
            {(form.pickupDate && form.pickupTime)
              ? <I.Check size={16} strokeWidth={2.4} style={{ color: "var(--sm-interactive-brand-default)" }} />
              : <I.Arrow size={14} style={{ color: "var(--sm-content-tertiary)" }} />}
          </div>
          <div className={"field-val " + (!(form.pickupDate && form.pickupTime) ? "placeholder" : "")}>
            {form.pickupDate && form.pickupTime
              ? `${formatDateKR(form.pickupDate)} · ${form.pickupTime}`
              : "달력에서 픽업 날짜와 시간을 선택하세요"}
          </div>
        </button>

        {/* 2. 케이크 종류 */}
        <button type="button" className={"field selectable " + (form.size ? "done" : "")} onClick={() => setSizeSheetOpen(true)}>
          <div className="field-label">
            <span className="lbl">2. 케이크 종류</span>
            {form.size
              ? <I.Check size={16} strokeWidth={2.4} style={{ color: "var(--sm-interactive-brand-default)" }} />
              : <I.Arrow size={14} style={{ color: "var(--sm-content-tertiary)" }} />}
          </div>
          <div className={"field-val " + (!sizeObj ? "placeholder" : "")}>
            {sizeObj ? `${sizeObj.label} · ${fmt(sizeObj.price)}원~` : "종류를 선택해주세요"}
          </div>
        </button>

        {/* 3. 맛 */}
        <button type="button" className={"field selectable " + (form.flavor ? "done" : "")} onClick={() => setFlavorSheetOpen(true)}>
          <div className="field-label">
            <span className="lbl">3. 케이크 맛</span>
            {form.flavor
              ? <I.Check size={16} strokeWidth={2.4} style={{ color: "var(--sm-interactive-brand-default)" }} />
              : <I.Arrow size={14} style={{ color: "var(--sm-content-tertiary)" }} />}
          </div>
          <div className={"field-val " + (!flavorObj ? "placeholder" : "")}>
            {flavorObj
              ? `${flavorObj.label}${flavorObj.surcharge > 0 ? ` (+${fmt(flavorObj.surcharge)}원)` : ""}`
              : "맛을 선택해주세요"}
          </div>
        </button>

        {/* 4. 디자인 설명 (선택) */}
        <div className="field">
          <div className="field-label">
            <span className="lbl">4. 케이크 디자인 설명 <span className="opt-mark">선택</span></span>
          </div>
          <textarea
            className="field-textarea"
            value={form.design}
            placeholder="EX) 파스텔톤으로 부드럽게, 꽃 장식 포인트로 부탁드려요"
            onChange={(e) => setForm({ ...form, design: e.target.value })}
            rows={3}
          />
        </div>

        {/* 5. 판 문구 (선택) */}
        <div className="field">
          <div className="field-label">
            <span className="lbl">5. 케이크 판 문구 <span className="opt-mark">선택</span></span>
          </div>
          <input type="text" value={form.boardText} placeholder="EX) Happy Birthday 윤서" onChange={(e) => setForm({ ...form, boardText: e.target.value })} />
        </div>

        {/* 6. 옵션 (선택, 중복) */}
        <div className="field">
          <div className="field-label">
            <span className="lbl">6. 옵션 <span className="opt-mark">선택 · 중복 가능</span></span>
          </div>
          <div className="checkbox-list">
            {CAKE_OPTIONS.map((opt) => {
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

        {/* 7. 이름 */}
        <div className={"field " + (form.name.trim() ? "done" : "")}>
          <div className="field-label">
            <span className="lbl">7. 예약자 성함</span>
            {form.name.trim() && <I.Check size={16} strokeWidth={2.4} style={{ color: "var(--sm-interactive-brand-default)" }} />}
          </div>
          <input type="text" value={form.name} placeholder="성함을 입력해 주세요" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        {/* 8. 연락처 */}
        <div className={"field " + (form.contact.trim() ? "done" : "")}>
          <div className="field-label">
            <span className="lbl">8. 예약자 연락처</span>
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
            {sizeObj ? sizeObj.label : ""}{optionObjs.length ? ` + 옵션 ${optionObjs.length}개` : ""}
          </div>
        </div>
      )}

      <div className="notice">
        <h5>NOTICE</h5>
        <h6>예약 시 확인해주세요</h6>
        <ul>
          <li>케이크 제작은 픽업 3일 전까지 예약해주세요.</li>
          <li>디자인 협의 후 예약금 50%를 선입금받습니다.</li>
          <li>당일 픽업 변경·취소는 어려워요.</li>
          <li>잔금은 픽업 시 매장에서 결제하시면 돼요.</li>
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
          initialDate={form.pickupDate}
          initialTime={form.pickupTime}
          onClose={() => setPickerOpen(false)}
          onConfirm={({ date, time }) => { setForm((f) => ({ ...f, pickupDate: date, pickupTime: time })); setPickerOpen(false); }}
        />
      )}
      {sizeSheetOpen && (
        <OptionSheet
          title="케이크 종류 선택"
          options={CAKE_SIZES}
          value={form.size}
          renderRow={(s) => (
            <>
              <span className="option-label">{s.label}</span>
              <span className="option-price">{fmt(s.price)}<span className="won">원~</span></span>
            </>
          )}
          onClose={() => setSizeSheetOpen(false)}
          onPick={(opt) => { setForm((f) => ({ ...f, size: opt.id })); setSizeSheetOpen(false); }}
        />
      )}
      {flavorSheetOpen && (
        <OptionSheet
          title="케이크 맛 선택"
          options={CAKE_FLAVORS}
          value={form.flavor}
          renderRow={(f) => (
            <>
              <span className="option-label">{f.label}</span>
              {f.surcharge > 0 && (
                <span className="option-price">+{fmt(f.surcharge)}<span className="won">원</span></span>
              )}
            </>
          )}
          onClose={() => setFlavorSheetOpen(false)}
          onPick={(opt) => { setForm((f) => ({ ...f, flavor: opt.id })); setFlavorSheetOpen(false); }}
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

  const FAQS_LIVE = (window.FAQS && window.FAQS.length > 0) ? window.FAQS : (window.FAQ_ITEMS || []);
  const cats = [{ id: "all", label: "전체" }, ...FAQ_CATEGORIES];
  const filtered = FAQS_LIVE.filter((it) => {
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
        <p>케이크 주문 시 고객님들이 자주 하시는 질문에 대한 답변을 모아두었어요. 해당 질문/답변 외에 궁금한 것은 카카오톡으로 문의주세요!</p>
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
      <div className="faq-list">
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
            <li key={id} className={"home-faq-item " + (isOpen ? "open" : "")}>
              <button className="home-faq-q" onClick={() => setOpenId(isOpen ? null : id)} aria-expanded={isOpen}>
                <span className="home-faq-q-badge">Q</span>
                <span className="home-faq-q-text">{it.q}</span>
                <span className="home-faq-caret" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
              {isOpen && <div className="home-faq-a acc-panel">{it.a}</div>}
            </li>
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
      design: it.sizeId ? it.name : `${it.category} · ${it.name}`,
      size: it.sizeId || "",
      flavor: it.flavorId || "",
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
