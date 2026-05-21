/* eslint-disable */
// 사용자 인증 hook + helper. 디자이너 page-login.jsx / app.jsx 에서 사용.

const useAuthSession = () => {
  const [state, setState] = React.useState({
    status: "loading", // "loading" | "signedIn" | "signedOut"
    user: null,
    claims: null,
  });

  React.useEffect(() => {
    if (!window.fbAuth) {
      setState({ status: "signedOut", user: null, claims: null });
      return;
    }
    const unsub = window.fbAuth.onIdTokenChanged(async (user) => {
      if (!user) {
        setState({ status: "signedOut", user: null, claims: null });
        return;
      }
      const result = await user.getIdTokenResult();
      const role = result.claims.role || "editor";
      const siteId = role === "super" ? null : (result.claims.siteId || null);
      setState({
        status: "signedIn",
        user,
        claims: { role, siteId },
      });
    });
    return unsub;
  }, []);

  return state;
};

const signInWithEmail = async (email, password) => {
  const cred = await window.fbAuth.signInWithEmailAndPassword(email, password);
  return cred.user;
};

const sendPasswordResetEmail = async (email) => {
  await window.fbAuth.sendPasswordResetEmail(email);
};

const signOutCurrent = async () => {
  await window.fbAuth.signOut();
};

const callPublishToGitHub = async ({ siteId, note }) => {
  const fn = window.fbFunctions.httpsCallable("publishToGitHub");
  const res = await fn({ siteId, note });
  return res.data; // { commitSha, snapshotId, filesChanged, noop }
};

const callSetSiteClaim = async ({ uid, siteId, role }) => {
  const fn = window.fbFunctions.httpsCallable("setSiteClaim");
  const res = await fn({ uid, siteId, role });
  return res.data;
};

Object.assign(window, {
  useAuthSession,
  signInWithEmail,
  sendPasswordResetEmail,
  signOutCurrent,
  callPublishToGitHub,
  callSetSiteClaim,
});
