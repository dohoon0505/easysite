/* eslint-disable */
// 홈 섹션 편집 미리보기 — 폰 베젤 안에 라이브 사이트를 iframe 으로 렌더.
// 디자인 단계의 mock 섹션 렌더러는 실제 사이트와 어긋났기 때문에 폐기,
// 발행된 콘텐츠를 그대로 보여주는 방식으로 전환했다.
// 편집 중인 draft 는 발행 후 반영된다(아래 안내 문구 참조).

const HomePreview = ({ siteId }) => {
  const url = (typeof window.liveSiteUrl === "function" ? window.liveSiteUrl(siteId) : "") || "about:blank";
  const [reloadKey, setReloadKey] = React.useState(0);

  return (
    <div style={{ position: "relative" }}>
      {/* Phone bezel */}
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
        {/* notch */}
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
          {/* status bar — 폰 느낌만 부여, 콘텐츠는 iframe */}
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
              key={reloadKey}
              title={`${siteId} 라이브 미리보기`}
              src={url}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin"
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
          현재 발행된 사이트를 표시 · 편집은 발행 후 반영됩니다
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
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
