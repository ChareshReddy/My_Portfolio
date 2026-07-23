export const personalInfo = {
  name: "Charesh Reddy Guntakrindapalli",
  title: "Data Engineer",
  subtitle: "Specializing in PySpark • Databricks • SQL • Delta Lake",
  location: "Tirupati, Andhra Pradesh, India",
  email: "chareshreddy@gmail.com",
  phone: "+91 9493223544",
  github: "https://github.com/ChareshReddy",
  linkedin: "https://linkedin.com/in/charesh-reddy-g", // A standard professional fallback
};

export const summary = {
  heading: "Pipeline Architect & Optimization Engineer",
  text: "Results-oriented Data Engineer with hands-on experience designing, developing, and maintaining high-throughput ETL/ELT pipelines in cloud and hybrid environments. Proficient in PySpark, Databricks, Delta Lake, and SQL, with a deep focus on automated data validation, lakehouse performance tuning, and schema evolution. Skilled in converting raw unstructured and semi-structured datasets into optimized, analytics-ready structures that enable fast, data-driven decisions and reduce overall operational compute costs.",
};

export const skills = {
  categories: [
    {
      name: "Core Languages",
      items: [
        { name: "Python", level: 90 },
        { name: "SQL", level: 92 },
      ]
    },
    {
      name: "Big Data & Cloud Systems",
      items: [
        { name: "Apache Spark", level: 88 },
        { name: "PySpark", level: 90 },
        { name: "Databricks", level: 85 },
        { name: "Delta Lake", level: 85 },
      ]
    },
    {
      name: "Databases & Storage",
      items: [
        { name: "MySQL", level: 85 },
        { name: "SQL Server", level: 80 },
        { name: "Parquet / Delta / JSON / CSV", level: 92 },
      ]
    },
    {
      name: "Methodologies & Tools",
      items: [
        { name: "ETL / ELT Pipelines", level: 90 },
        { name: "Data Quality & Validation", level: 88 },
        { name: "Git & GitHub", level: 85 },
      ]
    }
  ]
};

export const experience = [
  {
    role: "Data Engineer",
    company: "Next IT Point Intellectual Services Pvt. Ltd.",
    location: "Hyderabad, India (Remote/Hybrid)",
    period: "Jun 2024 – Present",
    type: "Full-Time",
    highlights: "Intern-to-Fulltime Progression",
    achievements: [
      "Engineered end-to-end ETL pipelines in Databricks using PySpark, automating ingestion, parsing, and cleaning of high-volume client datasets.",
      "Implemented a comprehensive metadata-driven data validation framework that checks schemas and integrity constraints, securing 99.9% clean data loads in gold Delta tables.",
      "Optimized query runtimes by restructuring Delta Lake tables using partitioning, Z-Ordering, and vacuuming, reducing cloud compute resource consumption by 30%.",
      "Integrated on-premise SQL Server and cloud databases, synchronizing transactional logs into a central Lakehouse repository for BI reporting.",
      "Promoted to full-time Data Engineer following a highly successful internship where I delivered critical customer intelligence tables ahead of schedule."
    ]
  },
  {
    role: "Data Engineer Intern",
    company: "Next IT Point Intellectual Services Pvt. Ltd.",
    location: "Hyderabad, India (Remote/Hybrid)",
    period: "Jan 2024 – Jun 2024",
    type: "Internship",
    highlights: "Foundational System Design",
    achievements: [
      "Assisted in migrating legacy MySQL database storage structures to optimized Parquet and Delta formats.",
      "Wrote Spark SQL analytics queries to construct daily e-commerce performance logs, saving analysts 5+ hours of manual compilation each week.",
      "Configured git branch workflows and automation hooks for deployment verification in staging environments."
    ]
  }
];

export const projects = [
  {
    title: "Retail Sales Data Pipeline",
    environment: ["PySpark", "Databricks", "Delta Lake", "Azure Blob", "SQL Server"],
    sources: "Retail Transaction Logs (CSV), Customer CRM Profiles (JSON)",
    outcome: "Built an incremental daily ingestion pipeline processing millions of rows. Created clean Silver and Gold reporting tables. Implemented schema enforcement to isolate corrupt records into quarantine directories, improving reporting pipeline reliability by 45%.",
  },
  {
    title: "Customer 360 Data Platform",
    environment: ["PySpark", "Databricks", "Delta Lake", "MySQL", "Git"],
    sources: "Web Clickstream Logs (JSON), Loyalty Accounts (Parquet), Support Tickets (CSV)",
    outcome: "Designed an identity-resolution pipeline that merged disparate data streams into a unified customer behavior profile. Utilized Delta Lake MERGE operations to process late-arriving events, reducing profile update times from hours to under 12 minutes.",
  },
  {
    title: "E-Commerce Analytics Engine",
    environment: ["Python", "Spark SQL", "Databricks", "Delta Lake", "GitHub"],
    sources: "Inventory Logs (Parquet), Transaction History (Delta), Web Traffic logs",
    outcome: "Developed real-time rolling metrics tracking sales velocity, product popularity, and stock depletion rates. Enabled downstream dashboards to refresh within 2 minutes of database updates, eliminating delays in stock alerts."
  }
];

export const education = [
  {
    degree: "Bachelor of Technology in Information Technology",
    institution: "JNTUA University (Affiliated College)",
    location: "Andhra Pradesh, India",
    details: "Key coursework: Database Management Systems, Data Structures & Algorithms, Software Engineering, Big Data Analytics.",
  }
];

export const certifications = [
  {
    title: "Java Full Stack Developer Certificate",
    issuer: "JSPiders Training Institute",
    year: "2024",
    status: "Completed",
    skills: "Java SE, Spring Boot, Hibernate, Web Technologies, Database Integration",
  },
  {
    title: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    issuer: "Microsoft",
    year: "2026",
    status: "In Progress",
    skills: "Cloud Concepts, Azure Architecture, Services, Security, Governance & Management",
  }
];

export const contact = {
  email: "chareshreddy@gmail.com",
  phone: "+91 9493223544",
  githubUsername: "ChareshReddy",
  linkedinUsername: "charesh-reddy-g",
  ctaText: "Let's connect and build scalable data solutions together. You can reach out directly via email, phone, or fill out the pipeline stream contact form.",
};
