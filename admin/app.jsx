/* eslint-disable */
// Main app: routing + state + Tweaks + mobile/desktop switch

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "navy",
  "theme": "light",
  "density": "comfortable",
  "device": "desktop",
  "offline": false,
  "site": "dohwawon"
}/*EDITMODE-END*/;

const App = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // ── Firebase 인증 세션 ─────────────────────────────────
  // useAuthSession() 은 onIdTokenChanged 를 구독한다.
  // status: "loading" | "signedIn" | "signedOut"
  const session = useAuthSession();
  const loggedIn = session.status === "signedIn";
  const setLoggedIn = React.useCallback((v) => {
    // 디자인 흐름과 호환 — Tweaks 의 "로그인 / 로그인 이후" 토글 + 로그아웃 버튼이 사용.
    // false 로 호출 시 Firebase 로그아웃.
    if (v === false && window.fbAuth) {
      window.signOutCurrent();
    }
    // v === true 는 onAuthStateChanged 가 처리하므로 무시.
  }, []);

  const [route, setRoute] = React.useState("products");
  const [editingId, setEditingId] = React.useState(null);
  const [creating, setCreating] = React.useState(false);
  const [showSwitcher, setShowSwitcher] = React.useState(false);

  // 로그인 시 role 에 맞춰 기본 라우트로 이동.
  //  - 슈퍼: 사용자 관리 (다른 사이트 운영 메뉴는 사이드바에 안 보임)
  //  - 에디터: 상품 (슈퍼 메뉴는 사이드바에 안 보임)
  const lastSnappedRef = React.useRef(false);
  React.useEffect(() => {
    if (session.status !== "signedIn" || !session.claims) return;
    const isSuper = session.claims.role === "super";
    const editorOnlyRoutes = ["home", "products", "editor", "categories", "publish"];
    const superOnlyRoutes = ["users", "sites"];
    if (isSuper && editorOnlyRoutes.includes(route)) {
      setRoute("users");
      lastSnappedRef.current = true;
    } else if (!isSuper && superOnlyRoutes.includes(route)) {
      setRoute("products");
      lastSnappedRef.current = true;
    } else if (!lastSnappedRef.current && isSuper && route === "products") {
      // 최초 로그인 직후 기본 products 였다면 슈퍼는 users 로
      setRoute("users");
      lastSnappedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status, session.claims && session.claims.role]);

  // 사용자 claim 의 siteId 가 있으면 자동 선택, 없으면 t.site 또는 dohwawon.
  const initialSiteId = React.useMemo(
    () => (session.claims && session.claims.siteId) || t.site || "dohwawon",
    []
  );
  const [siteId, setSiteId] = React.useState(initialSiteId);

  // 로그인 후 claim 의 siteId 가 들어오면 한 번만 자동 반영 (super 는 자유 선택 유지).
  React.useEffect(() => {
    if (session.claims && session.claims.siteId && session.claims.siteId !== siteId) {
      setSiteId(session.claims.siteId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.claims && session.claims.siteId]);

  // ── Firestore 라이브 데이터 ─────────────────────────────
  // useLive* 가 [items, setItems, loading] 반환 — setItems 호출 시 Firestore diff write.
  const [liveProducts, setProducts, productsLoading] = window.useLiveProducts(siteId);
  const [liveSections, setSections, sectionsLoading] = window.useLiveSections(siteId);

  // 미인증/loading 상태에선 mock 으로 fallback → 디자인이 항상 렌더링 가능.
  const products = loggedIn ? liveProducts : PRODUCTS;
  const sections = loggedIn ? liveSections : HOME_SECTIONS;
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [cmdkOpen, setCmdkOpen] = React.useState(false);
  const [csvOpen, setCsvOpen] = React.useState(false);
  const site = SITES.find((s) => s.id === siteId) || SITES[0];

  // Global ⌘K / Ctrl+K listener
  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdkOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.theme);
    document.documentElement.setAttribute("data-accent", t.accent);
    document.documentElement.setAttribute("data-density", t.density);
  }, [t.theme, t.accent, t.density]);

  const draftCount = products.filter((p) => p.draft).length + sections.filter((s) => s.draft).length;

  const openEditor = (id) => {
    setEditingId(id);
    setCreating(false);
    setRoute("editor");
  };
  const openCreate = () => {
    setEditingId(null);
    setCreating(true);
    setRoute("editor");
  };
  const backToProducts = () => {
    setEditingId(null);
    setCreating(false);
    setRoute("products");
  };

  const crumbs = React.useMemo(() => {
    const map = {
      home: ["홈 섹션 편집"],
      products: ["상품"],
      editor: ["상품", editingId ? "수정" : "새 상품"],
      categories: ["카테고리"],
      publish: ["발행 센터"],
      account: ["내 계정", "계정 설정"],
      audit: ["내 계정", "변경 이력"],
      users: ["슈퍼", "사용자 관리"],
      sites: ["슈퍼", "사이트 관리"],
    };
    return ["easysite", site.name, ...(map[route] || ["—"])];
  }, [route, site, editingId]);

  const accentOptions = [
    { name: "navy", palette: ["#1f2a52", "#0d1226", "#eef0f8"] },
    { name: "indigo", palette: ["#3b3f8f", "#252a6b", "#ecedf8"] },
    { name: "forest", palette: ["#1f4d36", "#0f2e1f", "#e6efe9"] },
    { name: "charcoal", palette: ["#1a1d24", "#000000", "#eeeff2"] },
  ];
  const currentAccentPalette = accentOptions.find((o) => o.name === t.accent)?.palette;

  const desktopUI = (
    <div className="app">
      <Sidebar
        route={route}
        onNav={(r) => {
          setRoute(r);
          setEditingId(null);
          setCreating(false);
        }}
        site={site}
        onSwitchSite={() => setShowSwitcher(true)}
        draftCount={draftCount}
      />
      <main className="main">
        {t.offline && <OfflineBanner simulated={t.offline} queueCount={draftCount} />}
        <Topbar
          crumbs={crumbs}
          site={site}
          actions={
            <>
              <Button
                variant="outline"
                iconLeft="link"
                onClick={() => window.open(window.liveSiteUrl(site.id), "_blank")}
              >
                사이트 열기
              </Button>
              <Button
                variant="primary"
                iconLeft="rocket"
                onClick={() => setRoute("publish")}
                disabled={draftCount === 0}
              >
                발행 {draftCount > 0 ? `(${draftCount})` : ""}
              </Button>
            </>
          }
        />
        {route === "home" && (
          <HomeSectionsPage sections={sections} setSections={setSections} products={products} onNav={setRoute} site={site} />
        )}
        {route === "products" && (
          <ProductsPage
            onEdit={openEditor}
            onCreate={openCreate}
            products={products}
            setProducts={setProducts}
          />
        )}
        {route === "editor" && (
          <ProductEditorPage
            productId={editingId}
            products={products}
            setProducts={setProducts}
            onBack={backToProducts}
            siteId={siteId}
          />
        )}
        {route === "categories" && <CategoriesRealPage siteId={siteId} products={products} />}
        {route === "faqs" && <FaqsPage siteId={siteId} />}
        {route === "publish" && (
          <PublishCenterPage
            products={products}
            sections={sections}
            setProducts={setProducts}
            setSections={setSections}
            onGoto={setRoute}
            siteId={siteId}
          />
        )}
        {route === "account" && <AccountPage />}
        {route === "audit" && <AuditPage />}
        {route === "users" && <UsersManagePage />}
        {route === "sites" && <SitesManagePage />}
      </main>
    </div>
  );

  return (
    <ToastProvider>
      {!loggedIn ? (
        <LoginPage onLogin={() => setLoggedIn(true)} />
      ) : t.device === "mobile" ? (
        <MobileApp
          products={products}
          setProducts={setProducts}
          sections={sections}
          setSections={setSections}
          site={site}
          onSwitchSite={() => setShowSwitcher(true)}
          onLogout={() => setLoggedIn(false)}
          offline={t.offline}
        />
      ) : (
        desktopUI
      )}

      <SiteSwitcherModal
        open={showSwitcher}
        onClose={() => setShowSwitcher(false)}
        sites={SITES}
        currentId={siteId}
        onSelect={(id) => {
          setSiteId(id);
          setTweak("site", id);
        }}
      />

      <BulkPriceSheet
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        products={products}
        setProducts={setProducts}
      />

      <CommandPalette
        open={cmdkOpen}
        onClose={() => setCmdkOpen(false)}
        products={products}
        sites={SITES}
        currentSiteId={siteId}
        onNav={(r, id) => {
          if (t.device === "mobile") setTweak("device", "desktop");
          setLoggedIn(true);
          if (r === "editor" && id) {
            openEditor(id);
          } else {
            setRoute(r);
          }
        }}
        onSwitchSite={(id) => {
          setSiteId(id);
          setTweak("site", id);
        }}
        onBulkPrice={() => setBulkOpen(true)}
        onCreate={openCreate}
      />

      <CsvImportModal
        open={csvOpen}
        onClose={() => setCsvOpen(false)}
        onImport={() => setRoute("publish")}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="디바이스">
          <TweakRadio
            label="화면"
            value={loggedIn ? "app" : "login"}
            options={[
              { value: "login", label: "로그인" },
              { value: "app", label: "로그인 이후" },
            ]}
            onChange={(v) => setLoggedIn(v === "app")}
          />
          <TweakRadio
            label="디바이스"
            value={t.device}
            options={[
              { value: "desktop", label: "데스크톱" },
              { value: "mobile", label: "모바일" },
            ]}
            onChange={(v) => setTweak("device", v)}
          />
        </TweakSection>
        <TweakSection label="외형">
          <TweakRadio
            label="테마"
            value={t.theme}
            options={[
              { value: "light", label: "라이트" },
              { value: "dark", label: "다크" },
            ]}
            onChange={(v) => setTweak("theme", v)}
          />
          <TweakColor
            label="액센트"
            value={currentAccentPalette}
            options={accentOptions.map((o) => o.palette)}
            onChange={(v) => {
              const found = accentOptions.find(
                (o) => JSON.stringify(o.palette).toLowerCase() === JSON.stringify(v).toLowerCase()
              );
              if (found) setTweak("accent", found.name);
            }}
          />
          <TweakRadio
            label="밀도"
            value={t.density}
            options={[
              { value: "comfortable", label: "여유" },
              { value: "compact", label: "조밀" },
            ]}
            onChange={(v) => setTweak("density", v)}
          />
        </TweakSection>
        <TweakSection label="데스크톱 화면 이동">
          <TweakButton
            label="홈 섹션 편집 →"
            onClick={() => {
              setTweak("device", "desktop");
              setRoute("home");
              setEditingId(null);
              setCreating(false);
            }}
          />
          <TweakButton
            label="상품 목록 →"
            onClick={() => {
              setTweak("device", "desktop");
              setRoute("products");
              setEditingId(null);
              setCreating(false);
            }}
          />
          <TweakButton label="상품 수정 →" onClick={() => { setTweak("device", "desktop"); openEditor("p_001"); }} />
          <TweakButton label="카테고리 (드래그) →" onClick={() => { setTweak("device", "desktop"); setRoute("categories"); }} />
          <TweakButton label="발행 센터 →" onClick={() => { setTweak("device", "desktop"); setRoute("publish"); }} />
          <TweakButton label="일괄 가격 조정 시트" onClick={() => setBulkOpen(true)} />
          <TweakButton label="사용자 관리 (슈퍼) →" onClick={() => { setTweak("device", "desktop"); setLoggedIn(true); setRoute("users"); }} />
          <TweakButton label="사이트 관리 (슈퍼) →" onClick={() => { setTweak("device", "desktop"); setLoggedIn(true); setRoute("sites"); }} />
          <TweakButton label="변경 이력 →" onClick={() => { setTweak("device", "desktop"); setLoggedIn(true); setRoute("audit"); }} />
          <TweakButton label="계정 설정 →" onClick={() => { setTweak("device", "desktop"); setLoggedIn(true); setRoute("account"); }} />
        </TweakSection>
        <TweakSection label="시스템 상태">
          <TweakToggle
            label="오프라인 시뮬레이션"
            value={t.offline}
            onChange={(v) => setTweak("offline", v)}
          />
          <TweakButton label="⌘K 명령 팔레트 열기" onClick={() => setCmdkOpen(true)} />
          <TweakButton label="CSV 가져오기 시작" onClick={() => setCsvOpen(true)} />
        </TweakSection>
        <TweakSection label="시스템 상태">
          <TweakToggle
            label="오프라인 시뮬레이션"
            value={t.offline}
            onChange={(v) => setTweak("offline", v)}
          />
          <TweakButton label="⌘K 명령 팔레트 열기" onClick={() => setCmdkOpen(true)} />
          <TweakButton label="CSV 가져오기 시작" onClick={() => setCsvOpen(true)} />
        </TweakSection>
        <TweakSection label="토스트 데모">
          <ToastDemoButtons />
        </TweakSection>
        <TweakSection label="사이트">
          <TweakSelect
            label="활성 사이트"
            value={siteId}
            options={SITES.map((s) => ({ value: s.id, label: s.name }))}
            onChange={(v) => setSiteId(v)}
          />
        </TweakSection>
      </TweaksPanel>
    </ToastProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

const ToastDemoButtons = () => {
  const toast = useToast();
  return (
    <>
      <TweakButton label="성공 — 발행 완료" onClick={() => toast({ tone: "success", message: "발행이 완료되었습니다 — 사이트에 곧 반영됩니다" })} />
      <TweakButton label="실패 — 배포 권한" onClick={() => toast({ tone: "error", message: "발행에 실패했습니다 — 배포 권한을 확인해 주세요" })} />
      <TweakButton label="주의 — 드래프트 확인" onClick={() => toast({ tone: "warning", message: "발행되지 않은 변경사항 3건이 있습니다" })} />
      <TweakButton label="안내 — 시스템 알림" onClick={() => toast({ tone: "info", message: "5월 23일 자정 새 어드민 버전으로 업데이트됩니다" })} />
      <TweakButton label="4개 동시" onClick={() => {
        const map = { success: "발행 완료 — dohwawon.kr", error: "이미지 업로드 실패 — 8MB 초과", warning: "드래프트 확인 필요 (3건)", info: "예약 발행 5분 후 시작" };
        ["success","error","warning","info"].forEach((tone, i) => setTimeout(() => toast({ tone, message: map[tone] }), i * 280));
      }} />
    </>
  );
};
Object.assign(window, { ToastDemoButtons });
