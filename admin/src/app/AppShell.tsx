/**
 * AppShell — sidebar + topbar + outlet.
 *
 * Designer-delivered layout:
 *  - 248px left sidebar with brand, site switcher, grouped nav, user footer
 *  - Sticky top bar with breadcrumbs, search, "사이트 열기" + "발행" actions
 *  - Page content via React Router <Outlet>
 *
 * Below 1100px the sidebar collapses to a 72px icon rail (CSS-driven).
 */
import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Icon,
  IconButton,
  Input,
  Modal,
  Button,
} from "@/components";
import { signOut } from "@/lib/auth";
import { useAuth, useIsSuper } from "@/state/authStore";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  to: string;
  count?: number;
  badge?: number;
}
interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS_BASE: NavGroup[] = [
  {
    title: "사이트 운영",
    items: [
      { id: "home", label: "홈 섹션 편집", icon: "home", to: "/" },
      { id: "products", label: "상품", icon: "box", to: "/products" },
      { id: "categories", label: "카테고리", icon: "tag", to: "/categories" },
      { id: "publish", label: "발행 센터", icon: "rocket", to: "/publish" },
    ],
  },
  {
    title: "내 계정",
    items: [
      { id: "account", label: "계정 설정", icon: "user", to: "/account" },
      { id: "audit", label: "변경 이력", icon: "clock", to: "/audit" },
    ],
  },
];

const NAV_GROUPS_SUPER: NavGroup = {
  title: "슈퍼",
  items: [
    { id: "users", label: "사용자 관리", icon: "users", to: "/super/users" },
    { id: "sites", label: "사이트 관리", icon: "grid", to: "/super/sites" },
  ],
};

const ROUTE_LABELS: Record<string, string[]> = {
  "/": ["홈 섹션 편집"],
  "/products": ["상품"],
  "/products/new": ["상품", "새 상품"],
  "/categories": ["카테고리"],
  "/publish": ["발행 센터"],
  "/account": ["내 계정", "계정 설정"],
  "/audit": ["내 계정", "변경 이력"],
  "/super/users": ["슈퍼", "사용자 관리"],
  "/super/sites": ["슈퍼", "사이트 관리"],
};

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuth((s) => s.user);
  const claims = useAuth((s) => s.claims);
  const isSuper = useIsSuper();

  const [showSiteSwitcher, setShowSiteSwitcher] = useState(false);

  const groups: NavGroup[] = useMemo(() => {
    return isSuper ? [...NAV_GROUPS_BASE, NAV_GROUPS_SUPER] : NAV_GROUPS_BASE;
  }, [isSuper]);

  // Apply data-theme/accent/density on html (defaults; Tweaks panel can override)
  useEffect(() => {
    const html = document.documentElement;
    if (!html.getAttribute("data-theme")) html.setAttribute("data-theme", "light");
    if (!html.getAttribute("data-accent")) html.setAttribute("data-accent", "navy");
    if (!html.getAttribute("data-density")) html.setAttribute("data-density", "comfortable");
  }, []);

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname === to || location.pathname.startsWith(to + "/");
  };

  const crumbs = useMemo(() => {
    const siteName = claims?.siteId ?? (isSuper ? "전체 사이트" : "사이트 미지정");
    const baseCrumbs = ROUTE_LABELS[location.pathname];
    let pageCrumbs: string[];
    if (baseCrumbs) {
      pageCrumbs = baseCrumbs;
    } else if (location.pathname.startsWith("/products/")) {
      pageCrumbs = ["상품", "수정"];
    } else {
      pageCrumbs = ["—"];
    }
    return ["easysite", siteName, ...pageCrumbs];
  }, [location.pathname, claims?.siteId, isSuper]);

  const userName = user?.displayName || user?.email?.split("@")[0] || "운영자";
  const userInitial = userName.charAt(0);
  const userRole = claims?.role === "super" ? "슈퍼" : claims?.role === "owner" ? "오너" : "에디터";
  const siteLabel = claims?.siteId ?? "사이트 미지정";

  return (
    <>
      <div className="app">
        <aside className="sidebar" aria-label="네비게이션">
          <div className="brand">
            <div className="brand-mark">e</div>
            <div>
              <div className="brand-name">easysite</div>
              <div className="brand-sub">admin console</div>
            </div>
          </div>

          <div
            className="site-switcher"
            onClick={() => setShowSiteSwitcher(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") setShowSiteSwitcher(true);
            }}
          >
            <div
              className="site-thumb"
              style={{ background: "linear-gradient(135deg, #f4c8d0 0%, #d36a8a 100%)" }}
            />
            <div className="site-meta">
              <div className="site-name">{siteLabel}</div>
              <div className="site-status">
                <span className="live-dot" />
                {claims?.siteId ? `${claims.siteId} (활성)` : "사이트 선택 필요"}
              </div>
            </div>
            <Icon name="chevronDown" size={16} className="caret" />
          </div>

          {groups.map((group) => (
            <div className="nav-group" key={group.title}>
              <div className="nav-label">{group.title}</div>
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className={`nav-item ${isActive(item.to) ? "active" : ""}`}
                  onClick={() => navigate(item.to)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") navigate(item.to);
                  }}
                >
                  <Icon name={item.icon} size={18} className="nav-icon" />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className="nav-count">{item.count}</span>
                  )}
                </div>
              ))}
            </div>
          ))}

          <div className="sidebar-footer">
            <div className="avatar">{userInitial}</div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-role">
                {userRole}
                {claims?.siteId && ` · ${claims.siteId}`}
              </div>
            </div>
            <IconButton icon="logout" onClick={() => void signOut()} aria-label="로그아웃" />
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div className="crumbs">
              {crumbs.map((c, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "var(--size-200)" }}>
                  {i > 0 && <Icon name="chevronRight" size={12} className="crumb-sep" />}
                  <span className={i === crumbs.length - 1 ? "crumb-current" : ""}>{c}</span>
                </span>
              ))}
            </div>
            <div className="topbar-actions">
              <div style={{ position: "relative", width: 280 }}>
                <Input prefix="search" placeholder="상품·카테고리 검색…" style={{ width: "100%" }} />
              </div>
              <IconButton icon="bell" bordered />
              <Button variant="outline" iconLeft="link" onClick={() => window.open("/", "_blank")}>
                사이트 열기
              </Button>
              <Button variant="primary" iconLeft="rocket" onClick={() => navigate("/publish")}>
                발행
              </Button>
            </div>
          </header>

          <Outlet />
        </main>
      </div>

      <SiteSwitcherModal
        open={showSiteSwitcher}
        onClose={() => setShowSiteSwitcher(false)}
        currentSiteId={claims?.siteId ?? null}
      />
    </>
  );
}

interface SiteSwitcherModalProps {
  open: boolean;
  onClose: () => void;
  currentSiteId: string | null;
}

const KNOWN_SITES = [
  { id: "dohwawon", name: "도화원플라워", domain: "dohwawon.kr", gradient: "linear-gradient(135deg, #f4c8d0 0%, #d36a8a 100%)" },
  { id: "bell_cake", name: "벨케이크", domain: "bellcake.kr", gradient: "linear-gradient(135deg, #f0e3c2 0%, #c9a567 100%)" },
  { id: "PARKHAD", name: "PARKHAD", domain: "parkhad.com", gradient: "linear-gradient(135deg, #c9cad0 0%, #1a1d24 100%)" },
  { id: "flower_example", name: "flower_example", domain: "flower-example.kr", gradient: "linear-gradient(135deg, #d8e6cf 0%, #7ba88a 100%)" },
  { id: "greenlight_art", name: "풀빛그림아이", domain: "greenlightart.kr", gradient: "linear-gradient(135deg, #ffd4a8 0%, #5e8edb 60%, #b58be8 100%)" },
];

function SiteSwitcherModal({ open, onClose, currentSiteId }: SiteSwitcherModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="사이트 전환"
      desc="현재 권한은 로그인된 계정의 claim 으로 결정됩니다. 다른 사이트를 관리하려면 슈퍼 어드민에게 권한 부여를 요청하세요."
      size="md"
    >
      <div style={{ display: "grid", gap: "var(--size-200)" }}>
        {KNOWN_SITES.map((s) => {
          const active = s.id === currentSiteId;
          return (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--size-400)",
                padding: "var(--size-400)",
                background: active ? "var(--sm-interactive-brand-subtle)" : "transparent",
                border: `1px solid ${active ? "var(--sm-interactive-brand-default)" : "var(--sm-border-subtle)"}`,
                borderRadius: "var(--radius-md)",
                width: "100%",
              }}
            >
              <div
                className="site-thumb"
                style={{ background: s.gradient, width: 44, height: 44, borderRadius: "var(--radius-md)" }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: "var(--text-body-md)" }}>{s.name}</div>
                <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)", marginTop: 2 }}>
                  {s.domain} · {s.id}
                </div>
              </div>
              {active && (
                <Icon name="check" size={18} style={{ color: "var(--sm-interactive-brand-default)" }} />
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
