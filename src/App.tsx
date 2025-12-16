import {
  BookOpen,
  Briefcase,
  Github,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Terminal,
  User,
} from 'lucide-react'
import { education, experience, highlights, languages, personalInfo, skills } from './data/resume'

const cvPdfUrl = `${import.meta.env.BASE_URL}Yehor_Shapanov_Tech_Lead_CV.pdf`

export default function App() {
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
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" /> {personalInfo.email}
              </a>
              <a
                href={`tel:${personalInfo.phone}`}
                className="flex items-center hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" /> {personalInfo.phone}
              </a>
              <a
                href={`https://github.com/${personalInfo.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-white transition-colors"
              >
                <Github className="w-4 h-4 mr-2" /> {personalInfo.github}
              </a>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> {personalInfo.location}
              </span>
            </div>
          </div>

          {/* Quick Stats / Highlights Cards */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map((highlight) => (
              <div
                key={highlight.label}
                className={`bg-slate-800 p-4 rounded-lg border-l-4 ${highlight.borderColorClassName}`}
              >
                <div className="text-3xl font-bold text-white">{highlight.value}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                  {highlight.label}
                </div>
              </div>
            ))}
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
                <h3 className="font-bold text-lg flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" /> Contact
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <a
                  href={cvPdfUrl}
                  download
                  className="flex items-center justify-center w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors font-semibold shadow-sm"
                >
                  Download CV (PDF)
                </a>
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
                {skills.map((skillGroup) => (
                  <div key={skillGroup.category}>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {skillGroup.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill) => (
                        <span
                          key={`${skillGroup.category}:${skill}`}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-default"
                        >
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
                {education.map((edu) => (
                  <div key={`${edu.school}:${edu.degree}:${edu.year}`}>
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
                {languages.map((language) => (
                  <li key={language.language} className="flex justify-between">
                    <span>{language.language}</span>
                    <span className="text-slate-500">{language.proficiency}</span>
                  </li>
                ))}
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
                {experience.map((job) => (
                  <div
                    key={`${job.company}:${job.role}:${job.period}`}
                    className="pl-8 relative group"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-slate-300 group-hover:border-blue-500 transition-colors"></div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                      <h3 className="text-xl font-bold text-slate-800">{job.role}</h3>
                      <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
                        {job.period}
                      </span>
                    </div>

                    <h4 className="text-lg text-slate-600 font-medium mb-3">{job.company}</h4>

                    <p className="text-slate-600 mb-4 leading-relaxed">{job.description}</p>

                    {job.achievements && (
                      <ul className="space-y-2 mt-3">
                        {job.achievements.map((item) => (
                          <li
                            key={`${job.company}:${job.role}:${job.period}:${item}`}
                            className="flex items-start text-slate-600 text-sm"
                          >
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
              "I have a big passion for mathematics and low-level system designs. I have a logical
              and methodical approach to achieving tasks and objectives."
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
