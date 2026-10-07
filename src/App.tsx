import {
  Award,
  BookOpen,
  Briefcase,
  FolderOpen,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Star,
  Terminal,
  User,
} from 'lucide-react'
import {
  certifications,
  education,
  experience,
  featured,
  languages,
  personalInfo,
  projects,
  skills,
} from './data/resume'

const cvPdfUrl = `${import.meta.env.BASE_URL}Yehor_Shapanov_Tech_Lead_CV.pdf`

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-slate-900 px-6 pb-12 pt-16 text-white shadow-xl lg:px-24">
        <div className="mx-auto max-w-6xl space-y-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{personalInfo.name}</h1>
              <p className="text-xl font-medium text-blue-400 md:text-2xl">{personalInfo.role}</p>
              <span className="flex items-center text-slate-300">
                <MapPin className="mr-2 h-4 w-4" /> {personalInfo.location}
              </span>
            </div>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:border-blue-400 hover:text-white"
            >
              <Linkedin className="mr-2 h-4 w-4" /> LinkedIn profile
            </a>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-3 border-t border-slate-700 pt-5 text-sm text-slate-300">
            <a href={`mailto:${personalInfo.email}`} className="flex items-center hover:text-white">
              <Mail className="mr-2 h-4 w-4" /> {personalInfo.email}
            </a>
            <a href={`tel:${personalInfo.phone}`} className="flex items-center hover:text-white">
              <Phone className="mr-2 h-4 w-4" /> {personalInfo.phone}
            </a>
            <a
              href={`https://github.com/${personalInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-white"
            >
              <Github className="mr-2 h-4 w-4" /> {personalInfo.github}
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto mb-16 mt-8 max-w-6xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <aside className="space-y-6">
            <section className="rounded-xl bg-white p-6 shadow-md">
              <h2 className="mb-4 flex items-center text-lg font-bold">
                <User className="mr-2 h-5 w-5 text-blue-600" /> Contact
              </h2>
              <div className="space-y-3 text-sm">
                <a
                  href={cvPdfUrl}
                  download
                  className="flex w-full items-center justify-center rounded-lg bg-slate-900 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  Download CV (PDF)
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-lg bg-blue-700 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-800"
                >
                  <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                </a>
                <a
                  href={`https://t.me/${personalInfo.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-lg bg-blue-500 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-600"
                >
                  <Send className="mr-2 h-4 w-4" /> Chat on Telegram
                </a>
                <a
                  href={`https://wa.me/${personalInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-lg bg-green-600 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp
                </a>
              </div>
            </section>

            <section className="rounded-xl bg-white p-6 shadow-md">
              <h2 className="mb-6 flex items-center border-b pb-3 text-xl font-bold text-slate-900">
                <Terminal className="mr-2 h-6 w-6 text-blue-600" /> Skills
              </h2>
              <div className="space-y-6">
                {skills.map((group) => (
                  <div key={group.category}>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      {group.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <span
                          key={`${group.category}:${skill}`}
                          className="cursor-default rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-white p-6 shadow-md">
              <h2 className="mb-6 flex items-center border-b pb-3 text-xl font-bold text-slate-900">
                <BookOpen className="mr-2 h-6 w-6 text-blue-600" /> Education
              </h2>
              <div className="space-y-5">
                {education.map((item) => (
                  <div key={`${item.school}:${item.degree}`}>
                    <h3 className="font-bold text-slate-800">{item.school}</h3>
                    <p className="text-sm text-blue-600">{item.degree}</p>
                    {item.year && <p className="mt-1 text-xs text-slate-500">{item.year}</p>}
                    {item.details && <p className="mt-1 text-xs text-slate-500">{item.details}</p>}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-white p-6 shadow-md">
              <h2 className="mb-4 flex items-center border-b pb-3 text-xl font-bold text-slate-900">
                <Globe className="mr-2 h-6 w-6 text-blue-600" /> Languages
              </h2>
              <ul className="space-y-2 text-sm">
                {languages.map((language) => (
                  <li key={language.language} className="flex justify-between">
                    <span>{language.language}</span>
                    {language.proficiency && (
                      <span className="text-slate-500">{language.proficiency}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </aside>

          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-xl bg-white p-8 shadow-md">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">About</h2>
              <p className="leading-relaxed text-slate-700">{personalInfo.summary}</p>
              <p className="mt-4 text-sm text-slate-500">
                <span className="font-semibold text-slate-700">Specialties: </span>
                {personalInfo.specialties}
              </p>
            </section>

            <section className="min-h-[500px] rounded-xl bg-white p-8 shadow-md">
              <div className="mb-8 flex items-center border-b pb-4">
                <Briefcase className="mr-3 h-7 w-7 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Experience</h2>
              </div>

              <div className="relative ml-3 space-y-10 border-l-2 border-slate-200">
                {experience.map((job) => (
                  <article
                    key={`${job.company}:${job.role}:${job.period}`}
                    className="group relative pl-8"
                  >
                    <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-4 border-slate-300 bg-white transition-colors group-hover:border-blue-500" />
                    <div className="mb-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-lg font-bold text-slate-800">{job.role}</h3>
                      <span className="mt-2 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 sm:mt-0">
                        {job.period}
                      </span>
                    </div>
                    <h4 className="mb-1 text-base font-medium text-slate-600">{job.company}</h4>
                    {(job.employment || job.location) && (
                      <p className="mb-3 text-xs text-slate-400">
                        {[job.employment, job.location].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="leading-relaxed text-slate-600">{job.description}</p>
                    {job.achievements && (
                      <ul className="mt-3 space-y-2">
                        {job.achievements.map((item) => (
                          <li
                            key={`${job.company}:${item}`}
                            className="flex items-start text-sm text-slate-600"
                          >
                            <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-white p-8 shadow-md">
              <h2 className="mb-6 flex items-center border-b pb-4 text-2xl font-bold text-slate-900">
                <Award className="mr-3 h-7 w-7 text-blue-600" /> Licenses &amp; certifications
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {certifications.map((item) => (
                  <article key={`${item.name}:${item.issuer}`} className="rounded-lg bg-slate-50 p-4">
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.issuer}</p>
                    <p className="mt-1 text-xs text-slate-500">Issued {item.issued}</p>
                    {item.details && <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.details}</p>}
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-white p-8 shadow-md">
              <h2 className="mb-6 flex items-center border-b pb-4 text-2xl font-bold text-slate-900">
                <FolderOpen className="mr-3 h-7 w-7 text-blue-600" /> Projects
              </h2>
              <div className="space-y-5">
                {projects.map((project) => (
                  <article key={project.name}>
                    <h3 className="font-bold text-slate-800">{project.name}</h3>
                    <p className="mb-1 text-xs text-slate-400">Associated with {project.company}</p>
                    <p className="text-sm leading-relaxed text-slate-600">{project.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="flex items-start rounded-xl bg-slate-900 p-6 text-slate-300 shadow-md">
              <Star className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
              <div>
                <h2 className="font-bold text-white">Featured</h2>
                <p className="mt-1 font-medium">{featured.name}</p>
                <p className="mt-1 text-sm">{featured.description}</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
