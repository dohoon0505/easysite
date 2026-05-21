/* eslint-disable */
// Offline detection + queue UX

const useOnlineStatus = () => {
  const [online, setOnline] = React.useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  React.useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
};

// Visual offline banner that anchors above the topbar/tabbar
const OfflineBanner = ({ simulated, mobile, queueCount = 0 }) => {
  if (!simulated) return null;
  return (
    <div
      className={mobile ? "offline-banner offline-banner--mobile" : "offline-banner"}
      role="status"
      aria-live="polite"
    >
      <span className="offline-dot" />
      <span style={{ fontWeight: 600 }}>오프라인</span>
      <span style={{ opacity: 0.85 }}>—</span>
      <span style={{ flex: 1, textWrap: "pretty" }}>
        변경사항은 자동으로 큐에 저장되고, 인터넷 연결이 복구되면 발송됩니다
      </span>
      {queueCount > 0 && (
        <span className="offline-queue">
          <Icon name="clock" size={11} /> 대기 {queueCount}
        </span>
      )}
    </div>
  );
};

Object.assign(window, { useOnlineStatus, OfflineBanner });
