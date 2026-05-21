/* eslint-disable */
const { useState, useEffect, useRef, useMemo } = React;

const PHONE = "010-0000-0000";
const PHONE_HREF = "tel:01000000000";
const SMS_HREF = "sms:01000000000";

// ─── Utilities ──────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("ko-KR");
const fmtDuration = (m) => {
  if (!m && m !== 0) return "";
  if (m < 60) return `${m}분 소요 예상`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h}시간 소요 예상` : `${h}시간 ${r}분 소요 예상`;
};

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
  if (day === 4) return false; // 매주 목요일 휴무
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= 10 * 60 && mins < 20 * 60;
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
                <div className="feat-headline">{s.works || s.name}</div>
                <div className="feat-duration">{fmtDuration(s.time)}</div>
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
        <span className="home-faq-q-text">{item.q}</span>
        <span className="home-faq-caret" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {open && <div className="home-faq-a">{item.a}</div>}
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
      <div className="pagetitle">{title || "박하디 헤어샵"}</div>
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
      <a className="iconbtn" href={PHONE_HREF} aria-label="전화 걸기"><I.Phone /></a>
      <button className="iconbtn" onClick={shareSite} aria-label="공유하기"><I.Share /></button>
    </div>
  );
}

async function shareSite() {
  const data = {
    title: "PARKHAD",
    text: "남성 전용 헤어샵 PARKHAD — 편안한 환경, 유쾌한 경험.",
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
    { id: "styles",   label: "스타일",   icon: I.Style },
    { id: "styling",  label: "스타일링", icon: I.Sparkle },
    { id: "faq",     label: "질문/답변", icon: I.Faq },
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
  // 어드민에서 발행된 HOME_SECTIONS / FAQS 우선 사용. 비어 있으면 폴백.
  // 어드민 미리보기는 postMessage 로 draft 데이터를 전송 — setDraftHS 가 우선.
  const [draftHS, setDraftHS] = React.useState(null);
  React.useEffect(() => {
    const handler = (e) => {
      const d = e && e.data;
      if (d && d.type === "draftHomeSections" && Array.isArray(d.sections)) {
        setDraftHS(d.sections);
      }
    };
    window.addEventListener("message", handler);
    if (window.parent && window.parent !== window) {
      try { window.parent.postMessage({ type: "previewReady" }, "*"); } catch (_) {}
    }
    return () => window.removeEventListener("message", handler);
  }, []);

  const HS = draftHS || window.HOME_SECTIONS || [];
  const hero = (HS.find((s) => s && s.type === "hero") || {}).data || {};
  const sliderSections = HS.filter((s) => s && s.type === "slider").map((s) => s.data || {});
  const faqHome = (HS.find((s) => s && s.type === "faq") || {}).data || {};

  const unwrapUrl = (v) => {
    if (!v) return null;
    const m = String(v).match(/^url\(["']?([^"')]+)["']?\)$/);
    return m ? m[1] : v;
  };
  const heroImage = unwrapUrl(hero.image) || "img/hero.jpg";
  const region = hero.region || "대구광역시 | 달서구";
  const storeName = hero.storeName || "PARKHAD";
  const storeDesc = hero.storeDesc || "남자들에게 미용실은 '가기 귀찮은 곳'인 경우가 많죠. 고객님 한 분 한 분께 편안한 환경과 유쾌한 경험을 제공하여, '다음 만남이 기다려지는 곳'이 될 수 있도록 하겠습니다.";
  const mapImage = unwrapUrl(hero.mapImage) || "img/map.png";
  const mapAddress = hero.mapAddress || "대구 달서구 와룡로 132 박하디";
  const address = hero.address || "대구 달서구 와룡로 132 2층 PARKHAD 박하디";
  const hours = hero.hours || "10:00 ~ 20:00 · 매주 목요일 휴무";
  const bannerText = hero.bannerText || "전화 또는 네이버 예약으로 간편예약이 가능해요!";

  const allProducts = [].concat(...Object.values(window.HAIR_STYLES || {}));
  const productById = {};
  allProducts.forEach((p) => {
    if (p && p.productId) productById[p.productId] = p;
    if (p && p.id) productById[p.id] = p;
  });
  const legacySliders = [
    { title: "교동 감성 스타일링", meta: "시즌 추천", list: FEATURED_STYLES },
    { title: "면접·미팅을 준비한다면", meta: "단정하고 깔끔하게", list: BUSINESS_STYLES },
    { title: "요즘 20대 스타일링", meta: "MZ 스타일", list: MZ_STYLES },
    { title: "젊어보이는 마법을", meta: "30대 이상 추천", list: STARTER_STYLES },
  ];
  const adminSliders = sliderSections.map((s, i) => {
    const picked = (s.pickedIds || []).map((id) => productById[id]).filter(Boolean);
    const fallback = (legacySliders[i] && legacySliders[i].list) || (legacySliders[0] && legacySliders[0].list) || [];
    return {
      title: s.title || (legacySliders[i] && legacySliders[i].title) || "",
      meta: s.subtitle || (legacySliders[i] && legacySliders[i].meta) || "",
      list: picked.length > 0 ? picked : fallback,
    };
  });
  const resolvedSliders = adminSliders.length > 0 ? adminSliders : legacySliders;

  const allFaqs = (window.FAQS && window.FAQS.length > 0) ? window.FAQS : (window.FAQ_ITEMS || []);
  const pickedFaqs = (faqHome.pickedIds && faqHome.pickedIds.length > 0)
    ? faqHome.pickedIds.map((id) => allFaqs.find((f) => f.id === id || f.faqId === id)).filter(Boolean)
    : [];
  const homeFaqItems = pickedFaqs.length > 0 ? pickedFaqs : allFaqs.slice(0, 6);
  const homeFaqTitle = faqHome.title || "미용실 방문 전 자주하는 질문";

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
          <li>
            <span className="intro-list-icon"><I.Info size={18} /></span>
            <span className="intro-list-text">스타일을 둘러보고 간편하게 예약해 보세요!</span>
          </li>
        </ul>
      </section>

      <div className="info-banner">
        <span className="info-banner-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M11 12h1v5h1" />
          </svg>
        </span>
        <p className="info-banner-text">{bannerText}</p>
      </div>

      {resolvedSliders.map((s, i) => (
        <FeaturedSlider key={i} title={s.title} meta={s.meta} list={s.list} openStyle={openStyle} />
      ))}

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

      <div className="footer footer-cta">
        <a href="https://www.instagram.com/parkhaddd/" target="_blank" rel="noreferrer" className="btn-secondary">
          <I.Insta size={18} /> 인스타그램
        </a>
        <a href={PHONE_HREF} className="btn">
          <I.Phone size={18} /> 전화로 예약하기
        </a>
      </div>
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
  const list = HAIR_STYLES[cat.id];

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
          <button className="style-card" key={i} onClick={() => onPick({ ...s, category: cat.name, categoryId: cat.id })}>
            <div className="style-thumb" data-cat={cat.id}>
              {s.img ? (
                <img src={s.img} alt={s.name} loading="lazy" />
              ) : (
                <span className="style-thumb-no">{String(i + 1).padStart(2, "0")}</span>
              )}
            </div>
            <div className="style-body">
              <div className="style-name">{s.name}</div>
              <div className="style-meta">
                <span className="style-time"><I.Clock size={13} /> {s.time}분</span>
                <span className="style-price">{fmt(s.price)}<span className="won">원</span></span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="footer">
        <a className="num" href={PHONE_HREF}>{PHONE}</a>
        <p>맞춤 스타일링은 디자이너 상담을 권해드려요</p>
      </div>
    </div>
  );
}

// ─── STYLE SHEET (상세) ─────────────────────────────────────
function StyleSheet({ item, onClose, onBook }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
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
          </div>
          <div className="sheet-meta">
            <div className="name">{item.name}</div>
            <div className="row" style={{ display: "flex", gap: 14, marginTop: 10, alignItems: "center" }}>
              <span className="price">{fmt(item.price)}<span className="won">원</span></span>
              <span className="dotsep">·</span>
              <span className="style-time"><I.Clock size={14} /> {item.time}분</span>
            </div>
            <p className="sheet-desc">{item.desc}</p>
          </div>
        </div>
        <div className="sheet-foot">
          <button className="btn-secondary" onClick={onClose}>닫기</button>
          <button className="btn" onClick={() => onBook(item)}>
            <I.Calendar size={18} strokeWidth={2} /> 이 스타일로 예약하기
          </button>
        </div>
      </div>
    </>
  );
}

// ─── DESIGNER SHEET ─────────────────────────────────────────
function DesignerSheet({ designer, onClose, onBook }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
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
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ph-mute)", marginTop: 4, fontSize: 13 }}>
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

// ─── STYLING (추천받기) ─────────────────────────────────────
const AGE_OPTIONS   = ["10대", "20대", "30대", "40대", "50대 이상"];
const MOOD_OPTIONS  = [
  { id: "manly",   label: "남성적인",  desc: "단단하고 단정한 인상" },
  { id: "neutral", label: "중성적인",  desc: "부드럽고 유연한 인상" },
  { id: "mz",      label: "MZ 트렌드", desc: "요즘 가장 핫한 스타일" },
  { id: "classic", label: "클래식",    desc: "시간에 흔들리지 않는 정통" },
  { id: "soft",    label: "내추럴",    desc: "꾸민 듯 안 꾸민 듯 자연스럽게" },
  { id: "edgy",    label: "엣지",      desc: "강렬한 포인트를 주고 싶을 때" },
];
const LENGTH_OPTIONS  = ["짧게", "보통", "기르고 싶어요"];
const CHALLENGE_OPTIONS = [
  "머리가 잘 떠요",
  "머리숱이 많아요",
  "머리숱이 적어요",
  "곱슬이에요",
  "두피가 예민해요",
];

function StylingScreen() {
  const [form, setForm] = useState({
    age: "",
    moods: [],
    length: "",
    challenges: [],
    note: "",
  });
  const [toast, setToast] = useState(null);

  const toggleArr = (key, val) => {
    setForm((f) => {
      const cur = f[key];
      return { ...f, [key]: cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val] };
    });
  };

  const requiredDone = !!form.age && form.moods.length > 0 && !!form.length;
  const moodLabels = form.moods.map((id) => MOOD_OPTIONS.find((m) => m.id === id)?.label).filter(Boolean);

  const send = () => {
    if (!requiredDone) {
      setToast("나이대 · 희망 스타일 · 길이를 선택해주세요");
      setTimeout(() => setToast(null), 2400);
      return;
    }
    const body = [
      "[PARKHAD 스타일 추천 요청]",
      "",
      "나이대: " + form.age,
      "희망 스타일: " + moodLabels.join(", "),
      "원하는 길이: " + form.length,
      form.challenges.length ? "모발 특징: " + form.challenges.join(", ") : "",
      form.note ? "요청사항: " + form.note : "",
    ].filter(Boolean).join("\n");
    const url = SMS_HREF + "?&body=" + encodeURIComponent(body);
    setToast("문자 앱을 열고 있어요");
    setTimeout(() => { window.location.href = url; setTimeout(() => setToast(null), 1200); }, 400);
  };

  return (
    <div>
      <div className="order-hero">
        <span className="step-pill"><I.Sparkle size={12} strokeWidth={2.2} /> 스타일링 추천</span>
        <h2>당신에게 어울리는<br />스타일을 찾아드려요</h2>
        <p>몇 가지 항목만 알려주시면 디자이너가 맞춤 스타일을 추천하고 문자로 답변드려요.</p>
      </div>

      <div className="styling-form">
        {/* 나이대 */}
        <div className="styling-field">
          <div className="styling-field-head">
            <h4>01. 나이대를 알려주세요</h4>
          </div>
          <div className="chip-row">
            {AGE_OPTIONS.map((a) => (
              <button
                key={a} type="button"
                className={"chip " + (form.age === a ? "on" : "")}
                onClick={() => setForm({ ...form, age: a })}
              >{a}</button>
            ))}
          </div>
        </div>

        {/* 희망 스타일 */}
        <div className="styling-field">
          <div className="styling-field-head">
            <h4>02. 희망 스타일 무드 <span className="styling-multi">중복 선택</span></h4>
          </div>
          <div className="mood-grid">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.id} type="button"
                className={"mood-card " + (form.moods.includes(m.id) ? "on" : "")}
                onClick={() => toggleArr("moods", m.id)}
              >
                <span className="mood-check" aria-hidden="true">
                  <I.Check size={14} strokeWidth={2.6} />
                </span>
                <span className="mood-label">{m.label}</span>
                <span className="mood-desc">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 길이 */}
        <div className="styling-field">
          <div className="styling-field-head">
            <h4>03. 원하는 길이</h4>
          </div>
          <div className="chip-row">
            {LENGTH_OPTIONS.map((l) => (
              <button
                key={l} type="button"
                className={"chip " + (form.length === l ? "on" : "")}
                onClick={() => setForm({ ...form, length: l })}
              >{l}</button>
            ))}
          </div>
        </div>

        {/* 고민 */}
        <div className="styling-field">
          <div className="styling-field-head">
            <h4>04. 모발 특징 <span className="styling-multi">선택 · 중복 가능</span></h4>
          </div>
          <div className="chip-row wrap">
            {CHALLENGE_OPTIONS.map((c) => (
              <button
                key={c} type="button"
                className={"chip " + (form.challenges.includes(c) ? "on" : "")}
                onClick={() => toggleArr("challenges", c)}
              >{c}</button>
            ))}
          </div>
        </div>

        {/* 자유 입력 */}
        <div className="styling-field">
          <div className="styling-field-head">
            <h4>05. 요청 사항 <span className="styling-multi">선택</span></h4>
          </div>
          <textarea
            className="styling-textarea"
            value={form.note}
            placeholder="EX) 윗머리는 살리고 옆은 깔끔하게 하고 싶어요."
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <div className="notice">
        <h5>NOTICE</h5>
        <h6>스타일링 추천 안내</h6>
        <ul>
          <li>입력하신 내용은 문자로 디자이너에게 전달돼요.</li>
          <li>매장 운영시간 내 답변드리며, 영업 시간이 지난 경우 다음 날 답변드려요.</li>
          <li>추천 후 전화·카카오톡으로 예약을 잡아드려요.</li>
        </ul>
      </div>

      <div className="dock">
        <button className="btn" onClick={send}>
          <I.Sparkle size={18} strokeWidth={2} /> 스타일 요청문의
        </button>
      </div>

      {toast && <div className="toast"><I.Check size={16} strokeWidth={2.4} /> {toast}</div>}
    </div>
  );
}

// ─── BOOKING (예약) — 유지, 진입 동선만 변경 ─────────────────
function BookingScreen({ initial }) {
  const [form, setForm] = useState({
    service: initial?.service || "",
    serviceId: initial?.serviceId || "",
    designerId: initial?.designerId || "",
    date: "",   // YYYY-MM-DD
    time: "",   // HH:mm
    name: "",
    phone: "",
    note: "",
  });
  useEffect(() => {
    if (initial?.service) setForm((f) => ({ ...f, service: initial.service, serviceId: initial.serviceId || f.serviceId }));
    if (initial?.designerId) setForm((f) => ({ ...f, designerId: initial.designerId }));
  }, [initial?.service, initial?.designerId]);

  const [toast, setToast] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [serviceSheetOpen, setServiceSheetOpen] = useState(false);
  const [designerSheetOpen, setDesignerSheetOpen] = useState(false);

  const required = ["service", "date", "time", "name", "phone"];
  const done = required.filter((k) => form[k].trim().length > 0).length;
  const total = required.length;
  const designerObj = DESIGNERS.find((d) => d.id === form.designerId);

  const send = () => {
    if (done < total) {
      setToast("필수 항목을 모두 입력해주세요");
      setTimeout(() => setToast(null), 2200);
      return;
    }
    const body = [
      "[PARKHAD 예약 요청]",
      "",
      "시술: " + form.service,
      "날짜: " + form.date,
      "시간: " + form.time,
      "디자이너: " + (designerObj ? `${designerObj.name} (${designerObj.role})` : "지정 없음"),
      "이름: " + form.name,
      "연락처: " + form.phone,
      form.note ? "요청사항: " + form.note : "",
    ].filter(Boolean).join("\n");
    const url = SMS_HREF + "?&body=" + encodeURIComponent(body);
    setToast("문자 앱을 열고 있어요");
    setTimeout(() => { window.location.href = url; setTimeout(() => setToast(null), 1200); }, 400);
  };

  return (
    <div>
      <div className="order-hero">
        <span className="step-pill"><I.Calendar size={12} strokeWidth={2.2} /> 예약하기</span>
        <h2>편한 날짜와 시간을<br />선택해주세요</h2>
        <p>예약 요청이 접수되면 5분 이내에 확정 문자를 다시 보내드려요.</p>
      </div>

      <div className="progress" aria-label={`${done}/${total} 입력 완료`}>
        {required.map((_, i) => <span key={i} className={i < done ? "on" : ""} />)}
      </div>
      <div className="progress-meta">
        <span>입력 진행</span>
        <span className="num">{done}/{total}</span>
      </div>

      <div className="form">
        {/* 1. 시술 선택 */}
        <button type="button" className={"field selectable " + (form.service ? "done" : "")} onClick={() => setServiceSheetOpen(true)}>
          <div className="field-label">
            <span className="lbl"><span className="stepno">1</span> 시술 선택</span>
            {form.service ? <I.Check size={16} strokeWidth={2.4} style={{ color: "#22C55E" }} /> : <I.Arrow size={14} style={{ color: "var(--ph-mute)" }} />}
          </div>
          <div className={"field-val " + (!form.service ? "placeholder" : "")}>
            {form.service || "시술 카테고리와 스타일을 선택하세요"}
          </div>
        </button>

        {/* 2. 날짜 + 시간 */}
        <button type="button" className={"field selectable " + (form.date && form.time ? "done" : "")} onClick={() => setPickerOpen(true)}>
          <div className="field-label">
            <span className="lbl"><span className="stepno">2</span> 날짜·시간</span>
            {(form.date && form.time) ? <I.Check size={16} strokeWidth={2.4} style={{ color: "#22C55E" }} /> : <I.Arrow size={14} style={{ color: "var(--ph-mute)" }} />}
          </div>
          <div className={"field-val " + (!(form.date && form.time) ? "placeholder" : "")}>
            {form.date && form.time
              ? `${formatDateKR(form.date)} · ${form.time}`
              : "달력에서 원하는 날짜와 시간을 선택하세요"}
          </div>
        </button>

        {/* 3. 디자이너 (선택) */}
        <button type="button" className={"field selectable " + (form.designerId ? "done" : "")} onClick={() => setDesignerSheetOpen(true)}>
          <div className="field-label">
            <span className="lbl"><span className="stepno">3</span> 담당 디자이너 <span className="opt-mark">선택</span></span>
            <I.Arrow size={14} style={{ color: "var(--ph-mute)" }} />
          </div>
          <div className={"field-val " + (!designerObj ? "placeholder" : "")}>
            {designerObj ? `${designerObj.name} · ${designerObj.role}` : "지정하지 않으면 가능한 디자이너로 배정돼요"}
          </div>
        </button>

        {/* 4. 이름 */}
        <div className={"field " + (form.name.trim() ? "done" : "")}>
          <div className="field-label">
            <span className="lbl"><span className="stepno">4</span> 이름</span>
            {form.name.trim() && <I.Check size={16} strokeWidth={2.4} style={{ color: "#22C55E" }} />}
          </div>
          <input type="text" value={form.name} placeholder="EX) 홍길동" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        {/* 5. 연락처 */}
        <div className={"field " + (form.phone.trim() ? "done" : "")}>
          <div className="field-label">
            <span className="lbl"><span className="stepno">5</span> 연락처</span>
            {form.phone.trim() && <I.Check size={16} strokeWidth={2.4} style={{ color: "#22C55E" }} />}
          </div>
          <input type="tel" inputMode="numeric" value={form.phone} placeholder="010-0000-0000" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        {/* 6. 요청사항 */}
        <div className="field">
          <div className="field-label">
            <span className="lbl"><span className="stepno">6</span> 요청사항 <span className="opt-mark">선택</span></span>
          </div>
          <input type="text" value={form.note} placeholder="EX) 옆머리는 조금만 다듬어주세요" onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </div>
      </div>

      <div className="notice">
        <h5>NOTICE</h5>
        <h6>예약 시 확인해주세요</h6>
        <ul>
          <li>예약 시간 24시간 전까지는 자유롭게 변경·취소가 가능해요.</li>
          <li>2시간 이내 노쇼·취소가 반복되면 다음 예약이 제한될 수 있어요.</li>
          <li>마감 1시간 전에는 예약이 마감되니 참고해주세요.</li>
          <li>예약금 없이 시술 완료 후 매장에서 결제하시면 돼요.</li>
        </ul>
      </div>

      <div className="dock">
        <button className="btn" onClick={send}>
          <I.Chat size={18} strokeWidth={2} /> 예약 요청 보내기
        </button>
        <div className="dock-sub">
          또는 <a href={PHONE_HREF}>전화로 바로 예약하기</a>
        </div>
      </div>

      {toast && <div className="toast"><I.Check size={16} strokeWidth={2.4} /> {toast}</div>}

      {pickerOpen && (
        <DateTimePicker
          initialDate={form.date}
          initialTime={form.time}
          onClose={() => setPickerOpen(false)}
          onConfirm={({ date, time }) => { setForm((f) => ({ ...f, date, time })); setPickerOpen(false); }}
        />
      )}
      {serviceSheetOpen && (
        <ServicePicker
          onClose={() => setServiceSheetOpen(false)}
          onPick={(text, id) => { setForm((f) => ({ ...f, service: text, serviceId: id })); setServiceSheetOpen(false); }}
        />
      )}
      {designerSheetOpen && (
        <DesignerPicker
          activeId={form.designerId}
          onClose={() => setDesignerSheetOpen(false)}
          onPick={(d) => { setForm((f) => ({ ...f, designerId: d?.id || "" })); setDesignerSheetOpen(false); }}
        />
      )}
    </div>
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

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
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

  // 목요일 휴무 + 운영시간 외 비활성화
  const isClosed  = (d) => d && dow(d) === 4;

  const TIMES = [];
  for (let h = 10; h < 20; h++) {
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

// ─── Service Picker ─────────────────────────────────────────
function ServicePicker({ onClose, onPick }) {
  const [activeId, setActiveId] = useState(HAIR_CATEGORIES[0].id);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);
  const cat = HAIR_CATEGORIES.find((c) => c.id === activeId);
  const list = HAIR_STYLES[activeId];
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet sheet-tall" role="dialog" aria-modal="true">
        <div className="sheet-handle" />
        <div className="guide-head"><h3>시술 선택</h3>
          <button className="sheet-close" onClick={onClose} aria-label="닫기"><I.Close size={18} /></button>
        </div>
        <div className="guide-tabs">
          {HAIR_CATEGORIES.map((c) => (
            <button key={c.id} className={"guide-tab " + (c.id === activeId ? "on" : "")} onClick={() => setActiveId(c.id)}>{c.name}</button>
          ))}
        </div>
        <div className="guide-body">
          <ul className="guide-list">
            {list.map((s, i) => (
              <li key={i}>
                <span className="guide-text">
                  <span className="guide-q">{s.name}</span>
                  <span className="guide-note">{fmt(s.price)}원 · {s.time}분</span>
                </span>
                <button className="guide-apply" onClick={() => onPick(`${cat.name} · ${s.name} (${fmt(s.price)}원)`, `${cat.id}-${i}`)}>선택</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

// ─── Designer Picker ────────────────────────────────────────
function DesignerPicker({ activeId, onClose, onPick }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet sheet-tall" role="dialog" aria-modal="true">
        <div className="sheet-handle" />
        <div className="guide-head"><h3>디자이너 선택</h3>
          <button className="sheet-close" onClick={onClose} aria-label="닫기"><I.Close size={18} /></button>
        </div>
        <div className="guide-body">
          <button className="d-pick none" onClick={() => onPick(null)}>
            <div className="d-pick-text">
              <div className="d-pick-name">지정 없이 예약</div>
              <div className="d-pick-sub">가능한 디자이너로 자동 배정됩니다</div>
            </div>
            {!activeId && <I.Check size={18} strokeWidth={2.4} />}
          </button>
          {DESIGNERS.map((d) => (
            <button key={d.id} className="d-pick" onClick={() => onPick(d)}>
              <div className="designer-avatar small" data-rank={d.rank}>
                <span className="designer-initial">{d.initial}</span>
              </div>
              <div className="d-pick-text">
                <div className="d-pick-name">{d.name} <span className="d-pick-role">{d.role}</span></div>
                <div className="d-pick-sub">{d.specialty.join(" · ")} · {d.years}년</div>
              </div>
              {activeId === d.id && <I.Check size={18} strokeWidth={2.4} />}
            </button>
          ))}
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
        <h2>궁금한 점을<br />빠르게 찾아드려요</h2>
        <p>예약·시술·디자이너·결제 관련 답변을 모았어요. 더 궁금한 점은 전화 또는 문자로 문의주세요.</p>
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
            <p>다른 키워드로 검색하거나 전화로 문의해주세요.</p>
            <a href={PHONE_HREF} className="btn-secondary" style={{ marginTop: 12, width: "auto", display: "inline-flex", padding: "0 18px" }}>
              <I.Phone size={16} /> 전화로 문의하기
            </a>
          </div>
        ) : filtered.map((it, i) => {
          const id = `${it.cat}-${i}`;
          const isOpen = openId === id;
          return (
            <div key={id} className={"faq-item " + (isOpen ? "open" : "")}>
              <button className="faq-q" onClick={() => setOpenId(isOpen ? null : id)} aria-expanded={isOpen}>
                <span className="faq-q-text">
                  <span className="faq-cat">{catLabel(it.cat)}</span>
                  <span className="faq-q-title">{it.q}</span>
                </span>
                <span className="faq-icon" aria-hidden="true">
                  {isOpen ? <I.Minus size={18} /> : <I.Plus size={18} />}
                </span>
              </button>
              {isOpen && <div className="faq-a">{it.a}</div>}
            </div>
          );
        })}
      </div>
      <div className="faq-foot">
        <h4>여전히 궁금한 점이 있으신가요?</h4>
        <p>전화·문자로 문의주시면 빠르게 답변드려요.</p>
        <div className="footer-row">
          <a href={SMS_HREF} className="btn-secondary"><I.Chat size={18} /> 문자 문의</a>
          <a href={PHONE_HREF} className="btn"><I.Phone size={18} /> 전화 걸기</a>
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
    "brand": "#222222",
    "dark": true
  }/*EDITMODE-END*/;
  const [t, setTweak] = (window.useTweaks ? window.useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}]);

  useEffect(() => {
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
  }, [t.dark]);

  const [route, setRoute] = useState(() => {
    const h = (location.hash || "").replace("#", "");
    if (h.startsWith("styles") || h === "booking" || h === "styling" || h === "faq") return h;
    return "home";
  });
  const [activeCat, setActiveCat] = useState("cut");
  const [styleSheet, setStyleSheet] = useState(null);
  const [designerSheet, setDesignerSheet] = useState(null);
  const [bookingSeed, setBookingSeed] = useState(null);

  // 어드민 상품 편집기 미리보기 — ?preview=product 진입 시 postMessage(draftProduct) 를 받아 시트로 표시
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") !== "product") return;
    const handler = (e) => {
      const d = e && e.data;
      if (d && d.type === "draftProduct" && d.product) {
        const p = d.product;
        setStyleSheet({
          id: p.id,
          name: p.name || "(이름 없음)",
          category: p.categoryName || p.category || "",
          categoryId: p.category,
          price: p.price,
          img: p.img || p.image,
          desc: p.desc || p.description || "",
          time: p.time,
          tag: p.tag,
        });
      }
    };
    window.addEventListener("message", handler);
    if (window.parent && window.parent !== window) {
      try { window.parent.postMessage({ type: "previewReady" }, "*"); } catch (_) {}
    }
    return () => window.removeEventListener("message", handler);
  }, []);

  // styles:catId 경로 지원
  const styleCat = route.startsWith("styles") ? (route.split(":")[1] || activeCat) : activeCat;
  useEffect(() => { if (route.startsWith("styles") && route.includes(":")) setActiveCat(route.split(":")[1]); }, [route]);

  const go = (r) => {
    setRoute(r);
    location.hash = r === "home" ? "" : r;
    window.scrollTo(0, 0);
  };

  const bookStyle = (it) => {
    setBookingSeed({ service: `${it.category} · ${it.name} (${fmt(it.price)}원)`, serviceId: `${it.categoryId}-${it.name}` });
    setStyleSheet(null);
    go("booking");
  };
  const bookDesigner = (d) => {
    setBookingSeed((prev) => ({ ...(prev || {}), designerId: d.id }));
    setDesignerSheet(null);
    go("booking");
  };

  const scrolled = useScrolled();
  useEffect(() => { window.scrollTo(0, 0); }, [route]);

  let title = null;
  let onBack = null;
  if (route.startsWith("styles") && !route.startsWith("styling")) { title = "스타일 샘플"; onBack = () => go("home"); }
  if (route === "booking")        { title = "예약하기"; onBack = () => go("home"); }
  if (route === "styling")        { title = "스타일링 추천"; onBack = () => go("home"); }
  if (route === "faq")            { title = "질의응답"; onBack = () => go("home"); }

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
        {mainRoute === "home"    && <HomeScreen go={go} openStyle={setStyleSheet} openDesigner={setDesignerSheet} />}
        {mainRoute === "styles"  && <StylesScreen activeCat={styleCat} setActiveCat={setActiveCat} onPick={setStyleSheet} />}
        {mainRoute === "styling" && <StylingScreen />}
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
