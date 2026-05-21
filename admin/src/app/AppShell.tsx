/**
 * AppShell — 인증 후 모든 페이지를 감싸는 레이아웃.
 *
 * 데스크톱: TopAppBar + 좌측 NavBar + 우측 콘텐츠
 * 모바일: TopAppBar + 하단 TabBar + 콘텐츠
 */
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Badge,
  NavBar,
  TabBar,
  TopAppBar,
  type NavGroup,
  type TabItem,
} from "@/components";
import {
  FolderIcon,
  HomeIcon,
  LogoutIcon,
  PackageIcon,
  SendIcon,
  SettingsIcon,
  UsersIcon,
} from "@/components/icons";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { signOut } from "@/lib/auth";
import { useAuth, useIsSuper } from "@/state/authStore";

export function AppShell() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuth((s) => s.user);
  const claims = useAuth((s) => s.claims);
  const isSuper = useIsSuper();
  const active = location.pathname;

  const isActive = (p: string) =>
    p === "/" ? active === "/" : active.startsWith(p);

  // ── 사이드바 그룹 ─────────────────────────────────
  const groups: NavGroup[] = [
    {
      title: "사이트 관리",
      items: [
        { id: "home", label: "홈 섹션", icon: <HomeIcon size={18} />, active: isActive("/"), onClick: () => navigate("/") },
        { id: "products", label: "상품 목록", icon: <PackageIcon size={18} />, active: isActive("/products"), onClick: () => navigate("/products") },
        { id: "categories", label: "카테고리", icon: <FolderIcon size={18} />, active: isActive("/categories"), onClick: () => navigate("/categories") },
        { id: "publish", label: "발행", icon: <SendIcon size={18} />, active: isActive("/publish"), onClick: () => navigate("/publish") },
      ],
    },
    {
      title: "계정",
      items: [
        { id: "account", label: "계정 설정", icon: <SettingsIcon size={18} />, active: isActive("/account"), onClick: () => navigate("/account") },
      ],
    },
  ];
  if (isSuper) {
    groups.push({
      title: "슈퍼 어드민",
      items: [
        { id: "users", label: "사용자 관리", icon: <UsersIcon size={18} />, active: isActive("/super/users"), onClick: () => navigate("/super/users") },
      ],
    });
  }

  // ── 모바일 탭바 (4개 핵심) ───────────────────────
  const tabs: TabItem[] = [
    { id: "home", label: "홈 섹션", icon: <HomeIcon size={22} />, active: isActive("/"), onClick: () => navigate("/") },
    { id: "products", label: "상품", icon: <PackageIcon size={22} />, active: isActive("/products"), onClick: () => navigate("/products") },
    { id: "categories", label: "카테고리", icon: <FolderIcon size={22} />, active: isActive("/categories"), onClick: () => navigate("/categories") },
    { id: "publish", label: "발행", icon: <SendIcon size={22} />, active: isActive("/publish"), onClick: () => navigate("/publish") },
  ];

  const siteLabel = claims?.siteId ?? (isSuper ? "전체 사이트" : "사이트 미지정");

  return (
    <div
      style={{
        display: isMobile ? "block" : "grid",
        gridTemplateColumns: isMobile ? undefined : "240px 1fr",
        minHeight: "100vh",
      }}
    >
      {!isMobile && <NavBar groups={groups} />}

      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopAppBar
          title="easysite 어드민"
          subtitle={user?.email ?? undefined}
          trailing={
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Badge tone={isSuper ? "brand" : "neutral"}>{siteLabel}</Badge>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => void signOut()}
                aria-label="로그아웃"
              >
                <LogoutIcon size={18} />
                <span className="show-on-desktop">로그아웃</span>
              </button>
            </div>
          }
        />

        <main
          style={{
            flex: 1,
            padding: isMobile ? "16px 12px 72px 12px" : "24px",
            maxWidth: isMobile ? "100%" : 1280,
            width: "100%",
            margin: isMobile ? 0 : "0 auto",
          }}
        >
          <Outlet />
        </main>
      </div>

      {isMobile && <TabBar items={tabs} />}
    </div>
  );
}
