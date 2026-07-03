/**
 * Single source of truth for resume-style facts shown on the site.
 * Update this file when the resume changes.
 */

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
      title: "Smart Collaborative Online Platform for Programming Education",
      venue:
        "12th International Conference on Software Engineering and Applications (SEAS 2023), Toronto",
    },
    {
      title: "BrainBow: A Real-Time Inclusivity Index Using NLP",
      venue: "MLNLP 2024, Sydney",
    },
    {
      title:
        "Understanding the Role of Anxiety in Learning through Zebrafish: A Computational Model",
      venue: "Journal of Research High School, Vol. 2025(2), 108–120",
    },
    {
      title:
        "Design Concept of a Wearable Device for Sleep-Related Brain Wave Detection and Stimulation",
      venue: "IEEE ICDSCA 2024",
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
    "USA Computing Olympiad — Platinum Division",
    "VEX Robotics World Championship Finalist ×2",
    "AI Challengers — USA Regional Winner & Global Finalist (2023)",
    "OCSEF Raytheon Science & Engineering Special Award",
    "President's Volunteer Service Award — Gold (2022/23) & Silver (2021/22)",
    "Ignite CS Contest — 2nd Place, Web & App (2023)",
    "GameGala Game Design — 2nd Place (2023)",
    "Piano Certificate of Merit — Level 9",
    "National Economic Challenge & National Personal Finance Challenge — State Qualifier (2023)",
    "Multiple Model UN Awards — University High School",
  ],
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
