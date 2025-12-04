// src/app/candidates/[id]/page.tsx
import { notFound } from "next/navigation";
import { getCandidateById } from "@/lib/supabase";
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
  GraduationCap,
  FileText,
  User,
  Briefcase,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getCandidateById(id);

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
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
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
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {candidate.education || 'No education information available.'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-primary" />
                  Platforms & Promises
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {candidate.platforms || 'No platform information available.'}
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="text-primary" />
                  Career Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {candidate.careerTimeline || 'No career timeline available.'}
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="text-primary" />
                  Past Behaviors
                </CardTitle>
                <CardDescription>
                  Based on publicly available records.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {candidate.pastBehaviors || 'No past behavior information available.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sources & References</CardTitle>
              <CardDescription>
                All information is sourced from publicly available records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(candidate.sources).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(candidate.sources).map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No sources available for this candidate.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}