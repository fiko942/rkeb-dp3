import { Github } from 'lucide-react';

export function FloatingGithubButton() {
  return (
    <a
      href="https://github.com/fiko942/rkeb-dp3.git"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open GitHub Repository"
      title="Open GitHub Repository"
      className="github-float group fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-white/95 text-excel-dark shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-excel-primary"
    >
      <Github className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-md bg-excel-dark px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        View GitHub
      </span>
    </a>
  );
}
