export function Tangerine({ color = "#f08a24", size = 72, leaf = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      {leaf && (
        <path
          d="M40 8c8 10 6 20 0 24-8-3-14-13-6-24z"
          fill="#3d7a4a"
        />
      )}
      <ellipse cx="40" cy="46" rx="26" ry="24" fill={color} />
      <ellipse cx="32" cy="38" rx="7" ry="5" fill="rgba(255,255,255,.22)" />
      <circle cx="40" cy="24" r="3.2" fill="#2f6b3a" />
    </svg>
  );
}

export function BranchDecor({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 420"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M118 12c-8 70-6 140 4 210 8 54-6 110-40 168"
        stroke="#3d7a4a"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <ellipse cx="92" cy="86" rx="28" ry="16" fill="#4c9a55" transform="rotate(-28 92 86)" />
      <ellipse cx="148" cy="132" rx="30" ry="16" fill="#3d7a4a" transform="rotate(22 148 132)" />
      <ellipse cx="78" cy="188" rx="26" ry="14" fill="#5aad62" transform="rotate(-18 78 188)" />
      <ellipse cx="156" cy="230" rx="32" ry="16" fill="#3d7a4a" transform="rotate(26 156 230)" />
      <ellipse cx="70" cy="280" rx="28" ry="15" fill="#4c9a55" transform="rotate(-24 70 280)" />
      <ellipse cx="132" cy="332" rx="30" ry="16" fill="#3d7a4a" transform="rotate(18 132 332)" />
      <circle cx="68" cy="70" r="22" fill="#f08a24" />
      <circle cx="164" cy="118" r="20" fill="#e86a12" />
      <circle cx="54" cy="170" r="18" fill="#ff9f3c" />
      <circle cx="176" cy="214" r="24" fill="#f08a24" />
      <circle cx="48" cy="262" r="20" fill="#e06a12" />
      <circle cx="150" cy="314" r="22" fill="#ff9f3c" />
      <circle cx="96" cy="368" r="18" fill="#f08a24" />
    </svg>
  );
}

export function FarmerMark({ size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 220" aria-hidden="true">
      <ellipse cx="100" cy="208" rx="58" ry="8" fill="rgba(44,36,22,.12)" />
      <rect x="62" y="132" width="76" height="64" rx="18" fill="#f4efe6" />
      <path d="M70 148h60v48c0 14-12 24-30 24s-30-10-30-24v-48z" fill="#c4a574" />
      <rect x="78" y="148" width="10" height="38" rx="3" fill="#8c6a3a" />
      <rect x="112" y="148" width="10" height="38" rx="3" fill="#8c6a3a" />
      <circle cx="100" cy="92" r="42" fill="#f3d7b8" />
      <path d="M58 86c8-40 76-40 84 0-6 10-22 16-42 16s-36-6-42-16z" fill="#e8c36a" />
      <ellipse cx="100" cy="58" rx="48" ry="16" fill="#d4a84a" />
      <ellipse cx="100" cy="52" rx="22" ry="8" fill="#c4943a" />
      <path d="M78 98c8 10 36 10 44 0" stroke="#2b2418" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="84" cy="88" r="4" fill="#2b2418" />
      <circle cx="116" cy="88" r="4" fill="#2b2418" />
      <path d="M96 70c8-10 28-6 22 8" stroke="#e8a090" strokeWidth="3" fill="none" />
    </svg>
  );
}

export function BasketMark({ size = 180 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 180 140" aria-hidden="true">
      <ellipse cx="90" cy="118" rx="70" ry="12" fill="rgba(44,36,22,.1)" />
      <path d="M28 78h124l-10 40H38z" fill="#c4a574" />
      <path d="M40 86h100M44 96h92M50 106h80" stroke="#8c6a3a" strokeWidth="3" />
      <circle cx="58" cy="64" r="20" fill="#f08a24" />
      <circle cx="90" cy="52" r="22" fill="#e86a12" />
      <circle cx="122" cy="64" r="20" fill="#ff9f3c" />
      <circle cx="78" cy="70" r="16" fill="#f4b45a" />
      <circle cx="106" cy="72" r="15" fill="#e06a12" />
    </svg>
  );
}
