/* eslint-disable */
// ⌘K Command Palette — global search across screens, products, actions

const COMMAND_GROUPS = [
  {
    id: "actions",
    label: "빠른 작업",
    items: [
      { id: "new-product", label: "새 상품 등록", icon: "plus", hint: "P02", route: "editor.new", keywords: "신규 등록 추가 add new product" },
      { id: "bulk-price", label: "시즌 가격 일괄 조정", icon: "bolt", hint: "꽃집 시즌", action: "bulk-price", keywords: "bulk price 일괄 가격 인상 시즌" },
      { id: "publish", label: "지금 발행", icon: "rocket", hint: "PB01", route: "publish", keywords: "publish deploy 발행 배포" },
      { id: "invite", label: "사용자 초대", icon: "users", hint: "S01 (슈퍼)", route: "users", keywords: "invite user 사용자 초대" },
    ],
  },
  {
    id: "navigate",
    label: "이동",
    items: [
      { id: "go-home", label: "홈 섹션 편집", icon: "home", hint: "H01", route: "home" },
      { id: "go-products", label: "상품 목록", icon: "box", hint: "P01", route: "products" },
      { id: "go-categories", label: "카테고리", icon: "tag", hint: "C01", route: "categories" },
      { id: "go-publish", label: "발행 센터", icon: "rocket", hint: "PB01", route: "publish" },
      { id: "go-audit", label: "변경 이력", icon: "clock", hint: "S03", route: "audit" },
      { id: "go-users", label: "사용자 관리", icon: "users", hint: "S01", route: "users" },
      { id: "go-sites", label: "사이트 관리", icon: "grid", hint: "S02", route: "sites" },
      { id: "go-account", label: "계정 설정", icon: "user", hint: "A01", route: "account" },
    ],
  },
];

const CommandPalette = ({ open, onClose, products, sites, currentSiteId, onNav, onSwitchSite, onBulkPrice, onCreate }) => {
  const [query, setQuery] = React.useState("");
  const [activeIdx, setActiveIdx] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Build combined item list
  const allItems = React.useMemo(() => {
    const items = [];
    COMMAND_GROUPS.forEach((g) => {
      g.items.forEach((it) => items.push({ ...it, group: g.label, type: "command" }));
    });
    products.slice(0, 12).forEach((p) => {
      items.push({
        id: `prod-${p.id}`,
        label: p.name,
        sub: `${p.categoryName} · ${p.price.toLocaleString()}원${p.draft ? " · 드래프트" : ""}`,
        icon: "box",
        type: "product",
        group: "상품",
        keywords: `${p.name} ${p.categoryName} ${p.tags?.join(" ") || ""}`,
        productId: p.id,
        image: p.image,
        draft: p.draft,
      });
    });
    sites.forEach((s) => {
      items.push({
        id: `site-${s.id}`,
        label: `사이트 전환 — ${s.name}`,
        sub: `${s.domain}${s.id === currentSiteId ? " (현재)" : ""}`,
        type: "site",
        group: "사이트",
        keywords: `${s.name} ${s.domain} site switch`,
        siteId: s.id,
        gradient: s.gradient,
      });
    });
    return items;
  }, [products, sites, currentSiteId]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter((it) => {
      return (
        it.label?.toLowerCase().includes(q) ||
        it.keywords?.toLowerCase().includes(q) ||
        it.sub?.toLowerCase().includes(q)
      );
    });
  }, [query, allItems]);

  // Group filtered
  const grouped = React.useMemo(() => {
    const map = {};
    filtered.forEach((it) => {
      const g = it.group;
      if (!map[g]) map[g] = [];
      map[g].push(it);
    });
    return Object.entries(map);
  }, [filtered]);

  React.useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const execute = (item) => {
    if (item.type === "product") {
      onNav("editor", item.productId);
    } else if (item.type === "site") {
      onSwitchSite(item.siteId);
    } else if (item.action === "bulk-price") {
      onBulkPrice();
    } else if (item.route === "editor.new") {
      onCreate();
    } else if (item.route) {
      onNav(item.route);
    }
    onClose();
  };

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(filtered.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[activeIdx]) execute(filtered[activeIdx]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIdx]);

  // Global ⌘K listener mounted by parent

  if (!open) return null;

  let runningIdx = -1;

  return (
    <div className="cmdk-backdrop" onClick={onClose}>
      <div className="cmdk-palette" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="cmdk-search">
          <Icon name="search" size={18} style={{ color: "var(--sm-content-tertiary)" }} />
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="상품·화면·작업 검색…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="kbd">ESC</span>
        </div>

        <div className="cmdk-results">
          {filtered.length === 0 ? (
            <div className="cmdk-empty">
              <Icon name="search" size={24} style={{ color: "var(--sm-content-tertiary)", marginBottom: 8 }} />
              <div style={{ fontWeight: 600, marginBottom: 4 }}>"{query}"에 해당하는 결과가 없어요</div>
              <div style={{ fontSize: 12, color: "var(--sm-content-tertiary)" }}>
                상품명, 화면 이름, 또는 작업 이름을 입력해 보세요
              </div>
            </div>
          ) : (
            grouped.map(([groupLabel, items]) => (
              <div key={groupLabel} className="cmdk-group">
                <div className="cmdk-group-label">{groupLabel}</div>
                {items.map((it) => {
                  runningIdx += 1;
                  const idx = runningIdx;
                  const active = idx === activeIdx;
                  return (
                    <button
                      key={it.id}
                      className={`cmdk-item ${active ? "active" : ""}`}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => execute(it)}
                    >
                      {it.type === "product" ? (
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "var(--radius-sm)",
                            background: it.image,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            flexShrink: 0,
                          }}
                        />
                      ) : it.type === "site" ? (
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "var(--radius-sm)",
                            background: it.gradient,
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div className="cmdk-icon">
                          <Icon name={it.icon} size={15} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                        <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {it.label}
                          {it.draft && (
                            <span style={{ marginLeft: 8 }}>
                              <Badge tone="warning" dot>드래프트</Badge>
                            </span>
                          )}
                        </div>
                        {it.sub && (
                          <div style={{ fontSize: 12, color: "var(--sm-content-tertiary)", marginTop: 1 }}>
                            {it.sub}
                          </div>
                        )}
                      </div>
                      {it.hint && (
                        <span className="cmdk-hint">{it.hint}</span>
                      )}
                      {active && <Icon name="arrowRight" size={14} style={{ color: "var(--sm-content-tertiary)" }} />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="cmdk-footer">
          <div className="cmdk-foot-item">
            <kbd>↑</kbd><kbd>↓</kbd> 이동
          </div>
          <div className="cmdk-foot-item">
            <kbd>⏎</kbd> 선택
          </div>
          <div className="cmdk-foot-item">
            <kbd>ESC</kbd> 닫기
          </div>
          <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--sm-content-tertiary)" }}>
            <Icon name="sparkle" size={12} style={{ verticalAlign: "middle" }} /> AI 검색 곧 추가
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CommandPalette });
