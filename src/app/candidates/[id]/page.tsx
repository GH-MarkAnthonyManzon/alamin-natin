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

   // DEBUG: Log the candidate data
  console.log('Candidate data:', JSON.stringify(candidate, null, 2));
  console.log('Education type:', typeof candidate.education);
  console.log('Education value:', candidate.education);
  
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="flex flex-col md:flex-row items-start gap-8 mb-12">
        <div className="relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-muted">
          <User className="w-32 h-32 text-muted-foreground" />
        </div>
        <div className="pt-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">
            {candidate.full_name}
          </h1>
          <p className="text-xl text-primary mt-1">
            For {candidate.position_sought}
          </p>
          <p className="text-lg text-muted-foreground mt-2">
            {candidate.political_affiliation}
          </p>
        </div>
      </header>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Additional Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2">
            {candidate.education && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="text-primary" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {typeof candidate.education === 'string' 
                      ? candidate.education 
                      : Array.isArray(candidate.education) && candidate.education.length > 0
                      ? candidate.education.join('\n\n')
                      : 'No education information available.'}
                  </p>
                </CardContent>
              </Card>
            )}

            {candidate.platforms && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="text-primary" />
                    Platforms & Promises
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {typeof candidate.platforms === 'string' 
                      ? candidate.platforms 
                      : Array.isArray(candidate.platforms) && candidate.platforms.length > 0
                      ? candidate.platforms.join('\n\n')
                      : 'No platform information available.'}
                  </p>
                </CardContent>
              </Card>
            )}

            {candidate.career_timeline && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="text-primary" />
                    Career Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {typeof candidate.career_timeline === 'string' 
                      ? candidate.career_timeline 
                      : Array.isArray(candidate.career_timeline) && candidate.career_timeline.length > 0
                      ? candidate.career_timeline.join('\n\n')
                      : 'No career timeline available.'}
                  </p>
                </CardContent>
              </Card>
            )}

            {candidate.past_behaviors && (
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
                    {typeof candidate.past_behaviors === 'string' 
                      ? candidate.past_behaviors 
                      : Array.isArray(candidate.past_behaviors) && candidate.past_behaviors.length > 0
                      ? candidate.past_behaviors.join('\n\n')
                      : 'No past behavior information available.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                More detailed information will be added here as it becomes available.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}