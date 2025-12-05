// src/components/verify-tool.tsx
//added 11:37 pm 12/5/25 REPLACED THE WHOLE CODE
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { verifyCitationAction } from '@/app/actions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Terminal,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Info,
  Lightbulb,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { isOfficialSource, getOfficialSourceBadge } from '@/lib/official-sources';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Verifying...' : 'Verify Source'}
    </Button>
  );
}

export function VerifyTool() {
  const initialState = { message: '', sources: [], error: '' };
  const [state, dispatch] = useActionState(verifyCitationAction, initialState);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Source Verification Tool</CardTitle>
        <CardDescription>
          Enter a URL and a piece of text or a citation. The tool will check if
          the text can be sourced from the content of the provided URL.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <Input
            name="sourceUrl"
            placeholder="https://example.com/article"
            type="url"
            required
          />
          <Textarea
            name="citationText"
            placeholder="e.g., 'According to the 2016 COA report...'"
            rows={5}
            required
          />
          
          {/* AI Analysis Toggle - Default ON */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="enableAIAnalysis" 
              name="enableAIAnalysis"
              defaultChecked={true}
              value="true"
            />
            <Label 
              htmlFor="enableAIAnalysis" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Get AI assistance to evaluate this source (recommended)
            </Label>
          </div>
          
          <SubmitButton />
        </form>

        {state.error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state.message && (!state.sources || state.sources.length === 0) && (
          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Result</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        {/* Official Source Badge */}
        {state.sources && state.sources.length > 0 && (() => {
          const officialSource = isOfficialSource(state.sources[0]);
          if (officialSource) {
            return (
              <Alert className="mt-4 border-green-200 bg-green-50">
                <Info className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">
                  {getOfficialSourceBadge(officialSource)}
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  {officialSource.name} - {officialSource.description}
                </AlertDescription>
              </Alert>
            );
          }
          return null;
        })()}

        {state.sources && state.sources.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">
              Source Found in Provided URL:
            </h3>
            <div className="space-y-2">
              {state.sources.map((source, index) => (
                <Alert key={index}>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle className="flex items-center justify-between">
                    Source Found
                    <Link
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </AlertTitle>
                  <AlertDescription>
                    <p className="truncate">{source}</p>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* AI Analysis Section */}
        {state.aiAnalysis && (
          <div className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ai-analysis">
                <AccordionTrigger className="text-base font-semibold">
                  🤖 AI Source Analysis (Optional Guidance)
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {/* Source Overview */}
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                      Source Overview
                    </h4>
                    <p className="text-sm">
                      <strong>{state.aiAnalysis.sourceName}</strong> ({state.aiAnalysis.sourceType})
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Main Topic: {state.aiAnalysis.mainTopic}
                    </p>
                  </div>

                  {/* Observable Characteristics */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-sm">Observable Characteristics</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant={state.aiAnalysis.observations.hasAuthorship ? "default" : "secondary"}>
                          {state.aiAnalysis.observations.hasAuthorship ? "✓" : "✗"}
                        </Badge>
                        <span>Author Info</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={state.aiAnalysis.observations.hasCitations ? "default" : "secondary"}>
                          {state.aiAnalysis.observations.hasCitations ? "✓" : "✗"}
                        </Badge>
                        <span>Citations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={state.aiAnalysis.observations.hasContactInfo ? "default" : "secondary"}>
                          {state.aiAnalysis.observations.hasContactInfo ? "✓" : "✗"}
                        </Badge>
                        <span>Contact Info</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Style:</strong> {state.aiAnalysis.observations.writingStyle}
                    </p>
                  </div>

                  {/* Things to Consider */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-sm">Things to Consider</h4>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {state.aiAnalysis.considerations.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggested Verification Steps */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-sm">Suggested Verification Steps</h4>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      {state.aiAnalysis.suggestedVerificationSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Disclaimer */}
                  <Alert variant="default" className="bg-muted">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Disclaimer:</strong> This is AI-generated guidance to help you think critically. 
                      The analysis may be incomplete or incorrect. Always verify important information 
                      with multiple sources and use your own judgment.
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {/* AI Analysis Error (if it failed) */}
        {state.aiAnalysisError && (
          <Alert variant="default" className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {state.aiAnalysisError}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}