"use server";

import { verifySourceCitations } from "@/ai/flows/verify-source-citations";
import { z } from "zod";

const VerifyCitationSchema = z.object({
  citationText: z.string().min(10, "Please enter more text to verify."),
});

type VerifyState = {
  sources?: string[] | string;
  error?: string;
  message?: string;
};

export async function verifyCitationAction(
  prevState: VerifyState,
  formData: FormData
): Promise<VerifyState> {
  const validatedFields = VerifyCitationSchema.safeParse({
    citationText: formData.get("citationText"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid input. " + validatedFields.error.flatten().fieldErrors.citationText?.[0],
    };
  }
  
  try {
    const result = await verifySourceCitations({ citationText: validatedFields.data.citationText });
    console.log('result', result)
    if (result) {
      return { sources: result as string, message: "Sources found successfully." };
    } else {
      return { message: "No original sources could be found for the provided text." };
    }
  } catch (e) {
    console.error(e);
    return { error: "An unexpected error occurred while verifying sources." };
  }
}
