// Иллюстрации упаковки лекарства в виде детализированного SVG — используются как основной
// визуал товара вместо стоковых/чужих фото (реальные фото фарм-брендов защищены авторским
// правом и не могут быть законно встроены в проект). Поддерживает 5 форм упаковки — box
// (коробка), blister (блистер), bottle (флакон/баночка), vial (ампула), tube (спрей/гель) —
// так каждая категория лекарств выглядит визуально по-разному, как в настоящей аптеке.
//
// Чтобы подставить настоящую фотографию, добавьте product.image (путь в /public/products/)
// и в ProductCard.jsx / ProductDetail.jsx замените <MedBox/> на <img src={product.image}/>.

export default function MedBox({ color = '#E8632C', size = 100, shape = 'box', dosageLabel }) {
  const uid = Math.abs(hashCode(color + shape + size)).toString(36);
  const dark = shade(color, -32);
  const darker = shade(color, -48);
  const light = shade(color, 20);

  const gradients = (
    <defs>
      <linearGradient id={`front-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={light} />
        <stop offset="55%" stopColor={color} />
        <stop offset="100%" stopColor={dark} />
      </linearGradient>
      <linearGradient id={`top-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={light} />
        <stop offset="100%" stopColor={color} />
      </linearGradient>
      <linearGradient id={`side-${uid}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={dark} />
        <stop offset="100%" stopColor={darker} />
      </linearGradient>
      <radialGradient id={`glass-${uid}`} cx="35%" cy="25%" r="75%">
        <stop offset="0%" stopColor="white" stopOpacity="0.9" />
        <stop offset="35%" stopColor={light} stopOpacity="0.55" />
        <stop offset="100%" stopColor={color} stopOpacity="0.85" />
      </radialGradient>
      <filter id={`shadow-${uid}`} x="-40%" y="-20%" width="180%" height="170%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.26" />
      </filter>
    </defs>
  );

  const pills = (
    <g filter={`url(#shadow-${uid})`}>
      <ellipse cx="38" cy="106" rx="13" ry="6.5" fill="white" transform="rotate(-16 38 106)" />
      <ellipse cx="38" cy="106" rx="13" ry="6.5" fill="none" stroke={color} strokeOpacity="0.25" transform="rotate(-16 38 106)" />
      <line x1="30" y1="103" x2="46" y2="109" stroke={color} strokeOpacity="0.3" strokeWidth="1" transform="rotate(-16 38 106)" />
      <ellipse cx="82" cy="108" rx="12" ry="6" fill="white" transform="rotate(14 82 108)" />
      <ellipse cx="82" cy="108" rx="12" ry="6" fill="none" stroke={color} strokeOpacity="0.25" transform="rotate(14 82 108)" />
      <line x1="75" y1="106" x2="89" y2="110" stroke={color} strokeOpacity="0.3" strokeWidth="1" transform="rotate(14 82 108)" />
    </g>
  );

  let art;
  if (shape === 'blister') {
    // Блистер: ряд выпуклых таблеток в фольге
    art = (
      <g filter={`url(#shadow-${uid})`}>
        <rect x="18" y="34" width="84" height="52" rx="10" fill={`url(#side-${uid})`} />
        <rect x="14" y="28" width="84" height="52" rx="10" fill={`url(#front-${uid})`} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${26 + i * 19}, 54)`}>
            <circle r="7.4" fill="white" opacity="0.95" />
            <circle r="7.4" fill="none" stroke={dark} strokeOpacity="0.25" strokeWidth="1.2" />
          </g>
        ))}
        <rect x="14" y="66" width="84" height="14" rx="4" fill="white" opacity="0.14" />
        <circle cx="56" cy="20" r="9" fill="white" opacity="0.95" />
        <path d="M56 15v10M51 20h10" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      </g>
    );
  } else if (shape === 'bottle') {
    // Флакон (сироп/витамины): круглое тело + горлышко + крышка
    art = (
      <g filter={`url(#shadow-${uid})`}>
        <rect x="42" y="10" width="20" height="14" rx="4" fill={darker} />
        <rect x="38" y="20" width="28" height="10" rx="3" fill={dark} />
        <path d="M30 32 Q30 26 40 26 L64 26 Q74 26 74 32 L78 96 Q78 106 68 106 L36 106 Q26 106 26 96 Z" fill={`url(#front-${uid})`} />
        <path d="M30 32 Q30 26 40 26 L52 26 L52 106 L36 106 Q26 106 26 96 Z" fill={`url(#glass-${uid})`} opacity="0.5" />
        <rect x="34" y="58" width="36" height="26" rx="5" fill="white" opacity="0.92" />
        {dosageLabel && (
          <text x="52" y="74" textAnchor="middle" fontSize="7.5" fontWeight="800" fill={dark} fontFamily="Manrope, sans-serif">
            {dosageLabel}
          </text>
        )}
        <circle cx="52" cy="18" r="7" fill="white" opacity="0.9" />
        <path d="M52 14v8M48 18h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </g>
    );
  } else if (shape === 'vial') {
    // Ампула/раствор для инъекций: узкий стеклянный флакон с резиновой крышкой
    art = (
      <g filter={`url(#shadow-${uid})`}>
        <rect x="46" y="8" width="12" height="10" rx="2" fill="#C9C2B8" />
        <rect x="42" y="16" width="20" height="8" rx="3" fill={darker} />
        <path d="M38 24 Q38 22 42 22 L62 22 Q66 22 66 24 L70 96 Q70 108 58 108 L46 108 Q34 108 34 96 Z" fill={`url(#glass-${uid})`} />
        <path d="M38 24 L46 108 Q34 108 34 96 L38 24" fill="white" opacity="0.18" />
        <rect x="38" y="52" width="28" height="30" rx="4" fill="white" opacity="0.9" />
        {dosageLabel && (
          <text x="52" y="63" textAnchor="middle" fontSize="6.2" fontWeight="800" fill={dark} fontFamily="Manrope, sans-serif">
            {dosageLabel.split(' ')[0]}
          </text>
        )}
        <line x1="42" y1="70" x2="62" y2="70" stroke={color} strokeOpacity="0.4" strokeWidth="1" />
        <line x1="42" y1="75" x2="58" y2="75" stroke={color} strokeOpacity="0.3" strokeWidth="1" />
      </g>
    );
  } else if (shape === 'tube') {
    // Спрей/гель: флакон-туба с распылителем
    art = (
      <g filter={`url(#shadow-${uid})`}>
        <rect x="44" y="6" width="16" height="8" rx="2" fill={darker} />
        <path d="M40 14 L64 14 L60 20 L44 20 Z" fill={dark} />
        <rect x="38" y="20" width="28" height="8" rx="3" fill={darker} />
        <path d="M32 28 Q32 26 36 26 L68 26 Q72 26 72 28 L76 96 Q76 108 64 108 L40 108 Q28 108 28 96 Z" fill={`url(#front-${uid})`} />
        <rect x="34" y="56" width="38" height="24" rx="5" fill="white" opacity="0.92" />
        {dosageLabel && (
          <text x="53" y="71" textAnchor="middle" fontSize="7" fontWeight="800" fill={dark} fontFamily="Manrope, sans-serif">
            {dosageLabel}
          </text>
        )}
      </g>
    );
  } else {
    // box (по умолчанию) — 3D коробка в перспективе
    art = (
      <g filter={`url(#shadow-${uid})`}>
        <path d="M20 30 L60 14 L100 30 L60 46 Z" fill={`url(#top-${uid})`} />
        <path d="M100 30 L100 88 L60 104 L60 46 Z" fill={`url(#side-${uid})`} />
        <path d="M20 30 L60 46 L60 104 L20 88 Z" fill={`url(#front-${uid})`} />
        <g transform="translate(28, 55)">
          <circle cx="12" cy="14" r="13" fill="white" opacity="0.95" />
          <path d="M12 7v14M5 14h14" stroke={color} strokeWidth="4" strokeLinecap="round" />
        </g>
        {dosageLabel && (
          <text x="22" y="98" fontSize="7.5" fontWeight="800" fill="white" fontFamily="Manrope, sans-serif" opacity="0.92">
            {dosageLabel}
          </text>
        )}
        <rect x="63" y="52" width="34" height="6" rx="3" fill="white" opacity="0.18" />
      </g>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {gradients}
      {art}
      {(shape === 'box' || shape === 'blister') && pills}
    </svg>
  );
}

function shade(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;
  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
