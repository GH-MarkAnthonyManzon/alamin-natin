// "use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCandidates } from "@/lib/supabase";
import Link from "next/link";
import { User } from "lucide-react";
import { SearchCandidates } from "@/components/search-candidates";

export const revalidate = 3600; // Revalidate every hour

export default async function CandidatesPage() {
  // Fetch candidates from Supabase
  const candidates = await getCandidates();

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          Candidates
        </h1>
        <p className="text-muted-foreground">
          Explore the profiles of executive-level candidates. All information is
          sourced from public records.
        </p>
        <SearchCandidates initialCandidates={candidates} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {candidates.map((candidate) => (
          <Link key={candidate.id} href={`/candidates/${candidate.id}`}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="p-0">
                <div className="aspect-square relative flex items-center justify-center bg-muted">
                  <User className="w-24 h-24 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-bold font-headline">
                  {candidate.full_name}
                </CardTitle>
                <CardDescription>
                  For {candidate.position_sought}
                </CardDescription>
                <p className="text-sm text-muted-foreground mt-2">
                  {candidate.political_affiliation}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {candidates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No candidates found.</p>
        </div>
      )}
    </div>
  );
}