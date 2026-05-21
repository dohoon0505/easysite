/**
 * HomeSection — 사이트의 홈(랜딩) 섹션 편집.
 *
 * placeholder 버전. 실제 필드 스펙은 디자이너 인계 결과를 받은 후 확정한다.
 * 저장 경로: sites/{siteId}.homeSection (subdoc 으로 후속 분리 가능).
 *
 * 현재 가정 필드:
 *  - heroTitle: 메인 헤드라인
 *  - heroSubtitle: 보조 카피
 *  - heroImagePath: 히어로 이미지 (Storage 경로, M5 publish 시 git 으로 복사 예정)
 *  - introParagraph: 인사말 / 매장 소개 단락
 *  - ctaText: CTA 버튼 라벨 (예: "주문 문의")
 *  - ctaUrl: CTA 링크 (예: tel://, https://, kakao://)
 *
 * 디자이너 결과가 들어오면 이 페이지의 필드 구성을 통째로 교체할 수 있다.
 */
import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Badge, Button, Card, FormField, TextField } from "@/components";
import { db } from "@/lib/firebase";
import { useAuth, useIsSuper } from "@/state/authStore";
import { toast } from "@/state/toastStore";

interface HomeSectionData {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImagePath?: string;
  introParagraph?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function HomeSection() {
  const siteId = useAuth((s) => s.claims?.siteId);
  const isSuper = useIsSuper();
  const [data, setData] = useState<HomeSectionData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!siteId) {
      setLoading(false);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "sites", siteId));
        if (!mounted) return;
        const site = snap.data();
        setData((site?.homeSection as HomeSectionData) ?? {});
      } catch (e) {
        toast.danger((e as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [siteId]);

  if (!siteId) {
    return (
      <Card>
        <h1 style={{ font: "var(--text-heading-md)", marginBottom: 8 }}>홈 섹션</h1>
        <p style={{ font: "var(--text-body-md)", color: "var(--sm-content-secondary)" }}>
          {isSuper
            ? "슈퍼 어드민은 사이트별 작업을 좌측 메뉴로 진입하세요."
            : "사이트가 지정되지 않았습니다. 슈퍼 어드민에게 권한 부여를 요청하세요."}
        </p>
      </Card>
    );
  }

  const onChange = (field: keyof HomeSectionData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const onSave = async () => {
    if (!siteId) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "sites", siteId), {
        homeSection: data,
        updatedAt: serverTimestamp(),
      });
      toast.success("홈 섹션 저장 완료. 사이트 반영은 '발행' 단계 필요.");
    } catch (e) {
      toast.danger((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Card>불러오는 중…</Card>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 88 }}>
      <header>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1 style={{ font: "var(--text-heading-md)" }}>홈 섹션</h1>
          <Badge tone="warning">재설계 대기 중 (placeholder)</Badge>
        </div>
        <p
          style={{
            font: "var(--text-body-sm)",
            color: "var(--sm-content-secondary)",
            marginTop: 8,
          }}
        >
          사이트 첫 화면의 히어로·인사말·CTA 를 관리합니다. 디자이너 인계 결과에 따라
          필드 구성이 곧 교체될 예정입니다.
        </p>
      </header>

      <Card density="default">
        <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 12 }}>히어로</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <FormField label="메인 헤드라인" helpText="예: 도화원플라워 — 마음을 전하는 꽃">
            <TextField
              value={data.heroTitle ?? ""}
              onChange={onChange("heroTitle")}
              placeholder="메인 헤드라인을 입력"
            />
          </FormField>
          <FormField label="보조 카피" helpText="히어로 아래 한 줄 설명">
            <TextField
              value={data.heroSubtitle ?? ""}
              onChange={onChange("heroSubtitle")}
              placeholder="짧은 보조 문구"
            />
          </FormField>
          <FormField
            label="히어로 이미지 경로"
            helpText="현재는 텍스트 입력만. 업로드 UI는 디자이너 결과 반영 시 추가."
          >
            <TextField
              value={data.heroImagePath ?? ""}
              onChange={onChange("heroImagePath")}
              placeholder="img/hero.jpg"
            />
          </FormField>
        </div>
      </Card>

      <Card density="default">
        <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 12 }}>인사말 / 소개</h2>
        <FormField label="인사말 단락">
          <textarea
            value={data.introParagraph ?? ""}
            onChange={onChange("introParagraph")}
            className="tf-input"
            rows={6}
            placeholder="매장 소개·취급 상품·운영 시간 등을 자유롭게"
            style={{ resize: "vertical", minHeight: 120 }}
          />
        </FormField>
      </Card>

      <Card density="default">
        <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 12 }}>CTA</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <FormField label="버튼 라벨">
            <TextField
              value={data.ctaText ?? ""}
              onChange={onChange("ctaText")}
              placeholder="주문 문의"
            />
          </FormField>
          <FormField
            label="버튼 링크"
            helpText="전화: tel:01012345678, 카톡: https://pf.kakao.com/_..., 외부 URL 가능"
          >
            <TextField
              value={data.ctaUrl ?? ""}
              onChange={onChange("ctaUrl")}
              placeholder="tel:01012345678"
            />
          </FormField>
        </div>
      </Card>

      <Card density="default">
        <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 8 }}>참고</h2>
        <ul
          style={{
            font: "var(--text-body-sm)",
            color: "var(--sm-content-secondary)",
            paddingLeft: 20,
            margin: 0,
          }}
        >
          <li>저장 후에도 '발행' 단계가 있어야 실제 사이트에 반영됩니다.</li>
          <li>publishToGitHub 함수는 현재 상품/카테고리만 다룹니다. 홈 섹션 발행 로직은 디자이너 결과 후 추가됩니다.</li>
          <li>필드는 placeholder 입니다. 디자이너의 와이어/디자인이 도착하면 이 페이지 전체가 재구성됩니다.</li>
        </ul>
      </Card>

      <div className="sticky-action-bar">
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button
            type="button"
            variant="primary"
            size="md"
            loading={saving}
            onClick={() => void onSave()}
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
