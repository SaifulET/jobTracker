import mongoose from "mongoose";
import fs from "fs";
import path from "path";

function getMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const envPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const match = content.match(/^MONGODB_URI=(.+)$/m);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  }

  return "mongodb://127.0.0.1:27017/jobtracker";
}

const MONGODB_URI = getMongoUri();

const sampleJobs = [
  {
    jobTitle: "Senior Full Stack Engineer",
    companyName: "Stripe",
    recruiterName: "Sarah Jenkins",
    recruiterEmail: "sarah.j@stripe-careers.example.com",
    location: "Remote (Global)",
    jobDescriptionShort: "Architect and build developer-first payment billing APIs and real-time dashboard experiences in TypeScript, React, and Go.",
    jobDescriptionFull: "We are seeking a Senior Full Stack Engineer to join the Billing Platform team at Stripe. You will be responsible for crafting high-scale financial infrastructure and intuitive UI workflows used by millions of businesses worldwide.\n\nKey Responsibilities:\n- Design low-latency REST & GraphQL APIs.\n- Build robust UI components in React and TypeScript.\n- Ensure 99.999% platform availability.",
    cvLink: "https://drive.google.com/file/d/cv-fullstack-2026/view",
    cvName: "Saiful_FullStack_Resume_V3.pdf",
    websiteLink: "https://stripe.com/jobs",
    applicationDate: new Date("2026-09-12"),
    status: "Interview",
    interviewUpdates: [
      {
        date: new Date("2026-09-15"),
        title: "Recruiter Screen Passed",
        content: "Had a 30-min call with Sarah. Discussed background in Next.js & distributed systems. Advanced to technical round.",
      },
      {
        date: new Date("2026-09-22"),
        title: "System Design & Architecture Round",
        content: "Completed 60-min system design interview on designing a high-throughput event processing pipeline. Great positive feedback!",
      },
    ],
    followUps: [
      {
        date: new Date("2026-09-24"),
        type: "Gmail",
        subject: "Thank you & follow up regarding Stripe System Design Interview",
        content: "Sent thank you note to Sarah and the engineering panel.",
        note: "Sarah replied stating they will share next round details soon.",
      },
    ],
    followUpCount: 1,
    extraNote: "Focus on idempotent payment request handling and React performance optimizations for round 3.",
  },
  {
    jobTitle: "Lead Frontend Architect",
    companyName: "Shopify",
    recruiterName: "Marcus Vance",
    recruiterEmail: "marcus.v@shopify-talent.example.com",
    location: "Remote (North America / EMEA)",
    jobDescriptionShort: "Lead frontend architecture for high-conversion merchant checkout and Polaris design system components.",
    jobDescriptionFull: "Shopify is looking for a Lead Frontend Architect to scale our web merchant tools. You will lead technical standards, build micro-frontends, and mentor a distributed team of engineers.",
    cvLink: "https://drive.google.com/file/d/cv-frontend-lead/view",
    cvName: "Saiful_Frontend_Lead_CV.pdf",
    websiteLink: "https://shopify.com/careers",
    applicationDate: new Date("2026-09-05"),
    status: "Offer",
    interviewUpdates: [
      {
        date: new Date("2026-09-10"),
        title: "Technical Pairing",
        content: "Live React & TypeScript coding exercise. Built a virtualized list with smooth 60fps animations.",
      },
      {
        date: new Date("2026-09-18"),
        title: "Executive & Culture Fit Round",
        content: "Met VP of Engineering. Discussed leadership philosophy and scaling engineering culture.",
      },
      {
        date: new Date("2026-09-28"),
        title: "Official Offer Extended",
        content: "Received written offer package with competitive base, stock options, and remote stipend!",
      },
    ],
    followUps: [
      {
        date: new Date("2026-09-29"),
        type: "Gmail",
        subject: "Offer Received - Reviewing Terms",
        content: "Acknowledged offer receipt and requested clarification on equity vesting schedule.",
        note: "Marcus responded with full details.",
      },
    ],
    followUpCount: 1,
    extraNote: "Negotiating signing bonus and remote gear budget. Decision deadline Oct 15.",
  },
  {
    jobTitle: "Staff Software Engineer",
    companyName: "Google",
    recruiterName: "Elena Rostova",
    recruiterEmail: "elena.recruiting@google-careers.example.com",
    location: "Zurich, Switzerland / Hybrid",
    jobDescriptionShort: "Build large-scale AI workflow tools and developer dashboards in Cloud Compute Core.",
    jobDescriptionFull: "Google Cloud is expanding its AI orchestration platform. As a Staff Engineer, you will drive technical strategy, system resilience, and multi-tenant cloud scalability.",
    cvLink: "https://drive.google.com/file/d/cv-staff-engineer/view",
    cvName: "Saiful_Staff_Engineer_CV.pdf",
    websiteLink: "https://careers.google.com",
    applicationDate: new Date("2026-09-20"),
    status: "Technical Test",
    interviewUpdates: [
      {
        date: new Date("2026-09-25"),
        title: "Take-Home Engineering Challenge Received",
        content: "Received distributed rate-limiter and concurrency simulation project. Deadline in 5 days.",
      },
    ],
    followUps: [],
    followUpCount: 0,
    extraNote: "Algorithm focus: token bucket rate limiting and Redis cluster failover.",
  },
  {
    jobTitle: "Principal Product Engineer",
    companyName: "Vercel",
    recruiterName: "David Chen",
    recruiterEmail: "d.chen@vercel-careers.example.com",
    location: "Remote",
    jobDescriptionShort: "Work directly on Next.js developer experience, edge compute integrations, and AI SDK tooling.",
    jobDescriptionFull: "Help us build the frontend cloud. At Vercel, you will innovate at the intersection of AI, edge computing, and modern web application frameworks.",
    cvLink: "https://drive.google.com/file/d/cv-product-engineer/view",
    cvName: "Saiful_Resume_NextJS.pdf",
    websiteLink: "https://vercel.com/careers",
    applicationDate: new Date("2026-09-28"),
    status: "Follow Up",
    interviewUpdates: [
      {
        date: new Date("2026-09-30"),
        title: "Application Submitted",
        content: "Direct referral submission through engineering manager.",
      },
    ],
    followUps: [
      {
        date: new Date("2026-10-04"),
        type: "Gmail",
        subject: "Following up on Principal Product Engineer application",
        content: "Sent polite follow-up email inquiring on application status.",
        note: "Awaiting recruiter response.",
      },
    ],
    followUpCount: 1,
    extraNote: "Highlight contributions to open source Next.js libraries and edge middleware.",
  },
  {
    jobTitle: "Senior React Native & Web Developer",
    companyName: "Spotify",
    recruiterName: "Astrid Lindgren",
    recruiterEmail: "astrid.l@spotify-jobs.example.com",
    location: "Stockholm, Sweden",
    jobDescriptionShort: "Build seamless audio streaming web portals and creator studio management dashboards.",
    jobDescriptionFull: "Join Spotify's Creator Studio organization. You will build high-traffic web and cross-platform experiences for podcasters and musical artists.",
    cvLink: "https://drive.google.com/file/d/cv-fullstack/view",
    cvName: "Saiful_Senior_Engineer.pdf",
    websiteLink: "https://www.lifeatspotify.com",
    applicationDate: new Date("2026-09-18"),
    status: "Applied",
    interviewUpdates: [],
    followUps: [],
    followUpCount: 0,
    extraNote: "Application under initial review by hiring manager.",
  },
  {
    jobTitle: "Full Stack Platform Engineer",
    companyName: "Airbnb",
    recruiterName: "Michael Scott",
    recruiterEmail: "michael.s@airbnb-talent.example.com",
    location: "Remote / San Francisco",
    jobDescriptionShort: "Design resilient microservices, GraphQL gateways, and booking calendar components.",
    jobDescriptionFull: "Scale Airbnb's host and guest communication ecosystem with real-time web technologies and distributed databases.",
    cvLink: "https://drive.google.com/file/d/cv-fullstack/view",
    cvName: "Saiful_Resume_2026.pdf",
    websiteLink: "https://careers.airbnb.com",
    applicationDate: new Date("2026-08-15"),
    status: "Rejected",
    interviewUpdates: [
      {
        date: new Date("2026-08-25"),
        title: "Screening Completed",
        content: "Good conversation regarding previous hospitality tech domain experience.",
      },
      {
        date: new Date("2026-09-02"),
        title: "Position Filled Internally",
        content: "Received polite rejection stating role was filled by internal transfer. Encouraged to re-apply in 6 months.",
      },
    ],
    followUps: [],
    followUpCount: 0,
    extraNote: "Keep in touch with recruiter on LinkedIn for Q1 openings.",
  },
  {
    jobTitle: "Founding Engineer",
    companyName: "Nexus AI (YC W26)",
    recruiterName: "Alex Zhao (Founder)",
    recruiterEmail: "alex@nexusai-stealth.example.com",
    location: "Remote / San Francisco",
    jobDescriptionShort: "Early-stage founding engineer building autonomous AI agents for enterprise developer productivity.",
    jobDescriptionFull: "Join as Employee #3 with significant equity. Build full-stack autonomous code intelligence systems using Next.js, Node.js, Python, and Vector DBs.",
    cvLink: "https://drive.google.com/file/d/cv-founding/view",
    cvName: "Saiful_Founding_Engineer.pdf",
    websiteLink: "https://ycombinator.com/companies",
    applicationDate: new Date("2026-10-01"),
    status: "Interview",
    interviewUpdates: [
      {
        date: new Date("2026-10-03"),
        title: "Founder Chat",
        content: "1-on-1 with founder Alex Zhao. Deep dive into product vision, speed of execution, and stack choices.",
      },
    ],
    followUps: [],
    followUpCount: 0,
    extraNote: "Next round is 2-hour architecture brainstorm session with co-founders.",
  },
  {
    jobTitle: "Senior TypeScript / Node.js Engineer",
    companyName: "Local Software Solutions Ltd",
    recruiterName: "Tanvir Ahmed",
    recruiterEmail: "tanvir@localsoft.example.com",
    location: "Dhaka, Bangladesh",
    jobDescriptionShort: "Develop enterprise ERP and fintech payment reconciliation engines for regional commercial banks.",
    jobDescriptionFull: "Leading Bangladeshi fintech enterprise seeking Senior Engineer with deep MongoDB, PostgreSQL, and Node.js microservices background.",
    cvLink: "https://drive.google.com/file/d/cv-local/view",
    cvName: "Saiful_Resume_Fintech.pdf",
    websiteLink: "https://localsoft.example.com",
    applicationDate: new Date("2026-09-10"),
    status: "Saved",
    interviewUpdates: [],
    followUps: [],
    followUpCount: 0,
    extraNote: "Drafting custom cover letter highlighting local banking integration experience.",
  }
];

const sampleProfile = {
  fullName: "Saiful Islam",
  professionalTitle: "Executive Full-Stack Developer",
  email: "saiful.dev@example.com",
  phone: "+880 1700 123456",
  location: "Dhaka, Bangladesh",
  github: "https://github.com/saiful",
  linkedin: "https://linkedin.com/in/saiful",
  portfolio: "https://saiful.dev",
  defaultCv: "https://drive.google.com/file/d/saiful-cv-latest/view",
  defaultCvName: "Saiful_Islam_Executive_FullStack.pdf",
  bio: "Senior Full-Stack Developer with 6+ years of expertise in React, Next.js, Node.js, TypeScript, and high-concurrency cloud systems. Passionate about building delightful developer experiences and scalable web software.",
};

async function seed() {
  try {
    console.log("Connecting to MongoDB at:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    const db = mongoose.connection.db;

    // Drop and recreate jobs
    console.log("Seeding jobs collection...");
    await db.collection("jobs").deleteMany({});
    const insertedJobs = await db.collection("jobs").insertMany(
      sampleJobs.map((j) => ({
        ...j,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
    console.log(`Successfully seeded ${insertedJobs.insertedCount} job applications.`);

    // Seed profile
    console.log("Seeding profile...");
    await db.collection("profiles").deleteMany({});
    await db.collection("profiles").insertOne({
      ...sampleProfile,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Profile seeded successfully.");

    console.log("Database seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
