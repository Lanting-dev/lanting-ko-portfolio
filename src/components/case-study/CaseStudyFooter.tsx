import { FooterFlipName } from "@/components/footer/FooterFlipName";
import { FooterMeta } from "@/components/footer/FooterMeta";

export function CaseStudyFooter() {
  return (
    <footer className="case-study-footer site-footer" aria-label="Site footer">
      <FooterFlipName />
      <FooterMeta />
    </footer>
  );
}
