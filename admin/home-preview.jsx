/* eslint-disable */
// 홈 섹션 편집 미리보기 — 폰 베젤 안에 라이브 사이트를 iframe 으로 렌더.
// 어드민이 sections 를 편집하면 postMessage 로 iframe 에 즉시 draft 를 보내고,
// 사이트 app.jsx 는 발행 전이라도 draft 데이터를 우선해 렌더한다.

const HomePreview = ({ siteId, sections }) => {
  const url = (typeof window.liveSiteUrl === "function" ? window.liveSiteUrl(siteId) : "") || "about:blank";
  const [reloadKey, setReloadKey] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const iframeRef = React.useRef(null);

  // 어드민 → iframe: sections 가 바뀔 때마다 draft 페이로드 전송.
  // iframe 이 아직 로드 전이면 ready 신호를 기다렸다가 전송.
  const sendDraft = React.useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    // 어드민 sections 의 draft 필드는 사이트에 불필요 — sectionId/type/data/enabled 만.
    // 데이터는 그대로 전달; 사이트의 unwrapUrl 헬퍼가 url("...") 형태도 처리한다.
    const sanitized = (sections || []).map((s) => ({
      id: s.id || s.sectionId,
      type: s.type,
      title: s.title || "",
      icon: s.icon || null,
      enabled: s.enabled !== false,
      data: s.data || {},
    }));
    try {
      iframe.contentWindow.postMessage({ type: "draftHomeSections", sections: sanitized }, "*");
    } catch (_) { /* 다른 origin 에 보낼 수 없는 경우 무시 */ }
  }, [sections]);

  // iframe 이 previewReady 를 알려오면 ready=true, 그리고 즉시 1차 draft 전송.
  React.useEffect(() => {
    const onMessage = (e) => {
      if (e && e.data && e.data.type === "previewReady") {
        setReady(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // sections 가 바뀌거나 ready 가 되면 새 draft 전송.
  React.useEffect(() => {
    if (ready) sendDraft();
  }, [ready, sendDraft]);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          background: "#1a1d24",
          padding: 12,
          borderRadius: 48,
          boxShadow: "var(--shadow-lg)",
          width: "100%",
          maxWidth: 400,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 90,
            height: 22,
            background: "#1a1d24",
            borderRadius: "0 0 14px 14px",
            zIndex: 2,
          }}
        />
        <div
          style={{
            background: "var(--sm-background-default)",
            borderRadius: 36,
            overflow: "hidden",
            position: "relative",
            height: 760,
          }}
        >
          <div
            style={{
              padding: "8px 18px 6px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--sm-content-primary)",
              background: "var(--sm-background-default)",
              zIndex: 2,
              position: "relative",
            }}
          >
            <span>9:41</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span>●●● </span>
            </span>
          </div>
          {siteId ? (
            <iframe
              ref={iframeRef}
              key={reloadKey}
              title={`${siteId} 라이브 미리보기`}
              src={url}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin"
              onLoad={() => {
                // 사이트의 useEffect 가 previewReady 를 보낼 때까지 약간의 지연 후 한번 더 시도.
                setTimeout(() => sendDraft(), 400);
              }}
              style={{
                width: "100%",
                height: "calc(100% - 30px)",
                border: 0,
                display: "block",
                background: "white",
              }}
            />
          ) : (
            <div style={{ padding: 24, textAlign: "center", color: "var(--sm-content-tertiary)", fontSize: 13 }}>
              사이트가 선택되지 않았습니다
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          marginTop: 14,
        }}
      >
        <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)" }}>
          {ready ? "편집 중 — 실시간 반영됩니다 · 발행해야 사이트에 저장됩니다" : "라이브 사이트를 불러오는 중…"}
        </div>
        <button
          type="button"
          onClick={() => { setReady(false); setReloadKey((k) => k + 1); }}
          style={{
            fontSize: 12,
            color: "var(--sm-content-tertiary)",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Icon name="refresh" size={12} /> 새로고침
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { HomePreview });
