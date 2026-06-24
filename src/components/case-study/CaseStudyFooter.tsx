import { FooterMeta } from "@/components/footer/FooterMeta";
import { FooterSandGarden } from "@/components/footer/FooterSandGarden";

export function CaseStudyFooter() {
  return (
    <footer className="case-study-footer site-footer" aria-label="Site footer">
      <FooterSandGarden footerProgress={0.9} bloom />
      <FooterMeta />
    </footer>
  );
}
