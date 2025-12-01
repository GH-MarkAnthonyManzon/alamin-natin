import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { literacyTopics } from "@/lib/literacy-data";

export default function LiteracyPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4 mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-headline">
            Voting Literacy Hub
          </h1>
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
  );
}
