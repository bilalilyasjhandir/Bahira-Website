// Saraiki text for the site's interface. Drafted by Claude; Bilal reviews it.
// `status` stays "draft" until Bilal approves the text, then becomes "reviewed".
// `sourceRevision` is the English revision (src/i18n/en.ts) this translation was made from.
//
// Saraiki letters: ٻ ڄ ݙ ڳ ݨ. This draft writes ݙ and ݨ, not the older ڋ and ڻ, until Bilal
// chooses; check-content stops the build if both spellings get mixed.

import type { Dictionary } from "./en";

export const translation = { sourceRevision: 1, status: "draft" } as const;

export const skr: Dictionary = {
  site: {
    name: "باہِرہ فاؤنڈیشن",
    tagline: "بس انسانیت نبھیندے پئے ہیں۔",
    description: "باہِرہ فاؤنڈیشن بہاولپور، جنوبی پنجاب دی ہک فلاحی تنظیم اے۔",
    founded:
      "بہاولپور دی ہک فلاحی تنظیم، جیندی بنیاد انسانی حقوق دے عالمی ݙینہہ، {date} کوں رکھی ڳئی۔",
    copyright: "© {year} باہِرہ فاؤنڈیشن",
  },
  a11y: {
    skipToContent: "سِدھا مواد تے ونڄو",
    homeLink: "باہِرہ فاؤنڈیشن، سرورق",
    mainNav: "مرکزی فہرست",
    languageNav: "زبان",
    footerNav: "سارے صفحے",
    menu: "مینیو",
  },
  nav: {
    home: "سرورق",
    about: "ساݙے بارے وچ",
    work: "ساݙا کم",
    updates: "سرگرمیاں",
    getInvolved: "ساݙا ساتھ ݙیوو",
    donate: "عطیہ ݙیوو",
    help: "مدد چاہیدی اے؟",
    contact: "رابطہ",
    accountability: "جواب دہی",
    privacy: "رازداری",
  },
  footer: {
    email: "ای میل",
  },
  pages: {
    home: {
      title: "باہِرہ فاؤنڈیشن",
      description:
        "باہِرہ فاؤنڈیشن بہاولپور، جنوبی پنجاب دی ہک فلاحی تنظیم اے۔ بس انسانیت نبھیندے پئے ہیں۔",
    },
    about: {
      title: "ساݙے بارے وچ",
      description:
        "اساں کون ہیں، اساں انسانی حقوق دے عالمی ݙینہہ تے شروعات کیوں کیتی، تے باہِرہ دا مطلب کیا اے۔",
    },
    work: {
      title: "ساݙا کم",
      description:
        "باہِرہ کیا کریندی اے: لوڑ والیاں دی مدد، عورتاں دے حق، آوارہ جانور، رُکھ، انٹرسیکس لوکاں دے حق، تے جوان۔",
    },
    getInvolved: {
      title: "ساݙا ساتھ ݙیوو",
      description: "باہِرہ دے رضاکار بݨو، ساݙے نال شراکت کرو، یا ساݙی ڳالھ ٻئے لوکاں تئیں پُڄاؤ۔",
    },
    donate: {
      title: "عطیہ ݙیوو",
      description: "تساں باہِرہ دے کم وچ کیویں مدد کر سڳدے ہو۔",
    },
    help: {
      title: "مدد چاہیدی اے؟",
      description: "ساکوں ݙساؤ تہاکوں کیا لوڑ اے، اساں تہاکوں فون کریسوں۔",
    },
    accountability: {
      title: "جواب دہی",
      description:
        "باہِرہ کوں کون چلیندا اے، پیسیاں دا حساب کیویں رکھیا ویندا اے، تے رجسٹریشن دی صورتِ حال کیا اے۔",
    },
    contact: {
      title: "رابطہ",
      description: "باہِرہ فاؤنڈیشن کوں لکھو۔",
    },
    privacy: {
      title: "رازداری",
      description:
        "ساݙے فارم کیا معلومات گھندے ہن تے او کتھاں ویندیاں ہن۔ نہ کوکیز، نہ کوئی نگرانی۔",
    },
    thanks: {
      title: "شکریہ",
      description: "تہاݙا پیغام باہِرہ فاؤنڈیشن تئیں پُڄ ڳیا اے۔",
    },
  },
  placeholder: {
    body: "ایہ صفحہ ہݨ لکھیا ویندا پیا اے۔",
  },
  notFound: {
    title: "صفحہ نئیں لبھا",
    body: "جیہڑا صفحہ تساں ڳولیندے پئے ہاوے، او موجود کائنی یا کتھائیں ٻئی جاہ تے چلا ڳیا اے۔",
    home: "سرورق تے ونڄو",
  },
};
