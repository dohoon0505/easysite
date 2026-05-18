/* eslint-disable */
// Iconography — 24×24 viewBox · currentColor · 1.7–1.9 stroke

function Icon({ d, size = 22, strokeWidth = 1.8, fill = "none", children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
         strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d ? <path d={d} /> : children}
    </svg>
  );
}

const I = {
  Home:    (p) => <Icon {...p}><path d="M3 12 12 4l9 8" /><path d="M5 10v10h14V10" /></Icon>,
  List:    (p) => <Icon {...p}><path d="M3 6h18M3 12h18M3 18h12" /></Icon>,
  Grid:    (p) => <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Icon>,
  Calendar:(p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></Icon>,
  Clock:   (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>,
  Phone:   (p) => <Icon {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></Icon>,
  Kakao:   (p) => <Icon {...p}><path d="M12 4C7 4 3 7.4 3 11.5c0 2.5 1.6 4.8 4.1 6.1L6 21l3.7-2c.7.1 1.5.2 2.3.2 5 0 9-3.4 9-7.5S17 4 12 4z" fill="currentColor" stroke="none" /></Icon>,
  Insta:   (p) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" /></Icon>,
  Help:    (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2.5-2.5 4" /><path d="M12 17h.01" /></Icon>,
  Chat:    (p) => <Icon {...p}><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4z" /></Icon>,
  Send:    (p) => <Icon {...p} fill="currentColor" strokeWidth={0}><path d="M20.34,9.32l-14-7a3,3,0,0,0-4.08,3.9l2.4,5.37h0a1.06,1.06,0,0,1,0,.82l-2.4,5.37A3,3,0,0,0,5,22a3.14,3.14,0,0,0,1.35-.32l14-7a3,3,0,0,0,0-5.36Zm-.89,3.57-14,7a1,1,0,0,1-1.35-1.3l2.39-5.37A2,2,0,0,0,6.57,13h6.89a1,1,0,0,0,0-2H6.57a2,2,0,0,0-.08-.22L4.1,5.41a1,1,0,0,1,1.35-1.3l14,7a1,1,0,0,1,0,1.78Z" /></Icon>,
  Arrow:   (p) => <Icon {...p}><path d="M9 6l6 6-6 6" /></Icon>,
  Back:    (p) => <Icon {...p}><path d="M15 6l-6 6 6 6" /></Icon>,
  Close:   (p) => <Icon {...p}><path d="M6 6l12 12M18 6l-12 12" /></Icon>,
  Check:   (p) => <Icon {...p}><path d="M5 12l5 5 9-10" /></Icon>,
  Plus:    (p) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>,
  Minus:   (p) => <Icon {...p}><path d="M5 12h14" /></Icon>,
  Search:  (p) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Icon>,
  Info:    (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v5h1" /></Icon>,
  Sparkle: (p) => <Icon {...p}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" /><path d="M19 4l.5 1.5L21 6l-1.5.5L19 8l-.5-1.5L17 6l1.5-.5z" /></Icon>,
  ChevR:   (p) => <Icon {...p}><path d="M9 6l6 6-6 6" /></Icon>,
  ChevL:   (p) => <Icon {...p}><path d="M15 6l-6 6 6 6" /></Icon>,
  User:    (p) => <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></Icon>,
  Tag:     (p) => <Icon {...p}><path d="M4 12V4h8l8 8-8 8z" /><circle cx="9" cy="9" r="1.4" /></Icon>,
  Note:    (p) => <Icon {...p}><path d="M4 4h12l4 4v12H4z" /><path d="M8 12h8M8 16h6" /></Icon>,
  Star:    (p) => <Icon {...p}><path d="M12 3l2.6 5.6 6 .9-4.4 4.3 1 6.1L12 17.1 6.8 20l1-6.1-4.4-4.3 6-.9z" /></Icon>,
  Map:     (p) => <Icon {...p}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></Icon>,
  Mark:    (p) => <Icon {...p}><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-4z" /></Icon>,
  // Category glyphs
  Scissors:(p) => <Icon {...p}><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" /></Icon>,
  Perm:    (p) => <Icon {...p}><path d="M4 16c2-3 4-3 6 0s4 3 6 0 4-3 6 0" /><path d="M4 10c2-3 4-3 6 0s4 3 6 0 4-3 6 0" /></Icon>,
  Color:   (p) => <Icon {...p}><path d="M12 3v6" /><path d="M8 9c-2 1.5-3 4-3 6.5a7 7 0 0 0 14 0c0-2.5-1-5-3-6.5" /><path d="M8 17h8" /></Icon>,
  Care:    (p) => <Icon {...p}><path d="M12 22s7-4 7-10c0-3-2-5-4-5s-3 1.5-3 3c0-1.5-1-3-3-3s-4 2-4 5c0 6 7 10 7 10z" /></Icon>,
  Edit:    (p) => <Icon {...p}><path d="M4 20l4-1 11-11-3-3L5 16z" /></Icon>,
  Settings:(p) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></Icon>,
  Sun:     (p) => <Icon {...p}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4l1.4-1.4M17 7l1.4-1.4" /></Icon>,
  Moon:    (p) => <Icon {...p}><path d="M20 14.5A8 8 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" /></Icon>,
  Share:   (p) => <Icon {...p}><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.2 10.8 15.8 7.2M8.2 13.2l7.6 3.6" /></Icon>,
};

window.I = I;
window.Icon = Icon;
