/* eslint-disable */
// F01 — 질문/답변 관리.
// 카테고리 페이지와 동일한 2-컬럼 + drag-list 디자인.
// 운영자가 자주묻는질문 마스터를 관리한다. 홈 섹션의 FAQ 블록은 이 목록에서 골라 노출.

const FaqsPage = ({ siteId }) => {
  const [items, setItems] = (typeof useLiveFaqs === "function"
    ? useLiveFaqs(siteId)
    : [[], () => {}, false]);
  const [dragId, setDragId] = React.useState(null);
  const [overId, setOverId] = React.useState(null);
  const [openId, setOpenId] = React.useState(null); // 펼쳐서 답변 보기
  const [editing, setEditing] = React.useState(null); // {id?, question, answer, visible}
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
    setItems((prev) => {
      const from = prev.findIndex((x) => x.id === dragId);
      const to = prev.findIndex((x) => x.id === id);
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDragId(null);
    setOverId(null);
    toast({ tone: "success", message: "순서를 변경했습니다 — 드래프트" });
  };
  const onDragEnd = () => {
    setDragId(null);
    setOverId(null);
  };

  const openCreate = () => setEditing({ id: null, question: "", answer: "", visible: true });
  const openEdit = (item) => setEditing({ id: item.id, question: item.question, answer: item.answer, visible: item.visible });
  const close = () => setEditing(null);

  const save = () => {
    if (!editing.question.trim()) {
      toast({ tone: "warning", message: "질문을 입력해 주세요" });
      return;
    }
    if (!editing.answer.trim()) {
      toast({ tone: "warning", message: "답변을 입력해 주세요" });
      return;
    }
    if (editing.id) {
      setItems((prev) => prev.map((x) => (x.id === editing.id ? { ...x, question: editing.question.trim(), answer: editing.answer.trim(), visible: editing.visible } : x)));
      toast({ tone: "success", message: "수정했습니다 — 드래프트" });
    } else {
      const id = `faq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      setItems((prev) => [...prev, { id, question: editing.question.trim(), answer: editing.answer.trim(), sortOrder: prev.length * 10, visible: editing.visible }]);
      toast({ tone: "success", message: "질문을 추가했습니다 — 드래프트" });
    }
    close();
  };

  const remove = (id) => {
    if (!confirm("이 질문을 삭제할까요?")) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
    if (openId === id) setOpenId(null);
    toast({ tone: "info", message: "삭제했습니다 — 드래프트" });
  };

  const toggleVisible = (id) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, visible: !x.visible } : x)));
  };

  const visibleCount = items.filter((x) => x.visible).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">질문/답변</h1>
          <div className="page-subtitle">
            드래그로 순서 변경 · 클릭으로 답변 펼치기 · 토글로 표시/숨김
          </div>
        </div>
        <div className="page-actions">
          <Button variant="primary" iconLeft="plus" onClick={openCreate}>질문 추가</Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "var(--size-500)" }}>
        <Card>
          <div className="card-header">
            <h2 className="card-title">{items.length}개 질문</h2>
            <span className="text-tertiary" style={{ fontSize: 12 }}>{visibleCount}개 노출</span>
          </div>
          <div style={{ padding: "var(--size-300)" }}>
            <div className="drag-list">
              {items.map((f, i) => (
                <FaqDragItem
                  key={f.id}
                  item={f}
                  index={i}
                  dragId={dragId}
                  overId={overId}
                  open={openId === f.id}
                  onToggleOpen={() => setOpenId((v) => (v === f.id ? null : f.id))}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
                  onEdit={() => openEdit(f)}
                  onDelete={() => remove(f.id)}
                  onToggleVisible={() => toggleVisible(f.id)}
                />
              ))}

              {/* Add row — dashed */}
              <button
                onClick={openCreate}
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
                <Icon name="plus" size={16} /> 새 질문 추가
              </button>
            </div>
          </div>
        </Card>

        {/* Sidebar — tips + preview */}
        <div style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: "var(--size-400)" }}>
          <Card>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--sm-status-info-subtle)", color: "var(--sm-status-info)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon name="info" size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>이렇게 활용하세요</div>
                  <div style={{ fontSize: 13, color: "var(--sm-content-secondary)", lineHeight: 1.55 }}>
                    자주 받는 질문을 미리 정리해 두면, 홈 화면의 FAQ 섹션에서 항목을 골라 보여 줄 수 있어요. 변경 사항은 드래프트로 저장되며 발행해야 사이트에 반영됩니다.
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="card-body">
              <div style={{ fontSize: "var(--text-overline)", fontWeight: 600, color: "var(--sm-content-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                노출 중인 질문 미리보기
              </div>
              {visibleCount === 0 ? (
                <div style={{ fontSize: 12, color: "var(--sm-content-tertiary)" }}>표시할 질문이 없습니다.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {items.filter((x) => x.visible).slice(0, 5).map((x) => (
                    <div
                      key={x.id}
                      style={{
                        padding: "8px 12px",
                        background: "var(--sm-background-subtle)",
                        border: "1px solid var(--sm-border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: 12,
                        color: "var(--sm-content-secondary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {x.question}
                    </div>
                  ))}
                  {visibleCount > 5 && (
                    <div style={{ fontSize: 11, color: "var(--sm-content-tertiary)", textAlign: "center", marginTop: 4 }}>
                      외 {visibleCount - 5}개
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <FaqEditModal
        open={!!editing}
        item={editing}
        onChange={setEditing}
        onSave={save}
        onClose={close}
      />
    </div>
  );
};

const FaqDragItem = ({
  item, index, dragId, overId, open,
  onToggleOpen, onDragStart, onDragOver, onDrop, onDragEnd,
  onEdit, onDelete, onToggleVisible,
}) => {
  return (
    <div>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, item.id)}
        onDragOver={(e) => onDragOver(e, item.id)}
        onDrop={(e) => onDrop(e, item.id)}
        onDragEnd={onDragEnd}
        className={`drag-item ${dragId === item.id ? "dragging" : ""} ${overId === item.id && dragId !== item.id ? "drag-over" : ""}`}
        style={{ opacity: item.visible ? 1 : 0.55 }}
      >
        <Icon name="drag" size={16} style={{ color: "var(--sm-content-disabled)", cursor: "grab", flexShrink: 0 }} />
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
          {index + 1}
        </div>
        <button
          onClick={onToggleOpen}
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            padding: 0,
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <Icon
            name="chevronRight"
            size={14}
            style={{
              transform: open ? "rotate(90deg)" : "none",
              transition: "transform var(--motion-fast)",
              color: "var(--sm-content-tertiary)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontWeight: 600,
              fontSize: "var(--text-body-md)",
              color: "var(--sm-content-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.question || "(질문 없음)"}
          </span>
        </button>
        <Toggle checked={item.visible} onChange={onToggleVisible} />
        <IconButton icon="edit" onClick={onEdit} />
        <IconButton icon="trash" onClick={onDelete} />
      </div>

      {open && (
        <div
          style={{
            marginTop: 6,
            marginLeft: 54,
            marginRight: 8,
            padding: "var(--size-400)",
            background: "var(--sm-background-subtle)",
            borderLeft: "3px solid var(--sm-interactive-brand-default)",
            borderRadius: "0 var(--radius-md) var(--radius-md) 0",
            fontSize: 13,
            lineHeight: 1.65,
            color: "var(--sm-content-secondary)",
            whiteSpace: "pre-wrap",
          }}
        >
          {item.answer || "(답변 없음)"}
        </div>
      )}
    </div>
  );
};

const FaqEditModal = ({ open, item, onChange, onSave, onClose }) => {
  if (!open || !item) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item.id ? "질문 편집" : "새 질문 등록"}
      desc="고객이 자주 묻는 질문과 답변을 입력하세요."
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button variant="primary" iconLeft="check" onClick={onSave}>저장</Button>
        </>
      }
    >
      <div style={{ display: "grid", gap: "var(--size-400)" }}>
        <Field label="질문" required>
          <Input
            value={item.question}
            onChange={(e) => onChange({ ...item, question: e.target.value })}
            placeholder="예: 당일 주문도 가능한가요?"
            autoFocus
          />
        </Field>
        <Field label="답변" required helper="줄바꿈은 그대로 표시됩니다.">
          <Textarea
            value={item.answer}
            onChange={(e) => onChange({ ...item, answer: e.target.value })}
            rows={8}
            placeholder="네, 당일 주문도 가능합니다. 다만 샵에 준비된 꽃으로 제작되며…"
          />
        </Field>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Toggle checked={item.visible} onChange={() => onChange({ ...item, visible: !item.visible })} />
          <span style={{ fontSize: 13, color: "var(--sm-content-secondary)" }}>
            홈 페이지의 FAQ 섹션 후보로 표시
          </span>
        </div>
      </div>
    </Modal>
  );
};

Object.assign(window, { FaqsPage });
