export const translations: Record<string, Record<string, string>> = {
  tr: {
    follow: "Takip Et",
    following: "Takip Ediliyor",
    createdBy: "Oluşturan",
    yes: "EVET",
    no: "HAYIR",
    copying: "kopyalıyor",
    live: "CANLI",
    settings: "Ayarlar",
    theme: "Tema",
    language: "Dil",
    light: "Açık",
    dark: "Koyu",
    purple: "Mor",
    whaleBought: "BALİNA $50K EVET ALDI",
    orderFilled: "Emir Gerçekleşti",
    copyTopTraders: "En İyi Yatırımcıları Kopyala",
    copy: "Kopyala",
    whales: "BALİNALAR",
    wallet: "Cüzdan",
    balance: "Bakiye",
    profit: "Toplam Kâr",
    deposit: "Yatır",
    withdraw: "Çek"
  },
  en: {
    follow: "Follow",
    following: "Following",
    createdBy: "Created by",
    yes: "YES",
    no: "NO",
    copying: "copying",
    live: "LIVE",
    settings: "Settings",
    theme: "Theme",
    language: "Language",
    light: "Light",
    dark: "Dark",
    purple: "Purple",
    whaleBought: "WHALE BOUGHT $50K YES",
    orderFilled: "Order Filled",
    copyTopTraders: "Copy Top Traders",
    copy: "Copy",
    whales: "WHALES",
    wallet: "Wallet",
    balance: "Balance",
    profit: "Total Profit",
    deposit: "Deposit",
    withdraw: "Withdraw"
  }
};

export function t(lang: string, key: string) {
  return translations[lang]?.[key] || key;
}
