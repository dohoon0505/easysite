/* eslint-disable */
// F01 — 질문/답변 관리.
// 운영자가 자주묻는질문 마스터 목록을 관리한다. 홈 섹션의 "FAQ" 영역은
// 이 목록 중 일부를 선택해 표시한다.

const FaqsPage = ({ siteId }) => {
  const [items, setItems] = (typeof useLiveFaqs === "function"
    ? useLiveFaqs(siteId)
    : [[], () => {}, false]);
  const [editing, setEditing] = React.useState(null); // {id?, question, answer}
  const toast = useToast();

  const openCreate = () => setEditing({ id: null, question: "", answer: "", visible: true });
  const openEdit = (faq) => setEditing({ id: faq.id, question: faq.question, answer: faq.answer, visible: faq.visible });
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
      setItems((prev) =>
        prev.map((x) => (x.id === editing.id ? { ...x, question: editing.question.trim(), answer: editing.answer.trim(), visible: editing.visible } : x))
      );
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
    toast({ tone: "info", message: "삭제했습니다 — 드래프트" });
  };

  const toggleVisible = (id) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, visible: !x.visible } : x)));
  };

  const move = (id, dir) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">질문/답변</h1>
          <div className="page-subtitle">
            홈 화면의 FAQ 섹션에 노출할 질문 목록을 관리합니다. 등록한 질문 중 선택하여 홈에 비치합니다.
          </div>
        </div>
        <div className="page-actions">
          <Button variant="primary" iconLeft="plus" onClick={openCreate}>질문 추가</Button>
        </div>
      </div>

      <Card>
        <div className="card-header">
          <h2 className="card-title" style={{ fontSize: "var(--text-body-md)" }}>전체 ({items.length})</h2>
          <span className="text-tertiary" style={{ fontSize: 12 }}>↑↓ 화살표로 순서 변경</span>
        </div>

        {items.length === 0 ? (
          <div className="card-body" style={{ textAlign: "center", padding: "var(--size-700) var(--size-500)", color: "var(--sm-content-tertiary)" }}>
            <Icon name="help" size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <div style={{ fontWeight: 600, marginBottom: 4 }}>아직 등록된 질문이 없어요</div>
            <div style={{ fontSize: 13, marginBottom: 16 }}>운영하면서 자주 받는 질문을 미리 정리해 두면 좋아요.</div>
            <Button variant="outline" iconLeft="plus" onClick={openCreate}>첫 질문 등록</Button>
          </div>
        ) : (
          <div>
            {items.map((it, idx) => (
              <FaqRow
                key={it.id}
                item={it}
                first={idx === 0}
                last={idx === items.length - 1}
                onEdit={() => openEdit(it)}
                onDelete={() => remove(it.id)}
                onToggle={() => toggleVisible(it.id)}
                onUp={() => move(it.id, -1)}
                onDown={() => move(it.id, +1)}
              />
            ))}
          </div>
        )}
      </Card>

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

const FaqRow = ({ item, first, last, onEdit, onDelete, onToggle, onUp, onDown }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      style={{
        borderTop: "1px solid var(--sm-border-subtle)",
        padding: "var(--size-400) var(--size-500)",
        display: "flex",
        gap: "var(--size-400)",
        alignItems: "flex-start",
        opacity: item.visible ? 1 : 0.55,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <button onClick={onUp} disabled={first} style={{ color: first ? "var(--sm-content-disabled)" : "var(--sm-content-tertiary)", cursor: first ? "default" : "pointer", padding: 2 }}>
          <Icon name="chevronUp" size={14} />
        </button>
        <button onClick={onDown} disabled={last} style={{ color: last ? "var(--sm-content-disabled)" : "var(--sm-content-tertiary)", cursor: last ? "default" : "pointer", padding: 2 }}>
          <Icon name="chevronDown" size={14} />
        </button>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          onClick={() => setOpen((v) => !v)}
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
        >
          <Icon
            name="chevronRight"
            size={14}
            style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform var(--motion-fast)", color: "var(--sm-content-tertiary)", flexShrink: 0 }}
          />
          <div style={{ fontWeight: 600, fontSize: "var(--text-body-md)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: open ? "normal" : "nowrap" }}>
            {item.question || "(질문 없음)"}
          </div>
        </div>
        {open && (
          <div style={{ marginTop: 10, marginLeft: 22, fontSize: 13, lineHeight: 1.6, color: "var(--sm-content-secondary)", whiteSpace: "pre-wrap" }}>
            {item.answer || "(답변 없음)"}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <Toggle checked={item.visible} onChange={onToggle} />
        <IconButton icon="edit" onClick={onEdit} title="편집" />
        <IconButton icon="trash" onClick={onDelete} title="삭제" />
      </div>
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
