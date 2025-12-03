import { notFound } from "next/navigation";
import { candidates } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Briefcase,
  GraduationCap,
  Gavel,
  CheckSquare,
  FileText,
  Link as LinkIcon,
  User,
} from "lucide-react";
import { Timeline, TimelineItem } from "@/components/timeline";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default async function CandidateProfilePage({ //added async
  params,
}: {
  params: Promise<{ id: string }>; //params: { id: string };
}) {
  const { id } = await params; // added

  const candidate = candidates.find((c) => c.id === id); //removed params 

  if (!candidate) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="flex flex-col md:flex-row items-start gap-8 mb-12">
        <div className="relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-muted">
            <User className="w-32 h-32 text-muted-foreground" />
        </div>
        <div className="pt-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">
            {candidate.fullName}
          </h1>
          <p className="text-xl text-primary mt-1">
            For {candidate.positionSought}
          </p>
          <p className="text-lg text-muted-foreground mt-2">
            {candidate.politicalAffiliation}
          </p>
        </div>
      </header>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Track Record</TabsTrigger>
          <TabsTrigger value="promises">Promises vs. Past</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="text-primary" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {candidate.education.map((edu, index) => (
                    <li key={index}>
                      <p className="font-semibold">{edu.degree}</p>
                      <p className="text-muted-foreground">
                        {edu.institution}, {edu.year}
                      </p>
                      <Link
                        href={edu.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <LinkIcon className="w-3 h-3" />
                        {edu.source.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-primary" />
                  Stated Platforms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {candidate.platforms.map((platform, index) => (
                    <li key={index}>
                      <p className="font-semibold">{platform.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {platform.description}
                      </p>
                      <Link
                        href={platform.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <LinkIcon className="w-3 h-3" />
                        {platform.source.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {candidate.controversies.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="text-primary" />
                    Notable Controversies / Cases
                  </CardTitle>
                  <CardDescription>
                    Based on publicly available records.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {candidate.controversies.map((con, index) => (
                      <li key={index}>
                        <p className="font-semibold">{con.title}</p>
                        <p className="text-sm text-muted-foreground my-1">
                          {con.summary}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Outcome:</span>{" "}
                          {con.outcome}
                        </p>
                        <Link
                          href={con.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <LinkIcon className="w-3 h-3" />
                          {con.source.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="text-primary" />
                Career Timeline
              </CardTitle>
              <CardDescription>
                A chronological history of positions held and notable actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline>
                {candidate.careerTimeline.map((item, index) => (
                  <TimelineItem
                    key={index}
                    {...item}
                    isLast={index === candidate.careerTimeline.length - 1}
                  />
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="promises" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="text-primary" />
                Promise vs. Past Behavior
              </CardTitle>
              <CardDescription>
                Juxtaposing campaign promises with historical actions without
                interpretation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {candidate.promises.map((item, index) => (
                  <div key={index}>
                    <div className="grid gap-4">
                      <div>
                        <h4 className="font-semibold text-lg">
                          Promise:
                        </h4>
                        <p className="italic">"{item.promise}"</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">
                          Related Historical Actions:
                        </h4>
                        {item.relatedActions.length > 0 ? (
                          <ul className="list-disc pl-5 mt-2 space-y-2 text-muted-foreground">
                            {item.relatedActions.map((action, actionIdx) => (
                              <li key={actionIdx}>
                                {action.description}{" "}
                                <Link
                                  href={action.source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                >
                                  <LinkIcon className="w-3 h-3" />
                                  ({action.source.label})
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground mt-2">
                            No direct historical actions found in the dataset.
                          </p>
                        )}
                      </div>
                    </div>
                    {index < candidate.promises.length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
