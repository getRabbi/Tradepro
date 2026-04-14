export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "TradePro",
  description: "Trade Forex, Commodities, Indices, Stocks, Crypto, and Metals. Fast, secure, and regulated trading for every trader.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  company: {
    legalName: "Your Company Ltd",
    registrationNumber: "XXXXX",
    licenseNumber: "LXXXXX/MT",
    authority: "Regulatory Authority",
    address: "Your Registered Address",
  },
  contact: {
    email: "info@yourdomain.com",
    phone: "+44 XXXX XXXXXX",
  },
  social: {
    instagram: "#",
    twitter: "#",
    facebook: "#",
    linkedin: "#",
  },
};

export const accountTypes = [
  {
    name: "Classic",
    level: "Beginner",
    spreadsFrom: "2.5",
    leverage: "1:400",
    commission: "Zero",
    marginCall: "100%",
    stopOut: "20%",
    negativeBalance: true,
    swapDiscount: "—",
    color: "#6b839e",
  },
  {
    name: "Silver",
    level: "Intermediate",
    spreadsFrom: "2.5",
    leverage: "1:400",
    commission: "Zero",
    marginCall: "100%",
    stopOut: "20%",
    negativeBalance: true,
    swapDiscount: "—",
    color: "#94a3b8",
  },
  {
    name: "Gold",
    level: "Advanced",
    spreadsFrom: "1.8",
    leverage: "1:400",
    commission: "Zero",
    marginCall: "100%",
    stopOut: "20%",
    negativeBalance: true,
    swapDiscount: "Basic",
    color: "#F5A623",
  },
  {
    name: "Platinum",
    level: "Professional",
    spreadsFrom: "1.4",
    leverage: "1:400",
    commission: "Zero",
    marginCall: "100%",
    stopOut: "20%",
    negativeBalance: true,
    swapDiscount: "Advanced",
    color: "#00D4FF",
  },
  {
    name: "VIP",
    level: "Expert",
    spreadsFrom: "0.9",
    leverage: "1:400",
    commission: "Zero",
    marginCall: "100%",
    stopOut: "20%",
    negativeBalance: true,
    swapDiscount: "Premium",
    color: "#0d6efd",
  },
];

export const marketCategories = [
  { key: "forex", label: "Forex", icon: "💱" },
  { key: "indices", label: "Indices", icon: "📊" },
  { key: "stocks", label: "Stocks", icon: "📈" },
  { key: "commodities", label: "Commodities", icon: "🛢️" },
  { key: "crypto", label: "Cryptocurrencies CFDs", icon: "₿" },
  { key: "metals", label: "Metals", icon: "🥇" },
];

export const instruments = {
  forex: [
    { symbol: "EURUSD", name: "Euro vs US Dollar", description: "Engage in trading the most popular currency pair, the Euro against the US Dollar." },
    { symbol: "GBPUSD", name: "Great Britain Pound vs US Dollar", description: "Participate in trading one of the most popular currency pairs, the British Pound against the US Dollar." },
    { symbol: "USDJPY", name: "US Dollar vs Japanese Yen", description: "Trade on the currency movements between the US Dollar and the Japanese Yen." },
    { symbol: "AUDUSD", name: "Australian Dollar vs US Dollar", description: "Participate in trading between the Australian Dollar and the US Dollar." },
    { symbol: "NZDUSD", name: "New Zealand Dollar vs US Dollar", description: "Trade the New Zealand Dollar against the US Dollar." },
    { symbol: "USDCAD", name: "US Dollar vs Canadian Dollar", description: "Engage in trading the US Dollar against the Canadian Dollar." },
    { symbol: "USDCHF", name: "US Dollar vs Swiss Franc", description: "Trade the US Dollar against the Swiss Franc." },
    { symbol: "EURGBP", name: "Euro vs British Pound", description: "Trade the Euro against the British Pound." },
  ],
  indices: [
    { symbol: "US500", name: "S&P 500", description: "Trade the benchmark US stock market index tracking 500 leading companies." },
    { symbol: "US100", name: "NASDAQ 100", description: "Access the top 100 non-financial companies listed on the NASDAQ exchange." },
    { symbol: "DE40", name: "DAX 40", description: "Trade Germany's premier stock market index." },
    { symbol: "UK100", name: "FTSE 100", description: "Engage with the UK's leading stock market index." },
    { symbol: "JP225", name: "Nikkei 225", description: "Trade Japan's most prominent stock market index." },
    { symbol: "FR40", name: "CAC 40", description: "Access France's leading stock market index." },
  ],
  stocks: [
    { symbol: "AAPL", name: "Apple Inc.", description: "Trade shares of the world's most valuable technology company." },
    { symbol: "TSLA", name: "Tesla Inc.", description: "Engage with the leading electric vehicle manufacturer." },
    { symbol: "AMZN", name: "Amazon.com Inc.", description: "Trade the global e-commerce and cloud computing giant." },
    { symbol: "MSFT", name: "Microsoft Corp.", description: "Access shares of the global software and technology leader." },
    { symbol: "GOOGL", name: "Alphabet Inc.", description: "Trade the parent company of Google." },
    { symbol: "META", name: "Meta Platforms Inc.", description: "Engage with the social media and metaverse company." },
  ],
  commodities: [
    { symbol: "USOIL", name: "Crude Oil WTI", description: "Trade the world's most actively traded commodity." },
    { symbol: "UKOIL", name: "Brent Crude Oil", description: "Access the international benchmark for oil prices." },
    { symbol: "NGAS", name: "Natural Gas", description: "Trade one of the most important energy commodities." },
  ],
  crypto: [
    { symbol: "BTCUSD", name: "Bitcoin", description: "Trade the world's first and most valuable cryptocurrency." },
    { symbol: "ETHUSD", name: "Ethereum", description: "Engage with the leading smart contract platform." },
    { symbol: "XRPUSD", name: "Ripple", description: "Trade the digital payment protocol and cryptocurrency." },
    { symbol: "BNBUSD", name: "Binance Coin", description: "Access the native token of the Binance ecosystem." },
    { symbol: "SOLUSD", name: "Solana", description: "Trade the high-performance blockchain platform token." },
  ],
  metals: [
    { symbol: "XAUUSD", name: "Gold", description: "Trade the world's most trusted precious metal and safe-haven asset." },
    { symbol: "XAGUSD", name: "Silver", description: "Engage with the versatile precious and industrial metal." },
    { symbol: "XPTUSD", name: "Platinum", description: "Trade the rare and valuable industrial precious metal." },
  ],
};

export const features = [
  {
    title: "Secure & Regulated",
    description: "Your funds and data are protected with top-tier security measures and regulatory compliance.",
    icon: "Shield",
  },
  {
    title: "Ultra-Fast Execution",
    description: "Trade without delays. Orders placed in real-time, minimizing slippage and maximizing opportunities.",
    icon: "Zap",
  },
  {
    title: "24/7 Support",
    description: "Our dedicated team is available around the clock to assist whenever you need it.",
    icon: "Headphones",
  },
  {
    title: "Advanced Tools",
    description: "From powerful charts to precise risk controls, trade smarter and stay ahead.",
    icon: "BarChart3",
  },
  {
    title: "Tight Spreads",
    description: "Benefit from spreads starting at 0.9 pips and transparent pricing with zero hidden charges.",
    icon: "TrendingUp",
  },
  {
    title: "Web-Based Platform",
    description: "Access global markets from any device. No downloads, no limits, just seamless trading.",
    icon: "Globe",
  },
];

export const navLinks = [
  {
    label: "Markets",
    children: [
      { label: "Forex", href: "/forex" },
      { label: "Indices", href: "/indices" },
      { label: "Stocks", href: "/stocks" },
      { label: "Commodities", href: "/commodities" },
      { label: "Cryptocurrencies", href: "/crypto" },
      { label: "Metals", href: "/metals" },
      { label: "Full CFD List", href: "/cfds-list" },
    ],
  },
  { label: "Accounts", href: "/trading-accounts" },
  { label: "Platform", href: "/platform" },
  { label: "Education", href: "/education" },
  { label: "About", href: "/about-us" },
];

export const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "bn", label: "বাংলা", flag: "🇧🇩" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "tl", label: "Tagalog", flag: "🇵🇭" },
  { code: "th", label: "ภาษาไทย", flag: "🇹🇭" },
];
