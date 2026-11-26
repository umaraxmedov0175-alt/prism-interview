export function buildDrillPrompt(params: {
  questionText: string;
  previousFeedback?: string;
  attemptText: string;
}): string {
  return `You are an interview coach grading a single-question practice drill.
Question: ${params.questionText}
Previous feedback to fix: ${params.previousFeedback || 'None'}
Candidate's new attempt: ${params.attemptText}

Grade 1-5, list up to 3 things that improved, up to 3 things still missing, and an improved bulleted structure outline using ONLY facts the candidate stated (mark missing facts as [add your own detail]). Never write a full scripted answer.
Return valid JSON matching: { "score": number, "whatImproved": string[], "stillMissing": string[], "improvedStructureOutline": string[] }`;
}
