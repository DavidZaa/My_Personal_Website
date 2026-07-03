/**
 * Single source of truth for resume-style facts shown on the site.
 * Update this file when the resume changes.
 */

export interface AwardEntry {
  title: string;
  /** date and/or issuer line */
  meta?: string;
  detail?: string;
  /** itemized sub-achievements (e.g. the VEX trophy log) */
  highlights?: readonly string[];
}

export const profile = {
  name: "David Zhang",
  title: "CS & Math of Computation @ UCLA",
  tagline: "builder of odd, glowing things",
  location: "Los Angeles, CA",
  bio: "I study Computer Science & Mathematics of Computation at UCLA (with a linguistics minor), do research on sparse estimation for LLM optimization, and spend the rest of my time building things I wish existed.",
  links: {
    github: "https://github.com/DavidZaa",
    linkedin: "https://www.linkedin.com/in/davidzzzhang/",
    instagram: "https://www.instagram.com/daviddzhanggg/",
    email: "davidzha77@g.ucla.edu",
  },
  education: [
    {
      school: "University of California, Los Angeles",
      degree:
        "B.S. Computer Science & Mathematics of Computation, Minor in Linguistics",
      location: "Los Angeles, CA",
      activities: [
        "UCLA DataRes",
        "DataBlog",
        "Alumni Scholars Club",
        "Gold Shield Alumnae",
        "Junamici Foundation",
        "Bruin Review",
        "Association for Computing Machinery",
        "UCLA Honors Program",
      ],
      apCourses: [] as readonly string[],
    },
    {
      school: "University High School, Irvine",
      degree: "Diploma",
      location: "Irvine, CA",
      activities: [
        "We-Together Educational Foundation (Founder)",
        "Protecting Oceans by Young Activists (Founder)",
        "IUSD Advocacy Program",
        "Irvine Coding Club (Board)",
        "VEX Robotics (Team Leader)",
      ],
      apCourses: [
        "Calculus BC",
        "Statistics",
        "Computer Science",
        "Chemistry",
        "Biology",
        "Physics",
        "Macroeconomics",
        "Microeconomics",
        "US Government & Politics",
        "US History",
        "Chinese",
        "Psychology",
        "English Literature",
        "English Language",
      ] as readonly string[],
    },
  ],
  experience: [
    {
      org: "Beijing ESWIN Technology Group",
      role: "AI Systems Engineering Intern",
      period: "May 2026 – Present",
      location: "Beijing & Xi'an, China",
      bullets: [
        "Python/C++ tooling for RISC-V AI SoC development — engineering workflows and performance characterization for AI workloads across CPU, NPU, memory, and peripheral subsystems.",
        "Optimizing software execution on intelligent computing hardware; performance profiling and automation of experimental workflows across the chip development lifecycle.",
      ],
    },
    {
      org: "UCLA Department of Statistics and Data Science",
      role: "Undergraduate Research Assistant",
      period: "Mar 2026 – Present",
      location: "Los Angeles, CA",
      bullets: [
        "Research with Professor Ying Nian Wu on sparse estimation methods for GEPA-style LLM optimization — replacing dense Pareto-table reevaluation while preserving candidate-selection decisions.",
        "Designing statistical experiments on selection agreement, optimization accuracy, computational cost, and robustness via reproducible Python evaluation pipelines.",
      ],
    },
    {
      org: "UCLA Department of Linguistics",
      role: "Undergraduate Research Assistant",
      period: "Jun 2025 – Aug 2025",
      location: "Los Angeles, CA",
      bullets: [
        "Transformer-based NLP research with Dr. Jesse Harris — semantic parsing and morphosyntactic analysis; built Python evaluation pipelines and improved benchmark accuracy from 0.43 to 0.67 through ablation studies and error analysis.",
      ],
    },
    {
      org: "City of Irvine, Office of the Vice Mayor",
      role: "Software Engineer",
      period: "Jun 2025 – Sep 2025",
      location: "Irvine, CA",
      bullets: [
        "Designed and deployed a Flask-based resident-help chatbot; automated FAQs and triage handoffs. Advised on website information architecture and content strategy.",
      ],
    },
    {
      org: "International Centre for Engineering Education (ICEE) under UNESCO",
      role: "Intern",
      period: "Jun 2024 – Aug 2024",
      location: "Beijing, China",
      bullets: [
        "Conducted market scans of AI ed-techs and prepared comprehensive reports on their potential applications in educational settings; drafted accounts on the relations between China and America, providing policy proposals for cross-border rollout.",
      ],
    },
    {
      org: "SoftCom Lab, Cal Poly Pomona",
      role: "Project Lead & Research Intern",
      period: "Aug 2023 – Jun 2024",
      location: "Irvine, CA",
      bullets: [
        "Led development of AI-driven educational and workflow automation tools — a real-time collaborative coding platform and NLP-assisted healthcare systems — contributing to multiple publications and two U.S. provisional patents.",
      ],
    },
  ],
  clubs: [
    {
      org: "UCLA DataRes · DataBlog",
      role: "Project Lead",
      period: "Oct 2025 – Present",
      detail:
        "Leading a 5–6 member team analyzing MyLA311 open data — where and why LA residents wait longer for city services across request types, ZIP codes, and channels. Python/Colab pipeline + Plotly dashboard, findings written up for city operations.",
    },
    {
      org: "Alumni Scholars Club",
      role: "Financial Coordinator",
      period: "Sep 2025 – Present",
      detail:
        "One of three coordinators securing program funding with campus sources and the UCLA Alumni Association; planning alumni workshops, seminars, tutoring, and mentorship events.",
    },
    {
      org: "Bruin Review",
      role: "Editorial Writer",
      period: "Oct 2025 – Present",
      detail:
        "STEM-oriented opinion and analysis — AI ethics, data privacy, innovation policy — written to be readable by people who don't live in the terminal.",
    },
  ],
  publications: [
    {
      title:
        "Design Concept of a Wearable Device for Sleep-Related Brain Wave Detection and Stimulation",
      venue: "2024 IEEE 4th International Conference on Data Science and Computer Application (ICDSCA)",
      date: "Nov 2024",
      url: "https://ieeexplore.ieee.org/document/10860034",
      description:
        "Led development and research for a wearable EEG-based sleep technology concept designed to improve sleep quality through brain wave detection and stimulation. Contributed to system architecture spanning EEG sensing, machine-learning-driven adaptive control, and electronic stimulation modules while coordinating interdisciplinary work across neuroscience, data science, and human-centered design. Preliminary results showed promising subsystem performance for real-time sleep monitoring and relaxation guidance.",
    },
    {
      title:
        "BrainBow: A Real-Time Inclusivity Index for Neurodiversity using Sentiment Analysis of News and Social Media",
      venue: "MLNLP 2024, Sydney",
      date: "Nov 2024",
      url: "https://csitcp.com/abstract/14/1419csit17",
      description:
        "Authored a real-time NLP and sentiment analysis platform measuring neurodiversity inclusivity trends from social media and news data. Built data-integration and analysis pipelines using APIs, TextBlob-based sentiment analysis, and interactive Chart.js visualizations, exploring real-time processing, nuanced language interpretation, and accessibility-focused UI design.",
    },
    {
      title:
        "A Smart Interactive and Collaborative Online Coding Platform for Programming Education using Machine Learning and Web Socket",
      venue:
        "12th International Conference on Software Engineering and Applications (SEAS 2023), Toronto",
      date: "Sep 2023",
      url: "https://csitcp.org/abstract/13/1317csit03",
      description:
        "Authored a research paper on a machine-learning-supported collaborative coding platform for real-time programming education and accessibility — cloud databases, WebSocket communication, and synchronized collaborative editing for scalable interactive learning.",
    },
    {
      title:
        "Understanding the Role of Anxiety and Behavior in Learning through Zebrafish: A Computational Model",
      venue: "Journal of Research High School",
      date: "Feb 2023",
      url: "https://www.journalresearchhs.org/_files/ugd/ebf144_2676780463194e24b37e11856c73d0a4.pdf",
      description:
        "Developed a computational framework analyzing the relationship between anxiety and learning behavior using zebrafish behavioral modeling and data-driven analysis techniques.",
    },
    {
      title:
        "Effects of Electronics and Video Games on Students' Academic Performance: A Survey in Irvine Areas",
      venue: "HPHR / BCPHR Journal",
      date: "Jan 2023",
      url: "https://bcphr.org/72-article-zhang/",
      description:
        "Led a team of 7 students in a public health research initiative examining the effects of electronics, video games, and virtual learning on student academic performance and well-being in the Irvine area.",
    },
  ],
  patents: [
    {
      title: "Inclusivity Index Metrics for Neurodiversity",
      id: "USPTO #63/578,676",
    },
    {
      title: "Digi-Prescription: Mobile NLP for Paperless Prescriptions",
      id: "USPTO #63/087,608",
    },
  ],
  awards: [
    {
      title: "USA Computing Olympiad — Platinum Division",
      meta: "Feb 2024",
      detail: "Passed the Platinum Division for the USA Computing Olympiad.",
    },
    {
      title: "VEX Robotics World Championship Finalist ×2",
      meta: "May 2024 · Team Irvine Ruiguan — Arctic Penguins — 80920A",
      detail:
        "Qualified for the World Championship ×2 and the Event Region Championship ×2.",
      highlights: [
        "2025 VEX Robotics World Championship — VEX V5 Robotics Competition",
        "2024 VEX Robotics World Championship — VEX Robotics Competition",
        "2024–25 VEX V5 Asia Open Signature Event — Tournament Champions",
        "2024–25 VEX V5 Asia Open Signature Event — Robot Skills 3rd Place",
        "2025 Roundtable Robotics Challenge \"High Stakes\" — Tournament Champions",
        "2025 Roundtable Robotics Challenge \"High Stakes\" — Robot Skills Champions",
        "NorCal Silicon Valley VEX V5 Signature Event — Tournament Champions",
        "2023–24 VRC Asia Open Signature Event — Tournament Semifinalists",
        "2024 San Diego VEX Robotics Tournament — Robot Skills Champion",
        "San Diego 2nd Annual Last Chance Tournament — Event Region Champion",
        "San Diego 2nd Annual Last Chance Tournament — Robot Skills Champion",
      ],
    },
    {
      title: "AI Challengers — USA Regional Winner & Global Finalist",
      meta: "Nov 2023",
      detail:
        "Won the regional division and advanced to the global finals in an international AI competition focused on machine learning, innovation, and real-world AI applications.",
    },
    {
      title: "OCSEF Raytheon Science & Engineering Special Award",
      meta: "Orange County Science & Engineering Fair · Jan 2024",
      detail:
        "Raytheon-sponsored special award at the Orange County Science & Engineering Fair, recognizing an outstanding science and engineering research project.",
    },
    {
      title: "National Merit Scholarship Finalist",
      meta: "99th percentile PSAT",
      detail:
        "Named a National Merit Finalist on the strength of a 99th-percentile PSAT/NMSQT score and sustained academic record.",
    },
    {
      title: "NSLI-Y Scholarship",
      meta: "U.S. Department of State",
      detail:
        "National Security Language Initiative for Youth (NSLI-Y) scholarship program.",
    },
    {
      title: "President's Volunteer Service Award — Gold",
      meta: "AmeriCorps / The President's Volunteer Service Award",
      detail:
        "Recognizing significant community service, leadership, and volunteer contributions through educational and civic initiatives.",
    },
    {
      title: "$11K+ Earnings in Competitive No-Limit Hold'em",
      detail:
        "Generated over $11,000 in earnings, applying probabilistic reasoning, risk management, strategic decision-making, and behavioral analysis in high-variance environments.",
    },
    {
      title: "National Economics Challenge — State Finalist",
      meta: "2023",
      detail:
        "State finalist in the National Economics Challenge, the country's premier high-school economics competition, covering micro, macro, and the world economy.",
    },
    {
      title: "National Personal Finance Challenge — State Finalist",
      meta: "2023",
      detail:
        "State finalist in the National Personal Finance Challenge, competing in applied budgeting, saving, investing, and risk management.",
    },
    {
      title: "Burger King Scholarship",
      meta: "Burger King Foundation",
      detail:
        "Burger King Scholars award recognizing academic achievement, work experience, and community involvement.",
    },
    {
      title: "GameGala Game Design Competition — 2nd Place",
      meta: "2023",
      detail:
        "Placed 2nd overall for original game design and implementation.",
    },
    {
      title: "IgniteCS Programming Expo — 2nd Place",
      meta: "2023 · Web & App division",
      detail:
        "Placed 2nd in the Web & App division of the IgniteCS Programming Expo.",
    },
    {
      title: "Piano Certificate of Merit — Level 9",
      meta: "Certificate of Merit program",
      detail:
        "Completed Level 9 — nine years of examined study across performance, technique, sight-reading, and music theory.",
    },
  ] as readonly AwardEntry[],
  /** Completed coursework, by subject name (course codes stay off the site). */
  coursework: {
    "computer science": [
      "Intro Programming",
      "Data Structures",
      "Computer Organization",
      "Software Construction",
      "Algorithms",
      "Formal Languages & Automata",
      "Digital Logic Design",
    ],
    "math & statistics": [
      "Single-Variable Calculus",
      "Multivariable Calculus",
      "Vector Calculus",
      "Linear Algebra & Applications",
      "Differential Equations",
      "Discrete Structures",
      "Linear Algebra (Theory)",
      "Probability",
    ],
    physics: ["Mechanics", "Waves & Electromagnetism", "Electrodynamics & Optics"],
    linguistics: [
      "Intro Linguistic Analysis",
      "Phonetics",
      "Applied Phonology",
      "Syntax",
    ],
  },
  skills: [
    "Python",
    "C++",
    "TypeScript",
    "SQL",
    "PyTorch",
    "TensorFlow",
    "HuggingFace",
    "Pandas",
    "Flask",
    "React",
    "Next.js",
    "Machine Learning",
    "Statistical Inference",
    "Sparse Optimization",
    "NLP",
    "Reinforcement Learning",
    "Git",
    "Linux",
    "REST APIs",
  ],
} as const;
