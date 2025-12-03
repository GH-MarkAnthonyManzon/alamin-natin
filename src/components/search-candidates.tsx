"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";

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

  // This is just for the client-side display
  // The actual rendering is done by the parent component
  return (
    <Input
      placeholder="Search for a candidate..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="max-w-sm"
    />
  );
}