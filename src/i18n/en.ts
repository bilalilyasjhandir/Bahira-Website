// English text for the site's interface: menus, buttons, labels and short page texts.
// Long texts live in content/. Facts such as the email address and dates live in
// data/org.yaml, and {placeholders} are filled in from there.
//
// Raise `revision` whenever the English text changes. check-content then lists the Urdu and
// Saraiki translations that were made from an older revision and need another look.
// This file has no imports, so the check scripts can read it directly.

export const revision = 1;

export const en = {
  site: {
    name: "Bahira Foundation",
    tagline: "Just doing the human thing.",
    description: "Bahira Foundation is a welfare organisation in Bahawalpur, South Punjab.",
    founded: "A welfare organisation in Bahawalpur, founded on Human Rights Day, {date}.",
    copyright: "© {year} Bahira Foundation",
  },
  a11y: {
    skipToContent: "Skip to content",
    homeLink: "Bahira Foundation, home page",
    mainNav: "Main",
    languageNav: "Language",
    footerNav: "All pages",
    menu: "Menu",
  },
  nav: {
    home: "Home",
    about: "About us",
    work: "Our work",
    updates: "Updates",
    getInvolved: "Get involved",
    donate: "Donate",
    help: "Need help?",
    contact: "Contact",
    accountability: "Accountability",
    privacy: "Privacy",
  },
  footer: {
    email: "Email",
  },
  pages: {
    home: {
      title: "Bahira Foundation",
      description:
        "Bahira Foundation is a welfare organisation in Bahawalpur, South Punjab. Just doing the human thing.",
    },
    about: {
      title: "About us",
      description: "Who we are, why we began on Human Rights Day, and what the name Bahira means.",
    },
    work: {
      title: "Our work",
      description:
        "What Bahira does: help for people in need, women’s rights, stray animals, trees, intersex rights, and young people.",
    },
    getInvolved: {
      title: "Get involved",
      description: "Volunteer with Bahira, partner with us, or help spread the word.",
    },
    donate: {
      title: "Donate",
      description: "How you can support Bahira’s work.",
    },
    help: {
      title: "Need help?",
      description: "Tell us what you need, and we will call you back.",
    },
    accountability: {
      title: "Accountability",
      description: "Who runs Bahira, how money is handled, and where our registration stands.",
    },
    contact: {
      title: "Contact",
      description: "Write to Bahira Foundation.",
    },
    privacy: {
      title: "Privacy",
      description: "What our forms collect and where it goes. No cookies and no tracking.",
    },
    thanks: {
      title: "Thank you",
      description: "Your message has reached Bahira Foundation.",
    },
  },
  placeholder: {
    body: "This page is being written.",
  },
  notFound: {
    title: "Page not found",
    body: "The page you were looking for does not exist, or has moved.",
    home: "Go to the home page",
  },
};

export type Dictionary = typeof en;
