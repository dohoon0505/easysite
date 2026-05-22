/* eslint-disable */
const { useState, useEffect, useRef, useMemo } = React;

const PHONE = "0507-1399-2425";
const PHONE_HREF = "tel:050713992425";
const SMS_HREF = "sms:050713992425";

// ─── Utilities ──────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("ko-KR");

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

function isOpenNow() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, …, 6=Sat
  if (day === 0) return false;
  const mins = now.getHours() * 60 + now.getMinutes();
  const ranges = {
    1: [13 * 60, 19 * 60],   // 월
    2: [13 * 60, 19 * 60],   // 화
    3: [13 * 60, 19 * 60],   // 수
    4: [13 * 60, 19 * 60],   // 목
    5: [13 * 60, 19 * 60],   // 금
    6: [13 * 60, 19 * 60],   // 토
  };
  const [open, close] = ranges[day] || [0, 0];
  return mins >= open && mins < close;
}

// ─── Home FAQ item ──────────────────────────────────────────
function HomeFaqItem({ item, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={"home-faq-item " + (open ? "open" : "")}>
      <button className="home-faq-q" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="home-faq-num" aria-hidden="true">
          <span className="home-faq-num-n">{String(idx).padStart(2, "0")}</span>
        </span>
        <span className="home-faq-q-text">{item.q}</span>
        <span className="home-faq-caret" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      <div className="pagetitle">{title || "풀빛그림아이"}</div>
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
    title: "풀빛그림아이 미술학원",
    text: "대구 달서구 풀빛그림아이 미술학원 — 아이의 손끝에 색을 더하는 시간.",
    url: window.location.href,
  };
  try {
    if (navigator.share) { await navigator.share(data); return; }
  } catch (e) { /* dismissed */ }
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
    { id: "courses",  label: "교육과정",  icon: I.Grid },
    { id: "booking",  label: "상담신청",  icon: I.Note },
    { id: "faq",      label: "질의응답",  icon: I.Help },
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

// ─── Featured Slider ────────────────────────────────────────
function FeaturedSlider({ title, sub, list, openWork }) {
  return (
    <section className="section featured-section">
      <div className="section-head">
        <h3>{title}</h3>
        {sub && <p className="section-sub">{sub}</p>}
      </div>
      <div className="designer-scroll-wrap">
        <div className="designer-scroll">
          {list.map((s) => (
            <button key={s.id} className="feat-card" onClick={() => openWork(s)}>
              <div className="feat-thumb">
                <img src={s.img} alt={s.name} />
              </div>
              <div className="feat-info">
                <div className="feat-headline">{s.name}</div>
                {s.duration && <div className="feat-duration">수업 {s.duration}</div>}
                {s.review && <div className="feat-review">"{s.review}"</div>}
              </div>
            </button>
          ))}
          <div className="designer-scroll-end" />
        </div>
      </div>
    </section>
  );
}

// ─── HOME ───────────────────────────────────────────────────
function HomeScreen({ go, openWork }) {
  // 어드민에서 발행된 HOME_SECTIONS / FAQS 우선 사용.
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

  const unwrapUrl = (v) => {
    if (!v) return null;
    const m = String(v).match(/^url\(["']?([^"')]+)["']?\)$/);
    return m ? m[1] : v;
  };
  const heroImage = unwrapUrl(hero.image) || "img/hero.jpg";
  const region = hero.region || "대구광역시 | 달서구";
  const storeName = hero.storeName || "풀빛그림아이미술학원";
  const storeDesc = hero.storeDesc || "아이들에게 미술학원은 '지루하게 그림만 그리는 곳'이 아니어야 합니다. 가장 발달이 활발한 시기에 맞춰 인지발달과 미적 감각을 일깨우고, 아이에게 '매일 가고 싶은 놀이터'가 될 수 있도록 하겠습니다.";
  const mapImage = unwrapUrl(hero.mapImage) || "img/map.png";
  const mapAddress = hero.mapAddress || "대구 달서구 조암남로16길 19 풀빛그림아이";
  const address = hero.address || "대구 달서구 조암남로16길 19 하늘채 상가 2층";
  const hours = hero.hours || "월~토 13:00 - 19:00 · 일 휴무";
  const bannerText = hero.bannerText || "1회 무료 체험 수업이 가능합니다!!";

  const allGalleryWorks = (window.GALLERY_WORKS && window.GALLERY_WORKS.length > 0)
    ? window.GALLERY_WORKS
    : (window.GALLERY_BEST || []);
  // 다중 슬라이더 지원 — admin 이 슬라이더 N 개 정의하면 모두 렌더
  const sliders = sliderSections.length > 0
    ? sliderSections.map((s) => ({
        title: s.title || "아이들 작품 둘러보기",
        subtitle: s.subtitle || "아이들이 완성한 작품들을 소개해요.",
        list: (s.pickedIds && s.pickedIds.length > 0)
          ? s.pickedIds.map((id) => allGalleryWorks.find((w) => w.id === id)).filter(Boolean)
          : allGalleryWorks,
      }))
    : [{ title: "아이들 작품 둘러보기", subtitle: "아이들이 완성한 작품들을 소개해요.", list: allGalleryWorks }];

  // 어드민 신규 섹션들 — dev / mosaic / award / philosophy
  const devSec = (HS.find((s) => s && s.type === "dev") || {}).data || null;
  const mosaicSec = (HS.find((s) => s && s.type === "mosaic") || {}).data || null;
  const awardSec = (HS.find((s) => s && s.type === "award") || {}).data || null;
  const philoSec = (HS.find((s) => s && s.type === "philosophy") || {}).data || null;

  // 홈 FAQ — 어드민에서 고른 항목 우선, 없으면 첫 6개 폴백.
  const faqHome = (HS.find((s) => s && s.type === "faq") || {}).data || {};
  const allFaqs = (window.FAQS && window.FAQS.length > 0) ? window.FAQS : (window.FAQ_ITEMS || []);
  const pickedFaqs = (faqHome.pickedIds && faqHome.pickedIds.length > 0)
    ? faqHome.pickedIds.map((id) => allFaqs.find((f) => f.id === id || f.faqId === id)).filter(Boolean)
    : [];
  const homeFaqItems = pickedFaqs.length > 0 ? pickedFaqs : allFaqs.slice(0, 6);
  const homeFaqTitle = faqHome.title || "학원 등록 전 자주하는 질문";

  return (
    <div>
      <section className="hero" aria-label={storeName}>
        <div className="hero-img">
          <img src={heroImage} alt={`${storeName} 입구`} />
        </div>
      </section>

      <section className="intro">
        <div className="intro-meta">{region}</div>
        <h2 className="intro-name">{storeName}</h2>
        <p className="intro-desc">{storeDesc}</p>

        <div className="intro-map" aria-label="매장 위치 지도">
          <img src={mapImage} alt={`${storeName} 위치`} className="intro-map-img" />
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

      <div className="info-banner">
        <span className="info-banner-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M11 12h1v5h1" />
          </svg>
        </span>
        <p className="info-banner-text">{bannerText}</p>
      </div>

      {sliders.map((s, i) => (
        <FeaturedSlider key={"slider-" + i} title={s.title} sub={s.subtitle} list={s.list} openWork={openWork} />
      ))}

      <section className="section dev-section">
        <div className="section-head dev-head">
          <h3 dangerouslySetInnerHTML={{ __html: (devSec && devSec.title) || "미술이 아이의 <em>인지를 키웁니다</em>" }} />
          <p className="dev-sub">{(devSec && devSec.sub) || "손을 움직이고, 관찰하고, 표현하는 과정에서 두뇌가 가장 활발하게 자랍니다."}</p>
        </div>
        <div className="dev-grid">
          {((devSec && Array.isArray(devSec.items) && devSec.items.length > 0) ? devSec.items : [
            { id: "ipad",   activity: "아이패드 드로잉", tags: ["디지털 리터러시", "창의력"],  desc: "아이패드로 새로운 도구를 익히며, 표현의 경계를 넓혀갑니다.", color: "teal" },
            { id: "draw",   activity: "기초 드로잉",   tags: ["관찰력", "집중력"],           desc: "선 하나하나를 쌓아가며 손과 눈의 협응력이 자라요.", color: "blue" },
            { id: "water",  activity: "수채화",         tags: ["색채 감각", "감성 표현"],     desc: "물과 물감이 번지는 순간, 아이의 감수성이 함께 피어납니다.", color: "pink" },
            { id: "sketch", activity: "소묘",           tags: ["공간 지각력", "정밀함"],      desc: "명암과 형태를 잡으며 사물을 입체로 이해하는 힘을 키워요.", color: "yellow" },
            { id: "pencil", activity: "색연필화",       tags: ["색감", "섬세함"],             desc: "색을 겹치고 쌓으며 나만의 색 조합을 찾아가는 과정이에요.", color: "orange" },
            { id: "pen",    activity: "펜화",           tags: ["집중력", "표현력"],           desc: "지울 수 없는 선 위에서 과감하게 표현하는 자신감이 생겨요.", color: "purple" },
          ]).map((a, i) => (
            <div key={a.id || i} className="dev-card" data-color={a.color || "teal"}>
              <div className="dev-card-head">
                <span className="dev-bullet" aria-hidden="true" />
                <span className="dev-activity">{a.activity}</span>
              </div>
              <div className="dev-tags">
                {(a.tags || []).map((t, j) => <span key={j} className="dev-tag">{t}</span>)}
              </div>
              <p className="dev-desc">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section mosaic-section">
        <div className="section-head">
          <h3>{(mosaicSec && mosaicSec.title) || "매일의 작업, 매일의 성장"}</h3>
          <p className="section-sub">{(mosaicSec && mosaicSec.sub) || "학원의 매일을 담았어요."}</p>
        </div>
        <div className="mosaic">
          {((mosaicSec && Array.isArray(mosaicSec.images) && mosaicSec.images.length > 0)
            ? mosaicSec.images.map((im) => unwrapUrl(im.url || im.downloadUrl) || "")
            : ["img/work_1.jpg","img/work_2.jpg","img/work_3.jpg","img/work_4.jpg","img/work_5.jpg","img/work_6.jpg","img/work_7.jpg","img/work_8.jpg"]
          ).map((src, i) => (
            <button key={i} className={"mosaic-tile m" + i} onClick={() => openWork({ name: "수업 풍경", age: "PARKHADI", img: src, desc: "풀빛그림아이의 일상 한 컷." })}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </section>

      <section className="section award-section">
        <div className="section-head">
          <h3>{(awardSec && awardSec.title) || "공모전·대회 수상까지!"}</h3>
          <p className="section-sub">{(awardSec && awardSec.sub) || "아이가 노력에 대한 보상을 얻을 수 있도록"}</p>
        </div>
        <div className="award-card">
          <div className="award-img-wrap">
            <img src={unwrapUrl(awardSec && awardSec.image) || "img/award.jpg"} alt="공모전 수상 상장들" loading="lazy" />
          </div>
          <div className="award-foot">
            {((awardSec && Array.isArray(awardSec.badges) && awardSec.badges.length > 0)
              ? awardSec.badges
              : ["입선·수상 다수 배출", "전국·지역 미술대회 참가"]
            ).map((label, i) => (
              <span key={i} className="award-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M8 14l-2 7 6-3 6 3-2-7"/></svg>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section philosophy-section">
        <div className="philo-card">
          <div className="philo-mark" aria-hidden="true">“</div>
          {philoSec && philoSec.text ? (
            <p className="philo-text">
              {philoSec.text.split(/\r?\n/).map((line, i, arr) => (
                <React.Fragment key={i}>
                  {philoSec.emphasis && line.includes(philoSec.emphasis) ? (
                    <>
                      {line.split(philoSec.emphasis)[0]}
                      <em>{philoSec.emphasis}</em>
                      {line.split(philoSec.emphasis).slice(1).join(philoSec.emphasis)}
                    </>
                  ) : line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          ) : (
            <p className="philo-text">
              탄탄한 표현력은 기본, 스스로 세상을 관찰하고 도화지에 담아내는 즐거움까지.<br />
              <em>풀빛그림아이</em>는 아이의 시선이 머무는 모든 것을 훌륭한 작품으로 만듭니다.
            </p>
          )}
          <div className="philo-sign">{(philoSec && philoSec.sign) || "— 풀빛그림아이 미술학원"}</div>
        </div>
      </section>

      <section className="section home-faq-section">
        <div className="section-head home-faq-head">
          <h3>{homeFaqTitle}</h3>
          <p className="home-faq-sub">가장 많이 받는 질문 6가지를 모았어요.</p>
        </div>
        <ul className="home-faq-list">
          {homeFaqItems.map((it, i) => (
            <HomeFaqItem key={i} item={it} idx={i + 1} />
          ))}
        </ul>
        <button className="home-faq-more" type="button" onClick={() => go("faq")}>
          전체 질문 보기 <I.Arrow size={14} />
        </button>
      </section>

      <div className="footer footer-cta">
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="btn-secondary">
          <I.Insta size={18} /> 인스타그램 둘러보기
        </a>
        <a href={PHONE_HREF} className="btn">
          <I.Phone size={18} /> 전화로 상담하기
        </a>
      </div>
    </div>
  );
}

// ─── COURSES (교육과정) ─────────────────────────────────────
const CATEGORY_HUES = {
  kinder: { hue: "peach",    chip: "#FFE4D0" },
  elem:   { hue: "mint",     chip: "#D6F2EA" },
  exam:   { hue: "blue",     chip: "#DCEEFD" },
  hobby:  { hue: "lavender", chip: "#ECE2FA" },
  ipad:   { hue: "pink",     chip: "#FFE0E8" },
};

function CoursesScreen({ activeCat, setActiveCat, openWork }) {
  const tabRef = useRef(null);
  useEffect(() => {
    const el = tabRef.current?.querySelector(`[data-tab='${activeCat}']`);
    if (el) el.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [activeCat]);

  const cat = TECH_CATEGORIES.find((c) => c.id === activeCat) || TECH_CATEGORIES[0];
  const gallery = (window.GALLERY_BY_TECH || {})[cat.id] || [];

  return (
    <div>
      <div className="tabbar">
        <div className="tabbar-scroll" ref={tabRef}>
          {TECH_CATEGORIES.map((c) => (
            <button key={c.id} data-tab={c.id} className={"tab " + (c.id === activeCat ? "on" : "")} onClick={() => setActiveCat(c.id)}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <section className="course-hero" data-hue={cat.hue}>
        <div className="course-hero-deco" aria-hidden="true">
          <span className="dot dot-a" />
          <span className="dot dot-b" />
          <span className="dot dot-c" />
        </div>
        <div className="course-hero-meta">
          <span className="course-hero-count">{gallery.length}개 작품</span>
        </div>
        <h2 className="course-hero-title">{cat.name}</h2>
        <p className="course-hero-desc">{cat.learns}</p>
      </section>

      {gallery.length > 0 ? (
        <ul className="course-list">
          {gallery.map((work, i) => (
            <li key={work.id}>
              <button className="course-row" data-hue={cat.hue} onClick={() => openWork({ ...work, category: cat.name })}>
                <div className="course-thumb">
                  {work.img ? (
                    <img src={work.img} alt={work.name} loading="lazy" />
                  ) : (
                    <span className="course-thumb-fallback">{String(i + 1).padStart(2, "0")}</span>
                  )}
                </div>
                <div className="course-text">
                  <div className="course-name">{work.name}</div>
                  <div className="course-desc">{work.desc}</div>
                  <div className="course-cta">자세히 보기 <I.Arrow size={14} /></div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="course-gallery-empty">
          <p>준비 중인 작품들을 곧 소개할게요.</p>
        </div>
      )}
    </div>
  );
}

// ─── COURSE / WORK SHEET ─────────────────────────────────────
function StyleSheet({ item, onClose, onBook }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);
  if (!item) return null;
  const isWork = !item.per; // 작품 시트 (per 없음) vs 과정 시트 (per 있음)
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={item.name}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <div className="sheet-head-text">
            {!isWork && <h4>{item.category}</h4>}
            <div className="sheet-head-name">{item.name}</div>
          </div>
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
            {!isWork && (
              <div className="row" style={{ display: "flex", gap: 14, marginTop: 10, alignItems: "center" }}>
                <span className="style-time"><I.Clock size={14} /> {item.weekly}</span>
                <span className="dotsep">·</span>
                <span className="style-time"><I.User size={14} /> {item.age}</span>
                <span className="dotsep">·</span>
                <span className="price">{fmt(item.per)}<span className="won">원/월</span></span>
              </div>
            )}
            <p className="sheet-desc">{item.desc}</p>
            {item.develop && item.develop.length > 0 && (
              <div className="sheet-develop">
                <span className="sheet-develop-label">발달 영역</span>
                <div className="sheet-develop-tags">
                  {item.develop.map((d) => <span key={d} className="sheet-develop-tag">{d}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="sheet-foot">
          <button className="btn-secondary" onClick={onClose}>닫기</button>
          <button className="btn" onClick={() => onBook(item)}>
            <I.Note size={18} strokeWidth={2} /> 상담 신청하기
          </button>
        </div>
      </div>
    </>
  );
}

// ─── BOOKING (상담신청) ─────────────────────────────────────
const GRADE_OPTIONS = ["5~7세", "초1~2", "초3~4", "초5~6", "중학생", "고등학생", "성인"];
const CONTACT_TIMES = ["오전 (09~12)", "점심 (12~14)", "오후 (14~18)", "저녁 (18~21)"];

function BookingScreen({ initial }) {
  const [form, setForm] = useState({
    course: initial?.course || "",
    courseId: initial?.courseId || "",
    studentName: "",
    grade: "",
    contactTime: "",
    parentPhone: "",
    note: "",
  });
  useEffect(() => {
    if (initial?.course) setForm((f) => ({ ...f, course: initial.course, courseId: initial.courseId || f.courseId }));
  }, [initial?.course]);

  const [toast, setToast] = useState(null);
  const [coursePickerOpen, setCoursePickerOpen] = useState(false);

  const required = ["course", "studentName", "grade", "contactTime", "parentPhone"];
  const done = required.filter((k) => form[k].trim().length > 0).length;
  const total = required.length;

  const send = () => {
    if (done < total) {
      setToast("필수 항목을 모두 입력해주세요");
      setTimeout(() => setToast(null), 2200);
      return;
    }
    const body = [
      "[풀빛그림아이 미술학원 상담 신청]",
      "",
      "희망 과정: " + form.course,
      "학생 이름: " + form.studentName,
      "학년/연령: " + form.grade,
      "상담 가능 시간: " + form.contactTime,
      "학부모 연락처: " + form.parentPhone,
      form.note ? "요청사항: " + form.note : "",
    ].filter(Boolean).join("\n");
    const url = SMS_HREF + "?&body=" + encodeURIComponent(body);
    setToast("문자 앱을 열고 있어요");
    setTimeout(() => { window.location.href = url; setTimeout(() => setToast(null), 1200); }, 400);
  };

  return (
    <div>
      <div className="order-hero">
        <span className="step-pill"><I.Note size={12} strokeWidth={2.2} /> 상담 신청</span>
        <h2>편한 시간을 알려주세요<br />학원에서 연락드릴게요</h2>
        <p>1회 무료 체험 수업도 함께 신청하실 수 있어요. 학원 운영 시간 내 빠르게 답변드립니다.</p>
      </div>

      <div className="progress" aria-label={`${done}/${total} 입력 완료`}>
        {required.map((_, i) => <span key={i} className={i < done ? "on" : ""} />)}
      </div>
      <div className="progress-meta">
        <span>입력 진행</span>
        <span className="num">{done}/{total}</span>
      </div>

      <div className="form">
        {/* 1. 희망 과정 */}
        <button type="button" className={"field selectable " + (form.course ? "done" : "")} onClick={() => setCoursePickerOpen(true)}>
          <div className="field-label">
            <span className="lbl"><span className="stepno">1</span> 희망 과정</span>
            {form.course ? <I.Check size={16} strokeWidth={2.4} style={{ color: "#22C55E" }} /> : <I.Arrow size={14} style={{ color: "var(--ph-mute)" }} />}
          </div>
          <div className={"field-val " + (!form.course ? "placeholder" : "")}>
            {form.course || "관심 있는 과정을 선택하세요"}
          </div>
        </button>

        {/* 2. 학생 이름 */}
        <div className={"field " + (form.studentName.trim() ? "done" : "")}>
          <div className="field-label">
            <span className="lbl"><span className="stepno">2</span> 학생 이름</span>
            {form.studentName.trim() && <I.Check size={16} strokeWidth={2.4} style={{ color: "#22C55E" }} />}
          </div>
          <input type="text" value={form.studentName} placeholder="EX) 홍길동" onChange={(e) => setForm({ ...form, studentName: e.target.value })} />
        </div>

        {/* 3. 학년 */}
        <div className={"field " + (form.grade ? "done" : "")}>
          <div className="field-label">
            <span className="lbl"><span className="stepno">3</span> 학년·연령</span>
            {form.grade && <I.Check size={16} strokeWidth={2.4} style={{ color: "#22C55E" }} />}
          </div>
          <div className="chip-row wrap" style={{ marginTop: 8 }}>
            {GRADE_OPTIONS.map((g) => (
              <button key={g} type="button" className={"chip " + (form.grade === g ? "on" : "")} onClick={() => setForm({ ...form, grade: g })}>{g}</button>
            ))}
          </div>
        </div>

        {/* 4. 상담 가능 시간 */}
        <div className={"field " + (form.contactTime ? "done" : "")}>
          <div className="field-label">
            <span className="lbl"><span className="stepno">4</span> 상담 가능 시간</span>
            {form.contactTime && <I.Check size={16} strokeWidth={2.4} style={{ color: "#22C55E" }} />}
          </div>
          <div className="chip-row wrap" style={{ marginTop: 8 }}>
            {CONTACT_TIMES.map((t) => (
              <button key={t} type="button" className={"chip " + (form.contactTime === t ? "on" : "")} onClick={() => setForm({ ...form, contactTime: t })}>{t}</button>
            ))}
          </div>
        </div>

        {/* 5. 학부모 연락처 */}
        <div className={"field " + (form.parentPhone.trim() ? "done" : "")}>
          <div className="field-label">
            <span className="lbl"><span className="stepno">5</span> 학부모 연락처</span>
            {form.parentPhone.trim() && <I.Check size={16} strokeWidth={2.4} style={{ color: "#22C55E" }} />}
          </div>
          <input type="tel" inputMode="numeric" value={form.parentPhone} placeholder="010-0000-0000" onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} />
        </div>

        {/* 6. 요청사항 */}
        <div className="field">
          <div className="field-label">
            <span className="lbl"><span className="stepno">6</span> 요청 사항 <span className="opt-mark">선택</span></span>
          </div>
          <input type="text" value={form.note} placeholder="EX) 미술 경험은 처음이에요. 친구와 함께 등록하고 싶어요." onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </div>
      </div>

      <div className="notice">
        <h5>NOTICE</h5>
        <h6>상담 안내</h6>
        <ul>
          <li>입력하신 내용은 문자로 학원에 전달돼요.</li>
          <li>학원 운영시간 내 답변드리며, 운영 시간이 지난 경우 다음 영업일에 답변드려요.</li>
          <li>상담 후 1회 무료 체험 일정도 함께 잡아드려요.</li>
        </ul>
      </div>

      <div className="dock">
        <button className="btn" onClick={send}>
          <I.Note size={18} strokeWidth={2} /> 상담 요청 보내기
        </button>
      </div>

      {toast && <div className="toast"><I.Check size={16} strokeWidth={2.4} /> {toast}</div>}
      {coursePickerOpen && (
        <CoursePicker
          onClose={() => setCoursePickerOpen(false)}
          onPick={(text, id) => { setForm((f) => ({ ...f, course: text, courseId: id })); setCoursePickerOpen(false); }}
        />
      )}
    </div>
  );
}

// ─── Course Picker ──────────────────────────────────────────
function CoursePicker({ onClose, onPick }) {
  const [activeId, setActiveId] = useState(COURSE_CATEGORIES[0].id);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);
  const cat = COURSE_CATEGORIES.find((c) => c.id === activeId);
  const list = COURSES[activeId];
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet sheet-tall" role="dialog" aria-modal="true">
        <div className="sheet-handle" />
        <div className="guide-head"><h3>과정 선택</h3>
          <button className="sheet-close" onClick={onClose} aria-label="닫기"><I.Close size={18} /></button>
        </div>
        <div className="guide-tabs">
          {COURSE_CATEGORIES.map((c) => (
            <button key={c.id} className={"guide-tab " + (c.id === activeId ? "on" : "")} onClick={() => setActiveId(c.id)}>{c.name}</button>
          ))}
        </div>
        <div className="guide-body">
          <ul className="guide-list">
            <li>
              <span className="guide-text">
                <span className="guide-q">아직 모르겠어요</span>
                <span className="guide-note">학원에서 가장 어울리는 과정을 추천해드려요</span>
              </span>
              <button className="guide-apply" onClick={() => onPick("학원 추천 받기", "any")}>선택</button>
            </li>
            {list.map((s, i) => (
              <li key={i}>
                <span className="guide-text">
                  <span className="guide-q">{s.name}</span>
                  <span className="guide-note">{s.age} · {fmt(s.per)}원/월 · {s.weekly}</span>
                </span>
                <button className="guide-apply" onClick={() => onPick(`${cat.name} · ${s.name}`, `${cat.id}-${i}`)}>선택</button>
              </li>
            ))}
          </ul>
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
        <p>수강·비용·시설·시간 관련 답변을 모았어요. 더 궁금한 점은 전화 또는 문자로 문의주세요.</p>
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

// ─── App root ────────────────────────────────────────────────
function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "brand": "#3DAA6E",
    "dark": false
  }/*EDITMODE-END*/;
  const [t, setTweak] = (window.useTweaks ? window.useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}]);

  useEffect(() => {
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
  }, [t.dark]);

  const [route, setRoute] = useState(() => {
    const h = (location.hash || "").replace("#", "");
    if (h.startsWith("courses") || h === "booking" || h === "faq") return h;
    return "home";
  });
  const [activeCat, setActiveCat] = useState("ipad");
  const [sheet, setSheet] = useState(null);
  const [bookingSeed, setBookingSeed] = useState(null);

  // 어드민 상품 편집기 미리보기 — ?preview=product 진입 시 postMessage(draftProduct) 를 받아 시트로 표시
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") !== "product") return;
    const handler = (e) => {
      const d = e && e.data;
      if (d && d.type === "draftProduct" && d.product) {
        const p = d.product;
        setSheet({
          id: p.id,
          name: p.name || "(이름 없음)",
          category: p.categoryName || p.category || "",
          categoryId: p.category,
          age: p.age || "",
          duration: p.duration || "",
          per: p.per,
          weekly: p.weekly,
          price: p.price,
          img: p.img || p.image,
          desc: p.desc || p.description || "",
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

  // courses:catId 경로 지원
  useEffect(() => { if (route.startsWith("courses") && route.includes(":")) setActiveCat(route.split(":")[1]); }, [route]);

  const go = (r) => {
    setRoute(r);
    location.hash = r === "home" ? "" : r;
    window.scrollTo(0, 0);
  };

  const bookCourse = (it) => {
    if (it.per) {
      setBookingSeed({ course: `${it.category} · ${it.name}`, courseId: `${it.categoryId}-${it.name}` });
    }
    setSheet(null);
    go("booking");
  };

  const scrolled = useScrolled();
  useEffect(() => { window.scrollTo(0, 0); }, [route]);

  let title = null;
  let onBack = null;
  if (route.startsWith("courses")) { title = "교육과정"; onBack = () => go("home"); }
  if (route === "booking")        { title = "상담신청"; onBack = () => go("home"); }
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
        {mainRoute === "home"    && <HomeScreen go={go} openWork={setSheet} />}
        {mainRoute === "courses" && <CoursesScreen activeCat={activeCat} setActiveCat={setActiveCat} openWork={setSheet} />}
        {mainRoute === "booking" && <BookingScreen initial={bookingSeed} />}
        {mainRoute === "faq"     && <FaqScreen />}
        {sheet && <StyleSheet item={sheet} onClose={() => setSheet(null)} onBook={bookCourse} />}
      </div>
      <BottomNav route={mainRoute} go={go} />
      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection title="Theme">
            <window.TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak("dark", v)} />
          </window.TweakSection>
          <window.TweakSection title="Quick actions">
            <window.TweakButton onClick={() => go("home")}>Home</window.TweakButton>
            <window.TweakButton onClick={() => go("courses")}>Courses</window.TweakButton>
            <window.TweakButton onClick={() => go("booking")}>Booking</window.TweakButton>
            <window.TweakButton onClick={() => go("faq")}>FAQ</window.TweakButton>
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
