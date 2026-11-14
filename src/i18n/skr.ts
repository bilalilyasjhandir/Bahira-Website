// Saraiki text for the site's interface. Drafted by Claude; Bilal reviews it.
// `status` stays "draft" until Bilal approves the text, then becomes "reviewed".
// `sourceRevision` is the English revision (src/i18n/en.ts) this translation was made from.
//
// Saraiki letters: ٻ ڄ ݙ ڳ ݨ. This draft writes ݙ and ݨ, not the older ڋ and ڻ, until Bilal
// chooses; check-content stops the build if both spellings get mixed.

import type { Dictionary } from "./en";

export const translation = { sourceRevision: 2, status: "draft" } as const;

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
  causes: {
    peopleInNeed: {
      title: "لوڑ والیاں دی مدد",
      text: "اوکھے ویلے وچوں لنگھݨ والیاں کیتے کھاݨا، پاݨی تے سنبھال۔",
    },
    womensRights: {
      title: "عورتاں دے حق",
      text: "عورتاں دی حفاظت، عزت تے برابر حقاں کیتے آواز۔",
    },
    strayAnimals: {
      title: "آوارہ جانور",
      text: "ساݙیاں گلیاں وچ رہݨ والے جانوراں کیتے کھاݨا تے سنبھال۔",
    },
    trees: {
      title: "رُکھ",
      text: "ہک ٹھڈے تے ساوے جنوبی پنجاب کیتے رُکھ لاوݨ۔",
    },
    intersex: {
      title: "انٹرسیکس لوکاں کیتے آواز",
      text: "انٹرسیکس لوکاں تے اُنہاں دے عزت نال جیوݨ دے حق کیتے آواز۔",
    },
    youth: {
      title: "جواناں کیتے ہنر",
      text: "نویں ہنر تے تقریباں، جیہڑیاں جواناں دی صلاحیت کوں ترقی وچ بدلن۔",
    },
  },
  home: {
    heroLabel: "بہاولپور، جنوبی پنجاب",
    heroLead:
      "باہِرہ فاؤنڈیشن بہاولپور دی ہک فلاحی تنظیم اے۔ اساں لوڑ والیاں تئیں کھاݨا، ٹھڈے مشروب تے اپݨا ویلا پُڄیندے ہیں، تے اُنہاں کیتے آواز چیندے ہیں جنہاں کوں نظر انداز کیتا ویندا اے۔",
    heroPhotoAlt: "ݙو رضاکار ہک وݙی دیگ وچوں پلیٹاں وچ چاول کڈھدے پئے ہن۔",
    photoCaption: "{title}، {month}۔",
    volunteerAction: "رضاکار بݨو",
    donationsSoon: "عطیات چھیتی شروع تھیسن۔",
    factsTitle: "باہِرہ ہک نظر وچ",
    factFounded: "قیام",
    factFoundedValue: "{date}، انسانی حقوق دا عالمی ݙینہہ",
    factBase: "مقام",
    factBaseValue: "بہاولپور، جنوبی پنجاب",
    factRegistration: "رجسٹریشن",
    factNotRegistered:
      "ہݨ تئیں رجسٹرڈ کائنی۔ اساں پنجاب چیریٹی کمیشن وچ رجسٹریشن دا ارادہ رکھدے ہیں۔",
    factEmail: "ای میل",
    causesTitle: "اساں کیا کریندے ہیں",
    causesIntro:
      "ساݙے کم دے چھی حصے ہن۔ اساں پہلے حصے توں شروعات کیتی اے، تے باقیاں ول ودھدے پئے ہیں۔",
    causesLink: "ساݙے کم بارے ہور",
    storyTitle: "انسانی حقوق دے عالمی ݙینہہ تے شروعات",
    storyText:
      "اساں {date} کوں شروعات کیتی، جیں ݙینہہ دنیا انسانی حقوق دا ݙینہہ منیندی اے، کیوں جو ساݙا ہر کم اُتھوں ای شروع تھیندا اے۔",
    nameText: "باہِرہ عربی لفظ {arabic} توں اے، جیندا مطلب اے روشن: چمکدا، روشنی ݙیوݨ والا۔",
    signText:
      "ساݙا نشان حرف B اے، جیندے اُتے ہک شعلہ اے تے ہیٹھاں ہک چراغ: اوہو عام جیہا ݙیوا جیہڑا گھر کوں روشن رکھدا اے۔",
    aboutLink: "ساݙے بارے وچ",
    recentTitle: "ساݙے پہلے سال توں",
    volunteerTitle: "رضاکار بݨو",
    volunteerText:
      "کہیں مہم، تقریب یا اپݨی پسند دے کہیں کم کیتے کجھ گھنٹے ݙیوو۔ ساکوں ݙساؤ تساں کیا کرݨ چاہندے ہو، اساں تہاݙے نال رابطہ کریسوں۔",
    volunteerLink: "ساݙا ساتھ ݙیوو",
    donateTitle: "عطیات چھیتی شروع تھیسن",
    donateText:
      "تݙݨ تئیں مدد دا سبھ توں چنگا طریقہ اے جو رضاکار بݨو، یا ساݙے کم بارے اپݨے جاݨو لوکاں کوں ݙساؤ۔",
  },
};
