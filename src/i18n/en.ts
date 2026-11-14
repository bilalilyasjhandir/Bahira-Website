// English text for the site's interface: menus, buttons, labels and short page texts.
// Long texts live in content/. Facts such as the email address and dates live in
// data/org.yaml, and {placeholders} are filled in from there.
//
// Raise `revision` whenever the English text changes. check-content then lists the Urdu and
// Saraiki translations that were made from an older revision and need another look.
// This file has no imports, so the check scripts can read it directly.

export const revision = 2;

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
  // The six parts of Bahira's work, named as in the brand guidelines.
  causes: {
    peopleInNeed: {
      title: "Help for people in need",
      text: "Food, water and care for people going through a hard time.",
    },
    womensRights: {
      title: "Women’s rights",
      text: "Speaking up for women’s safety, dignity and equal rights.",
    },
    strayAnimals: {
      title: "Stray animals",
      text: "Food and care for the animals that live on our streets.",
    },
    trees: {
      title: "Trees",
      text: "Planting trees for a cooler, greener South Punjab.",
    },
    intersex: {
      title: "Intersex advocacy",
      text: "Speaking up for intersex people and their right to live with dignity.",
    },
    youth: {
      title: "Skills for young people",
      text: "Modern skills and events that turn young people’s potential into progress.",
    },
  },
  home: {
    heroLabel: "Bahawalpur, South Punjab",
    heroLead:
      "Bahira Foundation is a welfare organisation in Bahawalpur. We bring food, cold drinks and company to people who need them, and we speak up for those who are left out.",
    heroPhotoAlt: "Two volunteers serve rice from a large pot onto plates.",
    photoCaption: "{title}, {month}.",
    volunteerAction: "Volunteer with us",
    donationsSoon: "Donations open soon.",
    factsTitle: "Bahira at a glance",
    factFounded: "Founded",
    factFoundedValue: "{date}, Human Rights Day",
    factBase: "Based in",
    factBaseValue: "Bahawalpur, South Punjab",
    factRegistration: "Registration",
    factNotRegistered:
      "Not registered yet. We plan to register with the Punjab Charity Commission.",
    factEmail: "Email",
    causesTitle: "What we work for",
    causesIntro:
      "Our work has six parts. We started with the first, and we are growing into the rest.",
    causesLink: "More about our work",
    storyTitle: "Founded on Human Rights Day",
    storyText:
      "We began on {date}, the day the world marks human rights, because every part of our work starts there.",
    nameText:
      "Bahira comes from the Arabic word {arabic}, which means luminous: bright, giving light.",
    signText:
      "Our sign is the letter B with a flame on top and an oil lamp, a chiragh, at its base: the everyday lamp that keeps a home lit.",
    aboutLink: "About us",
    recentTitle: "From our first year",
    volunteerTitle: "Volunteer with us",
    volunteerText:
      "Give a few hours to a drive, an event or a cause you care about. Tell us what you would like to do, and we will get in touch.",
    volunteerLink: "Get involved",
    donateTitle: "Donations open soon",
    donateText:
      "Until then, the best way to help is to volunteer, or to share our work with the people you know.",
  },
};

export type Dictionary = typeof en;
