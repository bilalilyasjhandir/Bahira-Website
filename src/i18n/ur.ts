// Urdu text for the site's interface. Drafted by Claude; Bilal reviews it.
// `status` stays "draft" until Bilal approves the text, then becomes "reviewed".
// `sourceRevision` is the English revision (src/i18n/en.ts) this translation was made from.

import type { Dictionary } from "./en";

export const translation = { sourceRevision: 1, status: "draft" } as const;

export const ur: Dictionary = {
  site: {
    name: "باہِرہ فاؤنڈیشن",
    tagline: "بس انسانیت نبھا رہے ہیں۔",
    description: "باہِرہ فاؤنڈیشن بہاولپور، جنوبی پنجاب کی ایک فلاحی تنظیم ہے۔",
    founded:
      "بہاولپور کی ایک فلاحی تنظیم، جس کی بنیاد انسانی حقوق کے عالمی دن، {date} کو رکھی گئی۔",
    copyright: "© {year} باہِرہ فاؤنڈیشن",
  },
  a11y: {
    skipToContent: "سیدھا مواد پر جائیں",
    homeLink: "باہِرہ فاؤنڈیشن، سرورق",
    mainNav: "مرکزی فہرست",
    languageNav: "زبان",
    footerNav: "تمام صفحات",
    menu: "مینیو",
  },
  nav: {
    home: "سرورق",
    about: "ہمارے بارے میں",
    work: "ہمارا کام",
    updates: "سرگرمیاں",
    getInvolved: "ہمارا ساتھ دیں",
    donate: "عطیہ دیں",
    help: "مدد چاہیے؟",
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
        "باہِرہ فاؤنڈیشن بہاولپور، جنوبی پنجاب کی ایک فلاحی تنظیم ہے۔ بس انسانیت نبھا رہے ہیں۔",
    },
    about: {
      title: "ہمارے بارے میں",
      description:
        "ہم کون ہیں، ہم نے انسانی حقوق کے عالمی دن پر آغاز کیوں کیا، اور باہِرہ کا مطلب کیا ہے۔",
    },
    work: {
      title: "ہمارا کام",
      description:
        "باہِرہ کیا کرتی ہے: ضرورت مندوں کی مدد، خواتین کے حقوق، آوارہ جانور، درخت، انٹرسیکس افراد کے حقوق، اور نوجوان۔",
    },
    getInvolved: {
      title: "ہمارا ساتھ دیں",
      description: "باہِرہ کے رضاکار بنیں، ہمارے ساتھ شراکت کریں، یا ہماری بات دوسروں تک پہنچائیں۔",
    },
    donate: {
      title: "عطیہ دیں",
      description: "آپ باہِرہ کے کام میں کیسے مدد کر سکتے ہیں۔",
    },
    help: {
      title: "مدد چاہیے؟",
      description: "ہمیں بتائیں آپ کو کس چیز کی ضرورت ہے، ہم آپ کو فون کریں گے۔",
    },
    accountability: {
      title: "جواب دہی",
      description:
        "باہِرہ کو کون چلاتا ہے، پیسوں کا حساب کیسے رکھا جاتا ہے، اور رجسٹریشن کی صورتِ حال کیا ہے۔",
    },
    contact: {
      title: "رابطہ",
      description: "باہِرہ فاؤنڈیشن کو لکھیں۔",
    },
    privacy: {
      title: "رازداری",
      description:
        "ہمارے فارم کیا معلومات لیتے ہیں اور وہ کہاں جاتی ہیں۔ نہ کوکیز، نہ کوئی نگرانی۔",
    },
    thanks: {
      title: "شکریہ",
      description: "آپ کا پیغام باہِرہ فاؤنڈیشن تک پہنچ گیا ہے۔",
    },
  },
  placeholder: {
    body: "یہ صفحہ ابھی لکھا جا رہا ہے۔",
  },
  notFound: {
    title: "صفحہ نہیں ملا",
    body: "جو صفحہ آپ ڈھونڈ رہے تھے، وہ موجود نہیں یا کہیں اور منتقل ہو گیا ہے۔",
    home: "سرورق پر جائیں",
  },
};
