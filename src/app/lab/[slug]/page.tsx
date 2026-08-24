import { redirect } from "next/navigation";
import { EXPERIMENTAL_SLUGS } from "@/lib/experimental/showcases";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return EXPERIMENTAL_SLUGS.map((slug) => ({ slug }));
}

export default async function LabProjectRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/idea/${slug}`);
}
