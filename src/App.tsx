import { Mail, Phone, MapPin, Globe, User, Briefcase, BookOpen, Terminal, Send, MessageCircle } from 'lucide-react';

const App = () => {
  const personalInfo = {
    name: "Yehor Shapanov",
    role: "Tech Lead & Senior Software Engineer",
    email: "hiiegor@gmail.com",
    phone: "+380975610959",
    location: "Kyiv, Ukraine",
    telegram: "yehorshapanov",
    whatsapp: "380991380940",
    summary: "After 10 years of software development and architecture building, I help customers build modern solutions that meet their unique business needs. My passion lies in Go programming, DevOps, and building backend infrastructure for high-load projects. I have a solid understanding of OOP, software engineering principles, and experience leading projects and communicating with clients.",
  };

  const skills = [
    { category: "Languages", items: ["Go (Golang)", "C++", "Swift", "Objective-C", "JavaScript", "Python", "C"] },
    { category: "Infrastructure & DevOps", items: ["Kubernetes", "Docker", "Terraform", "Ansible", "AWS", "Helm", "Prometheus", "Grafana"] },
    { category: "Web & Mobile", items: ["React", "Node.js", "Angular", "iOS (Cocoa Touch)", "React Native"] },
    { category: "Databases", items: ["PostgreSQL", "MongoDB", "DynamoDB", "Clickhouse", "ElasticSearch", "CockroachDB", "Redis"] },
    { category: "Architecture", items: ["Microservices", "High-load Systems", "System Design", "OOP/OOD", "Design Patterns", "Cryptography"] },
  ];

  const experience = [
    {
      company: "EvoPlay",
      role: "Golang Team Lead",
      period: "February 2020 - Present",
      description: "Spearheaded the development and integration of high-load, performance-optimized solutions focusing on blockchain technology (TON).",
      achievements: [
        "Led integration of TON blockchain technology and smart contract development.",
        "Managed a large GCE cluster with over 200 microservices.",
        "Implemented robust, scalable systems using C++ and Go.",
        "Developed TCP/IP-based networking solutions.",
        "Stack: Golang, Kubernetes, Helm, Prometheus, RabbitMQ, Jaeger, C++."
      ]
    },
    {
      company: "Firebolt.io",
      role: "Senior DevOps Engineer",
      period: "August 2020 - January 2022",
      description: "Responsible for Cloud Architecture and delivery process for a huge Data Warehouse startup (Snowflake competitor).",
      achievements: [
        "Managed high-scale cloud infrastructure.",
        "Stack: Kubernetes, Helm, Prometheus, Grafana, Loki, Clickhouse, CockroachDB, AWS."
      ]
    },
    {
      company: "Private Projects / Startups",
      role: "Senior Backend / AI Engineer",
      period: "May 2020 - August 2020",
      description: "Worked on 'Dialog System' (AI chatbot) and 'Biltrade' (HFT startup).",
      achievements: [
        "Built SoA seq2seq model training on AWS GPUs (Tensorflow, LSTM, CUDA).",
        "Built high-performance backend for HFT startup in Go.",
        "Extended Kubernetes to service HPC workloads."
      ]
    },
    {
      company: "Amazon Ring",
      role: "Senior iOS Developer",
      period: "February 2020 - May 2020",
      description: "Worked on Rings Core App using Swift, RxSwift, and Reactive Cocoa."
    },
    {
      company: "Syngenta (Intellias)",
      role: "Team Lead",
      period: "December 2018 - February 2020",
      description: "Led a newly created Lab for a global genetics leader. Built teams from scratch, managed architectural discussions, and delivery pipelines.",
      achievements: [
        "Migrated projects from Fargate to EKS.",
        "Set up Kubernetes for automation and scaling.",
        "Tech lead for numerous projects (React, Node, Go, Python).",
        "Mentored team and prepared presales."
      ]
    },
    {
      company: "Epam Systems",
      role: "Mobile Solutions Lead / Senior Dev",
      period: "December 2017 - December 2018",
      description: "Led mobile teams (React-Native, iOS/Android). Relocated to LA for Ticketmaster project.",
      achievements: [
        "Led mobile experience for incoming projects.",
        "Created Product Delivery pipelines."
      ]
    },
    {
      company: "Previous Experience",
      role: "Senior iOS Developer",
      period: "2010 - 2017",
      description: "Various senior roles at companies like Class.me, Swisscom (Evoja), BetBull, Yandex, Ciklum, and Luxoft. Focused on high-quality mobile application development, architecture planning, and working directly with international customers."
    },
    {
      company: "Ministry of Defence (Design Bureau)",
      role: "Electrical Engineer",
      period: "May 2008 - May 2010",
      description: "Designed electronics and firmware for military-sector design bureau. Worked with C, C++, Crypto, and electrical schemes."
    }
  ];

  const education = [
    {
      degree: "Master of Physics (Nanoelectronics)",
      school: "National University of Ukraine",
      year: "2011"
    },
    {
      degree: "Yandex Data School",
      school: "Computer Science",
      year: "2014 (1 Semester)"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header / Hero Section */}
      <header className="bg-slate-900 text-white pb-12 pt-16 px-6 lg:px-24 shadow-xl">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{personalInfo.name}</h1>
            <p className="text-xl md:text-2xl text-blue-400 font-medium">{personalInfo.role}</p>
            <p className="text-slate-300 leading-relaxed max-w-2xl text-lg">
              {personalInfo.summary}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4 text-sm text-slate-300">
              <a href={`mailto:${personalInfo.email}`} className="flex items-center hover:text-white transition-colors">
                <Mail className="w-4 h-4 mr-2" /> {personalInfo.email}
              </a>
              <a href={`tel:${personalInfo.phone}`} className="flex items-center hover:text-white transition-colors">
                <Phone className="w-4 h-4 mr-2" /> {personalInfo.phone}
              </a>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> {personalInfo.location}
              </span>
            </div>
          </div>
          
          {/* Quick Stats / Highlights Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="text-3xl font-bold text-white">10+</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Years Exp.</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-emerald-500">
              <div className="text-3xl font-bold text-white">200+</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Microservices</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-purple-500">
              <div className="text-3xl font-bold text-white">Tech</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Leadership</div>
            </div>
             <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-orange-500">
              <div className="text-3xl font-bold text-white">AWS</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Cloud Arch</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-6 lg:px-12 -mt-8 mb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar (Skills & Info) */}
          <aside className="space-y-6">
            
            {/* Contact CTA */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg flex items-center"><User className="w-5 h-5 mr-2 text-blue-600"/> Contact</h3>
                </div>
                <div className="space-y-3 text-sm">
                    <a 
                      href={`https://t.me/${personalInfo.telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold shadow-sm"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Chat on Telegram
                    </a>
                    
                    <a 
                      href={`https://wa.me/${personalInfo.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold shadow-sm"
                    >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat on WhatsApp
                    </a>
                </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-xl mb-6 flex items-center text-slate-900 border-b pb-3">
                <Terminal className="w-6 h-6 mr-2 text-blue-600" /> Technical Skills
              </h3>
              
              <div className="space-y-6">
                {skills.map((skillGroup, idx) => (
                  <div key={idx}>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{skillGroup.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill, sIdx) => (
                        <span key={sIdx} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-xl mb-6 flex items-center text-slate-900 border-b pb-3">
                <BookOpen className="w-6 h-6 mr-2 text-blue-600" /> Education
              </h3>
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <h4 className="font-bold text-slate-800">{edu.school}</h4>
                    <p className="text-blue-600 text-sm">{edu.degree}</p>
                    <p className="text-slate-500 text-xs mt-1">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>

             {/* Languages */}
             <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-xl mb-6 flex items-center text-slate-900 border-b pb-3">
                <Globe className="w-6 h-6 mr-2 text-blue-600" /> Languages
              </h3>
              <ul className="space-y-2 text-sm">
                  <li className="flex justify-between"><span>Ukrainian</span> <span className="text-slate-500">Native</span></li>
                  <li className="flex justify-between"><span>Russian</span> <span className="text-slate-500">Native</span></li>
                  <li className="flex justify-between"><span>English</span> <span className="text-slate-500">Advanced</span></li>
              </ul>
            </div>

          </aside>

          {/* Right Main Content (Experience) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-md min-h-[500px]">
              <div className="flex items-center justify-between mb-8 border-b pb-4">
                <h2 className="text-2xl font-bold flex items-center text-slate-900">
                  <Briefcase className="w-7 h-7 mr-3 text-blue-600" /> Work Experience
                </h2>
              </div>

              <div className="relative border-l-2 border-slate-200 ml-3 space-y-12">
                {experience.map((job, idx) => (
                  <div key={idx} className="pl-8 relative group">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-slate-300 group-hover:border-blue-500 transition-colors"></div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                      <h3 className="text-xl font-bold text-slate-800">{job.role}</h3>
                      <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
                        {job.period}
                      </span>
                    </div>
                    
                    <h4 className="text-lg text-slate-600 font-medium mb-3">{job.company}</h4>
                    
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {job.description}
                    </p>

                    {job.achievements && (
                      <ul className="space-y-2 mt-3">
                        {job.achievements.map((item, aIdx) => (
                          <li key={aIdx} className="flex items-start text-slate-600 text-sm">
                            <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

            </div>
            
            {/* Footer Quote / Additional */}
            <div className="bg-slate-900 text-slate-300 p-8 rounded-xl text-center italic">
              "I have a big passion for mathematics and low-level system designs. I have a logical and methodical approach to achieving tasks and objectives."
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;