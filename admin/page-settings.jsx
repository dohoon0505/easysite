/* eslint-disable */
// S01 — 기본 정보 페이지.
// 전화번호 / 카카오 플러스친구 / OG 메타(타이틀·설명·이미지) 편집.
// sites/{siteId}/settings/info 단일 도큐먼트에 저장.

const SettingsPage = ({ siteId, site }) => {
  const session = typeof useAuthSession === "function" ? useAuthSession() : null;
  const isSuper = !!(session && session.claims && session.claims.role === "super");
  const [info, setInfo, loading] = (typeof useLiveSiteInfo === "function"
    ? useLiveSiteInfo(siteId)
    : [{}, () => {}, false]);
  const [syncing, setSyncing] = React.useState(false);
  const [phone, setPhone] = React.useState("");
  const [kakaoChannel, setKakaoChannel] = React.useState("");
  const [ogTitle, setOgTitle] = React.useState("");
  const [ogDescription, setOgDescription] = React.useState("");
  const [ogImage, setOgImage] = React.useState("");
  const [ogImageStoragePath, setOgImageStoragePath] = React.useState("");
  const [dirty, setDirty] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [uploadPct, setUploadPct] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const toast = useToast();

  React.useEffect(() => {
    if (loading) return;
    setPhone(info.phone || "");
    setKakaoChannel(info.kakaoChannel || "");
    setOgTitle(info.ogTitle || "");
    setOgDescription(info.ogDescription || "");
    setOgImage(info.ogImage || "");
    setOgImageStoragePath(info.ogImageStoragePath || "");
    setDirty(false);
  }, [loading, info.phone, info.kakaoChannel, info.ogTitle, info.ogDescription, info.ogImage, info.ogImageStoragePath]);

  const markDirty = () => setDirty(true);

  const onPickOgImage = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!siteId) { toast({ tone: "error", message: "사이트가 지정되지 않았습니다" }); return; }
    if (!window.uploadSectionImage) { toast({ tone: "error", message: "Storage 가 준비되지 않았습니다" }); return; }
    setUploading(true);
    setUploadPct(0);
    try {
      const res = await window.uploadSectionImage(siteId, "settings", "og", file, (p) => setUploadPct(p));
      setOgImage(res.downloadUrl);
      setOgImageStoragePath(res.storagePath);
      setDirty(true);
      toast({ tone: "success", message: `OG 이미지 업로드 완료 — ${res.filename}` });
    } catch (err) {
      toast({ tone: "error", message: `업로드 실패: ${err.message || err}` });
    } finally {
      setUploading(false);
      setUploadPct(0);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await setInfo({
        phone: phone.trim(),
        kakaoChannel: kakaoChannel.trim(),
        ogTitle: ogTitle.trim(),
        ogDescription: ogDescription.trim(),
        ogImage,
        ogImageStoragePath,
      });
      setDirty(false);
      toast({ tone: "success", message: "기본 정보를 저장했습니다 — 발행 시 사이트에 반영됩니다" });
    } catch (e) {
      toast({ tone: "error", message: `저장 실패: ${e.message || e}` });
    } finally {
      setSaving(false);
    }
  };

  const fileInputRef = React.useRef(null);

  const syncCurrent = async () => {
    if (!siteId || !window.seedSiteInfo) return;
    if (!confirm(`${(site && site.name) || siteId} 의 코드 베이스에 등록된 OG·전화·카카오 정보를 가져옵니다.\n이미 입력한 값이 있으면 덮어씁니다. 진행할까요?`)) return;
    try {
      setSyncing(true);
      await window.seedSiteInfo(siteId);
      toast({ tone: "success", message: "현재 사이트 정보를 가져왔습니다 — 발행 시 사이트에 반영됩니다" });
    } catch (e) {
      toast({ tone: "error", message: `동기화 실패: ${e.message || e}` });
    } finally {
      setSyncing(false);
    }
  };

  const syncAll = async () => {
    if (!window.seedAllSiteInfo) return;
    if (!confirm("5개 사이트 전부의 OG·전화·카카오 정보를 코드 베이스에서 가져옵니다.\n각 사이트의 기존 입력값을 덮어씁니다. 진행할까요?")) return;
    try {
      setSyncing(true);
      const results = await window.seedAllSiteInfo();
      const ok = Object.values(results).filter((r) => !r.error).length;
      const fail = Object.values(results).filter((r) => r.error).length;
      toast({ tone: fail === 0 ? "success" : "warning", message: `${ok}개 동기화 완료${fail > 0 ? `, ${fail}개 실패` : ""}` });
    } catch (e) {
      toast({ tone: "error", message: `동기화 실패: ${e.message || e}` });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">기본 정보</h1>
        </div>
        <div style={{ padding: 40, textAlign: "center", color: "var(--sm-content-tertiary)" }}>
          불러오는 중…
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">기본 정보</h1>
          <div className="page-subtitle">
            연락처와 검색·SNS 공유 시 보여지는 메타 정보를 관리합니다.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button variant="outline" iconLeft="refresh" onClick={syncCurrent} disabled={syncing}>
            {syncing ? "동기화 중…" : "현재 사이트 정보 가져오기"}
          </Button>
          {isSuper && (
            <Button variant="ghost" iconLeft="refresh" onClick={syncAll} disabled={syncing}>
              5개 사이트 일괄
            </Button>
          )}
          <Button variant="primary" iconLeft="save" onClick={save} disabled={!dirty || saving}>
            {saving ? "저장 중…" : dirty ? "변경사항 저장" : "저장됨"}
          </Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 440px", gap: "var(--size-400)", alignItems: "flex-start" }}>
        <div style={{ display: "grid", gap: "var(--size-400)" }}>
          <Card>
            <div className="card-header">
              <div>
                <h2 className="card-title">연락처</h2>
                <div className="card-subtitle">사이트 푸터·CTA 버튼에서 사용됩니다</div>
              </div>
            </div>
            <div className="card-body" style={{ display: "grid", gap: "var(--size-500)" }}>
              <Field label="전화번호" helper="예: 053-123-4567 — 사이트의 '전화 상담' 버튼 등에 연결됩니다">
                <Input
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); markDirty(); }}
                  placeholder="053-123-4567"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </Field>
              <Field label="카카오 플러스친구 링크" helper="예: https://pf.kakao.com/_xxx — 비워두면 버튼이 표시되지 않습니다">
                <Input
                  value={kakaoChannel}
                  onChange={(e) => { setKakaoChannel(e.target.value); markDirty(); }}
                  placeholder="https://pf.kakao.com/_abcde"
                  inputMode="url"
                  type="url"
                />
              </Field>
            </div>
          </Card>

          <Card>
            <div className="card-header">
              <div>
                <h2 className="card-title">OG 메타 (SNS 공유 미리보기)</h2>
                <div className="card-subtitle">카카오톡·페이스북·인스타그램에 사이트 링크를 공유할 때 표시됩니다</div>
              </div>
            </div>
            <div className="card-body" style={{ display: "grid", gap: "var(--size-500)" }}>
              <Field label="OG 타이틀" helper="공유 카드의 큰 제목. 비워두면 사이트명을 사용합니다">
                <Input
                  value={ogTitle}
                  onChange={(e) => { setOgTitle(e.target.value); markDirty(); }}
                  placeholder={(site && site.name) || "사이트 제목"}
                />
              </Field>
              <Field label="OG 설명" helper="공유 카드의 본문. 60자 내외 권장">
                <Textarea
                  value={ogDescription}
                  onChange={(e) => { setOgDescription(e.target.value); markDirty(); }}
                  placeholder="우리 매장을 짧게 소개해 주세요. (예: 도화동 골목 끝 작은 꽃집)"
                  rows={3}
                  maxLength={160}
                />
              </Field>
              <Field label="OG 이미지" helper="권장 1200×630px · JPG/PNG · 최대 10MB">
                {ogImage ? (
                  <div style={{ display: "flex", gap: "var(--size-300)", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 240,
                        height: 126,
                        backgroundImage: ogImage.startsWith("url(") ? ogImage : `url("${ogImage}")`,
                        backgroundColor: "var(--sm-background-muted)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--sm-border-subtle)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <Button variant="outline" size="sm" iconLeft="upload" onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={uploading}>
                        {uploading ? `업로드 중… ${uploadPct}%` : "이미지 교체"}
                      </Button>
                      <Button variant="ghost" size="sm" iconLeft="trash" onClick={() => { setOgImage(""); setOgImageStoragePath(""); markDirty(); }}>
                        제거
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      border: "2px dashed var(--sm-border-default)",
                      borderRadius: "var(--radius-md)",
                      padding: "var(--size-600)",
                      textAlign: "center",
                      background: "var(--sm-background-subtle)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "var(--size-300)",
                    }}
                  >
                    <Icon name="image" size={28} style={{ color: "var(--sm-content-tertiary)" }} />
                    <div style={{ fontSize: 13, color: "var(--sm-content-tertiary)" }}>1200×630px JPG/PNG 권장</div>
                    <Button variant="secondary" iconLeft="upload" onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={uploading}>
                      {uploading ? `업로드 중… ${uploadPct}%` : "이미지 업로드"}
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onPickOgImage}
                  style={{ display: "none" }}
                />
              </Field>
            </div>
          </Card>
        </div>

        {/* OG 미리보기 */}
        <div style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: "var(--size-400)" }}>
          <div style={{ fontSize: "var(--text-label-md)", fontWeight: 600, color: "var(--sm-content-tertiary)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            카카오톡 공유 미리보기
          </div>
          <div style={{ background: "#abc1d1", padding: 24, borderRadius: "var(--radius-md)" }}>
            <div style={{ background: "white", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>
              <div
                style={{
                  aspectRatio: "1.91 / 1",
                  backgroundImage: ogImage ? (ogImage.startsWith("url(") ? ogImage : `url("${ogImage}")`) : undefined,
                  backgroundColor: "var(--sm-background-muted)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!ogImage && (
                  <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "var(--sm-content-tertiary)", fontSize: 12 }}>
                    OG 이미지 업로드 시 여기에 표시
                  </div>
                )}
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>
                  {site && site.domain ? site.domain : "easysite.kr"}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#222", lineHeight: 1.35, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {ogTitle || (site && site.name) || "사이트 제목"}
                </div>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {ogDescription || "사이트 설명을 입력해 주세요"}
                </div>
              </div>
            </div>
          </div>

          <Card>
            <div className="card-body" style={{ fontSize: 13, color: "var(--sm-content-secondary)", lineHeight: 1.6 }}>
              <div style={{ fontWeight: 600, color: "var(--sm-content-primary)", marginBottom: 6 }}>발행 후 반영</div>
              저장한 정보는 <strong>발행 센터에서 발행</strong>하면 사이트의 메타 태그·푸터·CTA 버튼에 반영됩니다. 발행 전엔 라이브 사이트에는 보이지 않습니다.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { SettingsPage });
