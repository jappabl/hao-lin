import { MacbookScroll } from "@/components/ui/macbook-scroll";

export default function MacbookScrollDemo() {
  return (
    <div className="w-full bg-white dark:bg-[#0B0B0F]">
      <MacbookScroll
        title={
          <span>
            Currently shipping <br />
            <a
              href="https://tolus.dev"
              target="_blank"
              rel="noopener"
              className="underline decoration-1 underline-offset-[6px] transition-colors hover:text-[#ff4c24]"
            >
              tolus.dev
            </a>
          </span>
        }
        src={`/tolus-hero.webm`}
        showGradient={false}
      />
    </div>
  );
}
