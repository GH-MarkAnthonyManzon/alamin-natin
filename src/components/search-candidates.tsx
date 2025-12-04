"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import Link from "next/link";

interface Candidate {
  id: string;
  full_name: string;
  position_sought: string;
  political_affiliation: string;
}

interface SearchCandidatesProps {
  initialCandidates: Candidate[];
}

export function SearchCandidates({ initialCandidates }: SearchCandidatesProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCandidates = useMemo(() => {
    if (!searchTerm.trim()) {
      return initialCandidates;
    }
    
    const lowerSearch = searchTerm.toLowerCase();
    return initialCandidates.filter((candidate) =>
      candidate.full_name.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm, initialCandidates]);

  return (
    <>
      <Input
        placeholder="Search for a candidate..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm mb-8"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCandidates.map((candidate) => (
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

      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No candidates found matching "{searchTerm}"</p>
        </div>
      )}
    </>
  );
}