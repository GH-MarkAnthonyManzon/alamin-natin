import { getCandidates } from "@/lib/supabase";
import { SearchCandidates } from "@/components/search-candidates";

export const revalidate = 3600;

export default async function CandidatesPage() {
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
      </div>
      
      <SearchCandidates initialCandidates={candidates} />
    </div>
  );
}