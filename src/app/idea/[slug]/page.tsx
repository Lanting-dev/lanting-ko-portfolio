import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperimentalShowcasePage } from "@/components/experimental/ExperimentalShowcasePage";
import {
  EXPERIMENTAL_SLUGS,
  getExperimentalShowcase,
} from "@/lib/experimental/showcases";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return EXPERIMENTAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const showcase = getExperimentalShowcase(slug);
  if (!showcase) return { title: "Ideas · Lanting Ko" };

  return {
    title: `${showcase.title} · Ideas · Lanting Ko`,
    description: showcase.lede,
  };
}

export default async function IdeaProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const showcase = EXPERIMENTAL_SLUGS.includes(
    slug as (typeof EXPERIMENTAL_SLUGS)[number],
  )
    ? getExperimentalShowcase(slug)
    : undefined;
  if (!showcase) notFound();

  return <ExperimentalShowcasePage showcase={showcase} />;
}
