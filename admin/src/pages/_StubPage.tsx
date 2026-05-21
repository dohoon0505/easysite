/**
 * StubPage — 신규 디자인 도입 직후의 임시 placeholder.
 * 디자이너 인계 페이지(page-*.jsx) 본문 포팅은 후속 작업.
 */
import { Badge, Card, Icon } from "@/components";

interface StubPageProps {
  title: string;
  subtitle?: string;
  icon: string;
  note?: string;
}

export function StubPage({ title, subtitle, icon, note }: StubPageProps) {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <div className="page-subtitle">{subtitle}</div>}
        </div>
      </div>
      <Card>
        <div className="card-body">
          <div className="empty">
            <div className="empty-icon">
              <Icon name={icon} size={26} />
            </div>
            <div className="empty-title">
              {title} <Badge tone="warning" style={{ marginLeft: 8 }}>준비 중</Badge>
            </div>
            <p className="empty-desc">
              {note ?? "디자이너 인계 페이지를 새 골조에 포팅 중입니다. 다음 단계에서 Firebase 데이터와 함께 연결됩니다."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
