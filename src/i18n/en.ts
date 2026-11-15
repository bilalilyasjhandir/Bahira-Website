// English text for the site's interface: menus, buttons, labels and short page texts.
// Long texts live in content/. Facts such as the email address and dates live in
// data/org.yaml, and {placeholders} are filled in from there.
//
// Raise `revision` whenever the English text changes. check-content then lists the Urdu and
// Saraiki translations that were made from an older revision and need another look.
// This file has no imports, so the check scripts can read it directly.

export const revision = 4;

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
    socialNav: "Bahira on social media",
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
    updates: {
      title: "Updates",
      description: "What Bahira has done so far, where and when, with photos from each day.",
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
      description: "Tell us what you need, and we will contact you.",
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
  // Words used on several pages.
  common: {
    inEnglish: "In English",
    allUpdates: "All updates",
    moreUpdates: "More updates",
    photos: "Photos from the day",
    partOf: "Part of our work",
  },
  aboutPage: {
    signature: "{name}, founder",
    photoAlt: "{name}, Bahira’s founder, at an evening event.",
  },
  workPage: {
    lead: "Our work has six parts. So far, everything we have done has been help for people in need. The other five are where we want to grow next.",
    eventsSoFar: "What we have done so far",
    more: "More about this work",
    nextTitle: "What we want to start next",
    nextText:
      "We have not started these yet. If you can help us begin one, with your time, your skills or what you know, tell us.",
    nextLink: "Get involved",
  },
  causePage: {
    doneTitle: "What we have done",
  },
  updatesPage: {
    lead: "What we have done so far, where and when, with photos from each day. The newest comes first.",
  },
  getInvolvedPage: {
    photoAlt: "Two volunteers kneel by large pots, mixing a red drink for the iftar.",
    formTitle: "Volunteer with us",
    formText:
      "Tell us a little about yourself, and we will get in touch to talk about what you would like to do.",
  },
  donatePage: {
    walletsTitle: "Where to send a donation",
    accountTitle: "Account title",
    number: "Number",
    apps: "Send it with",
    or: "or",
    holder: "Account holder",
    holderNote:
      "This account is in the name of {name}, {role}, until Bahira has an account of its own.",
    roles: {
      founder: "Bahira’s founder",
    },
    copy: "Copy the number",
    copied: "Copied",
  },
  helpPage: {
    emergencyTitle: "In an emergency, call now",
    emergencyText:
      "Bahira is a small group of volunteers. We cannot come quickly in an emergency, but these government helplines can.",
    call: "Call",
    formTitle: "Ask us for help",
    formText:
      "Tell us who you are, where you are and what you need. We will message you on WhatsApp at the number you give.",
  },
  // Official helplines on the Need help? page; the numbers are in data/org.yaml.
  helplines: {
    rescue: {
      name: "Rescue 1122",
      text: "Ambulance, fire and accidents.",
    },
    police: {
      name: "Police",
      text: "If you are in danger, or a crime is happening.",
    },
    women: {
      name: "Women’s Helpline",
      text: "Help and advice for women, day and night, from the Punjab Commission on the Status of Women. Women answer the calls.",
    },
    children: {
      name: "Child Protection Bureau",
      text: "If a child is in danger, or living alone on the street.",
    },
  },
  contactPage: {
    lead: "Write to us by email, or with the form on this page. We read every message.",
    email: "Email",
    where: "Where we are",
    whereValue: "Bahawalpur, Punjab, Pakistan {postcode}",
    phone: "Phone",
    phoneValue:
      "We do not have a phone number yet. Leave yours in the form, and we will message you on WhatsApp.",
    social: "Social media",
    formTitle: "Write to us",
    helpText: "Do you need help, or know someone who does?",
    helpLink: "Use the help form",
  },
  thanksPage: {
    lead: "Thank you. Your message has reached us.",
    text: "We read every message. If you gave a phone number, we will message you on WhatsApp. If you gave an email address, we will write to you.",
    homeLink: "Back to the home page",
    updatesLink: "See what we have done so far",
  },
  forms: {
    optional: "optional",
    name: "Your name",
    phone: "Phone number (on WhatsApp)",
    phoneHelpHint: "We will message you on WhatsApp first.",
    email: "Email address",
    reach: "How can we reach you?",
    reachHint: "Give a phone number, an email address or both.",
    city: "City, town or area",
    interests: "What would you like to help with?",
    interestsHint: "Choose as many as you like.",
    message: "Your message",
    messageVolunteer: "Anything else you would like to tell us",
    messageVolunteerHint: "For example, your skills, or the days you are free.",
    messageHelp: "What do you need?",
    messageHelpHint:
      "Tell us in your own words, in Urdu, Saraiki or English. If you would rather a woman contacted you, say so.",
    nameDonationHint: "Leave it empty to give anonymously.",
    amount: "Amount, in rupees",
    app: "Which app did you send it to?",
    tid: "Transaction ID (TID)",
    tidHint: "It is in the message or receipt you got after sending.",
    cause: "What should it be spent on?",
    causeGeneral: "Where it is needed most",
    zakat: "This is Zakat",
    zakatHint: "We keep Zakat apart, and spend it only on what Zakat may be spent on.",
    confirm: "Where should we confirm that it arrived?",
    confirmHint: "Leave both empty if you do not need a reply.",
    send: "Send",
    sending: "Sending…",
    errorTitle: "Please check the form",
    errors: {
      name: "Enter your name",
      phone: "Enter your phone number",
      phoneShort: "Enter a phone number with at least 10 digits",
      email: "Enter an email address like name@example.com",
      reach: "Give a phone number or an email address",
      city: "Enter your city, town or area",
      amount: "Enter the amount you sent, in rupees",
      app: "Choose the app you sent it to",
      tid: "Enter the transaction ID",
      message: "Write your message",
      need: "Tell us what you need",
    },
    failed: "Sorry, your message could not be sent. Please try again, or write to us at {email}.",
    note: "We use what you send only to reply to you, and we never ask for your CNIC number. {privacy}",
    noteLink: "How we look after it",
    trap: "Leave this box empty",
  },
};

export type Dictionary = typeof en;
