// src/app/compare/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getCandidates, type Candidate } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

export default function ComparePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidates() {
      try {
        const data = await getCandidates();
        setCandidates(data);
      } catch (error) {
        console.error('Failed to load candidates:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, []);

  const handleCheckboxChange = (candidate: Candidate) => {
    setSelectedCandidates((prev) =>
      prev.some((c) => c.id === candidate.id)
        ? prev.filter((c) => c.id !== candidate.id)
        : prev.length < 5 // Limit to 5 for better UI
        ? [...prev, candidate]
        : prev
    );
  };

  const comparisonRows = [
    {
      label: "Position Sought",
      getValue: (c: Candidate) => c.positionSought,
    },
    {
      label: "Political Affiliation",
      getValue: (c: Candidate) => c.politicalAffiliation,
    },
    {
      label: "Education",
      getValue: (c: Candidate) => (
        <div className="text-xs whitespace-pre-wrap max-w-md">
          {c.education || "No information available"}
        </div>
      ),
    },
    {
      label: "Career Timeline",
      getValue: (c: Candidate) => (
        <div className="text-xs whitespace-pre-wrap max-w-md">
          {c.careerTimeline || "No information available"}
        </div>
      ),
    },
    {
      label: "Platforms",
      getValue: (c: Candidate) => (
        <div className="text-xs whitespace-pre-wrap max-w-md">
          {c.platforms || "No information available"}
        </div>
      ),
    },
    {
      label: "Past Behaviors",
      getValue: (c: Candidate) => (
        <div className="text-xs whitespace-pre-wrap max-w-md">
          {c.pastBehaviors || "No information available"}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          Compare Candidates
        </h1>
        <p className="text-muted-foreground">
          Select up to 5 candidates to compare their background and platforms side-by-side.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Select Candidates {selectedCandidates.length > 0 && `(${selectedCandidates.length}/5)`}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="flex items-center space-x-2">
              <Checkbox
                id={candidate.id}
                onCheckedChange={() => handleCheckboxChange(candidate)}
                checked={selectedCandidates.some((c) => c.id === candidate.id)}
                disabled={
                  selectedCandidates.length >= 5 &&
                  !selectedCandidates.some((c) => c.id === candidate.id)
                }
              />
              <Label 
                htmlFor={candidate.id} 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {candidate.fullName}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedCandidates.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 font-headline">Comparison</h2>
          <Card>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] font-semibold text-base sticky left-0 bg-background z-10">
                      Feature
                    </TableHead>
                    {selectedCandidates.map((c) => (
                      <TableHead key={c.id} className="font-semibold text-base min-w-[300px]">
                        {c.fullName}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonRows.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="font-medium sticky left-0 bg-background z-10">
                        {row.label}
                      </TableCell>
                      {selectedCandidates.map((c) => (
                        <TableCell key={c.id} className="align-top">
                          {row.getValue(c)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </Card>
        </div>
      )}

      {selectedCandidates.length === 0 && (
        <Card className="mt-8">
          <CardContent className="py-12 text-center text-muted-foreground">
            Select candidates above to start comparing their profiles.
          </CardContent>
        </Card>
      )}
    </div>
  );
}