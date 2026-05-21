/* eslint-disable */
// C01 — 카테고리 관리 with real HTML5 drag-and-drop

const CategoriesRealPage = () => {
  const [items, setItems] = React.useState(
    CATEGORIES.filter((c) => c.id !== "all").map((c) => ({ ...c, visible: true }))
  );
  const [dragId, setDragId] = React.useState(null);
  const [overId, setOverId] = React.useState(null);
  const [editing, setEditing] = React.useState(null);
  const [editValue, setEditValue] = React.useState("");
  const toast = useToast();

  const onDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };
  const onDragOver = (e, id) => {
    e.preventDefault();
    if (id !== dragId) setOverId(id);
  };
  const onDrop = (e, id) => {
    e.preventDefault();
    if (!dragId || dragId === id) return;
    const from = items.findIndex((x) => x.id === dragId);
    const to = items.findIndex((x) => x.id === id);
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    setDragId(null);
    setOverId(null);
    toast({ tone: "success", message: "순서를 변경했습니다 — 드래프트" });
  };
  const onDragEnd = () => {
    setDragId(null);
    setOverId(null);
  };

  const startEdit = (item) => {
    setEditing(item.id);
    setEditValue(item.name);
  };
  const commitEdit = () => {
    if (!editValue.trim()) return setEditing(null);
    setItems((it) => it.map((x) => (x.id === editing ? { ...x, name: editValue.trim() } : x)));
    setEditing(null);
    toast({ tone: "success", message: "이름을 변경했습니다 — 드래프트" });
  };

  const toggleVisible = (id) => {
    setItems((it) => it.map((x) => (x.id === id ? { ...x, visible: !x.visible } : x)));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">카테고리</h1>
          <div className="page-subtitle">
            드래그로 순서 변경 · 클릭으로 이름 편집 · 토글로 표시/숨김
          </div>
        </div>
        <div className="page-actions">
          <Button variant="primary" iconLeft="plus">카테고리 추가</Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "var(--size-500)" }}>
        <Card>
          <div className="card-header">
            <h2 className="card-title">{items.length}개 카테고리</h2>
            <Badge tone="warning" dot>3건 드래프트</Badge>
          </div>
          <div style={{ padding: "var(--size-300)" }}>
            <div className="drag-list">
              {items.map((c, i) => (
                <div
                  key={c.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, c.id)}
                  onDragOver={(e) => onDragOver(e, c.id)}
                  onDrop={(e) => onDrop(e, c.id)}
                  onDragEnd={onDragEnd}
                  className={`drag-item ${dragId === c.id ? "dragging" : ""} ${overId === c.id && dragId !== c.id ? "drag-over" : ""}`}
                  style={{ opacity: c.visible ? 1 : 0.55 }}
                >
                  <Icon name="drag" size={16} style={{ color: "var(--sm-content-disabled)", cursor: "grab" }} />
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "var(--radius-sm)",
                      background: "var(--sm-interactive-brand-subtle)",
                      color: "var(--sm-interactive-brand-default)",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {editing === c.id ? (
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit();
                          if (e.key === "Escape") setEditing(null);
                        }}
                        style={{
                          width: "100%",
                          border: "1px solid var(--sm-border-focus)",
                          borderRadius: "var(--radius-sm)",
                          padding: "4px 8px",
                          fontSize: "var(--text-body-md)",
                          fontWeight: 600,
                          outline: "none",
                        }}
                      />
                    ) : (
                      <button
                        onDoubleClick={() => startEdit(c)}
                        onClick={() => startEdit(c)}
                        style={{
                          fontWeight: 600,
                          fontSize: "var(--text-body-md)",
                          color: "var(--sm-content-primary)",
                          textAlign: "left",
                          background: "transparent",
                          padding: 0,
                        }}
                      >
                        {c.name}
                      </button>
                    )}
                    <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)" }}>
                      상품 {c.count}개 · {c.visible ? "노출" : "숨김"}
                    </div>
                  </div>
                  <Toggle checked={c.visible} onChange={() => toggleVisible(c.id)} />
                  <IconButton icon="edit" onClick={() => startEdit(c)} />
                  <IconButton icon="trash" />
                </div>
              ))}
              {/* Add row */}
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--size-300)",
                  padding: "var(--size-400)",
                  border: "1px dashed var(--sm-border-default)",
                  borderRadius: "var(--radius-md)",
                  background: "transparent",
                  color: "var(--sm-content-secondary)",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <Icon name="plus" size={16} /> 새 카테고리 추가
              </button>
            </div>
          </div>
        </Card>

        <div style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: "var(--size-400)" }}>
          <Card>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--sm-status-info-subtle)", color: "var(--sm-status-info)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon name="info" size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>드래그 사용 방법</div>
                  <div style={{ fontSize: 13, color: "var(--sm-content-secondary)", lineHeight: 1.55 }}>
                    각 카테고리를 잡고 위/아래로 끌어 놓으면 순서가 바뀝니다. 변경된 순서는 자동으로 드래프트에 저장되며 발행해야 사이트에 반영됩니다.
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="card-body">
              <div style={{ fontSize: "var(--text-overline)", fontWeight: 600, color: "var(--sm-content-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                사이트에서는 이렇게 보여요
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {items.filter((c) => c.visible).map((c) => (
                  <span
                    key={c.id}
                    style={{
                      padding: "6px 12px",
                      background: "var(--sm-background-subtle)",
                      border: "1px solid var(--sm-border-subtle)",
                      borderRadius: "var(--radius-full)",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--sm-content-secondary)",
                    }}
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CategoriesRealPage });
