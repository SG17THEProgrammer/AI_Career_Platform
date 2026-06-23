import { ArrowRight, FileText, GraduationCap, LineChart, Search } from "lucide-react";

const workflow = [
  { label: "Resume", icon: FileText },
  { label: "Tailor", icon: ArrowRight },
  { label: "Research", icon: Search },
  { label: "Practice", icon: GraduationCap },
  { label: "Progress", icon: LineChart }
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 lg:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-normal text-teal-700">
              Career operating system
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
              AI Resume Tailor and Prep
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
              Upload resumes, tailor them to job descriptions, generate company research, and practice with a prep workspace that keeps learning progress close at hand.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-5">
            {workflow.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="border border-border bg-slate-50 p-4">
                  <Icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium text-slate-900">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-8 sm:px-8 lg:grid-cols-3">
        <div className="border border-border bg-white p-5">
          <h2 className="text-base font-semibold">Desktop Creation</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Resume upload, tailoring, research generation, and workspace setup begin on larger screens.
          </p>
        </div>
        <div className="border border-border bg-white p-5">
          <h2 className="text-base font-semibold">Mobile Revision</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Weak topics, flashcards, STAR stories, and company facts stay ready for quick review.
          </p>
        </div>
        <div className="border border-border bg-white p-5">
          <h2 className="text-base font-semibold">Admin Pipeline</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Daily job discovery, ranking, review, and pipeline tracking are isolated from user workflows.
          </p>
        </div>
      </section>
    </main>
  );
}
