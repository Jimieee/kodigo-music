import { SiReact, SiTailwindcss, SiVite } from "react-icons/si";

const Footer = () => {
  return (

    <footer className="w-full border-t border-border bg-border text-muted-foreground text-sm font-medium">
      <div className="mx-auto max-w-screen-xl px-4 py-3 flex flex-wrap justify-center gap-2 sm:gap-4">
        <a
          href="https://github.com/Jimieee"
          className="hover:text-primary hover:underline whitespace-nowrap"
          target="_blank"
          rel="noopener noreferrer"
        >
          Developed with&nbsp;&#10084;&nbsp;&nbsp;by&nbsp;Jimieee
        </a>


        <span className="hidden sm:inline-block select-none before:content-['|'] before:px-2 before:text-muted-foreground" />

        <div className="flex items-center gap-3 whitespace-nowrap">
          <SiReact className="h-4 w-4 text-primary" title="React" />
          <SiVite className="h-4 w-4 text-primary" title="Vite" />
          <SiTailwindcss className="h-4 w-4 text-primary" title="Tailwind CSS" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;