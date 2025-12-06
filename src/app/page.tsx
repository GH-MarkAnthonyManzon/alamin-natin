//added 2:48pm 12/6/25 updated the whole file

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, Users, Scale } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const literacyTopics = [
  {
    id: "topic-1",
    title: "What is the role of a Senator?",
    content:
      "Senators are elected to the Senate of the Philippines. Their primary roles include creating and debating laws (legislation), representing the interests of their constituents, and conducting oversight of the executive branch through hearings and inquiries. They serve a six-year term and can be re-elected for a maximum of two consecutive terms.",
  },
  {
    id: "topic-2",
    title: "How does the election process work?",
    content:
      "Philippine national elections are held every three years. Voters cast their ballots for candidates at various levels, from local officials to national positions like Senators and the President. The Commission on Elections (COMELEC) oversees the entire process, from voter registration to the counting of votes and proclamation of winners. Votes are typically cast electronically using automated vote-counting machines.",
  },
  {
    id: "topic-3",
    title: "How to Analyze a Candidate's Track Record",
    content:
      "When evaluating a candidate, consider their past actions, voting history on key bills, and previous positions held. Look for consistency between their promises and their behavior. Public records, news archives, and non-partisan watchdog reports are valuable sources for understanding a candidate's history beyond their campaign materials.",
  },
  {
    id: "topic-4",
    title: "Understanding Political Platforms",
    content:
      "A candidate's platform is their set of promises and proposed policies on various issues like the economy, healthcare, education, and foreign policy. It is important to read these platforms to understand what a candidate intends to do if elected. Compare the platforms of different candidates to see how their approaches differ.",
  },
  {
    id: "topic-5",
    title: "The Importance of Verifying Sources",
    content:
      "In the age of social media, misinformation can spread quickly. It is crucial to get information from reliable and credible sources, such as established news organizations, official government websites, and academic institutions. Be wary of unverified claims and always try to find the original source of information before forming an opinion.",
  },
];

export default function Home() {
  const heroImageUrl = "https://images.unsplash.com/photo-1564625432203-d3aa35318dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxwaGlsaXBwaW5lcyUyMGZsYWd8ZW58MHx8fHwxNzY0NTkzMTM0fDA&ixlib=rb-4.1.0&q=80&w=1080";

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              {heroImageUrl && (
                <Image
                  alt="Hero"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                  data-ai-hint="philippines politics"
                  height={600}
                  src={heroImageUrl}
                  width={600}
                />
              )}
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Alamin Natin
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Your non-partisan guide to civic transparency. We provide
                    verified, fact-based information on candidates to improve
                    voting literacy among Filipinos.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/candidates">Explore Candidates</Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="#voting-literacy">Voting Literacy</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Core Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Informed Decisions, Simplified
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed to provide clear, unbiased, and
                  traceable information.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <div className="grid gap-1">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-bold font-headline">
                    Candidate Profiles
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Comprehensive, sourced profiles including background, track
                  record, and platforms.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-3">
                  <Scale className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-bold font-headline">
                    Side-by-Side Comparison
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Neutrally compare candidates on experience, policy focus, and
                  history.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-bold font-headline">
                    Voting Literacy
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Understand the roles, processes, and how to analyze
                  candidate records.
                </p>
              </div>
              
            </div>
          </div>
        </section>

        {/* Voting Literacy Section */}
        <section id="voting-literacy" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4 mb-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">
                  Voting Literacy Hub
                </h2>
                <p className="text-muted-foreground">
                  Understand the fundamentals of Philippine elections and governance
                  to make an informed choice.
                </p>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {literacyTopics.map((topic) => (
                  <AccordionItem value={topic.id} key={topic.id}>
                    <AccordionTrigger className="text-lg text-left">
                      {topic.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                      {topic.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Neutrality Commitment Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Our Commitment to Neutrality
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                This platform aggregates publicly available information from
                official and reputable sources. It does not endorse any
                candidate and exists solely for voter education.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}