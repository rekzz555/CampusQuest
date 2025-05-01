export function parseQuestionsFromText(text) {
  const lines = text.split("\n").map(line => line.trim()).filter(line => line !== "");
  const questions = [];

  for (let i = 0; i < lines.length; i += 6) {
    const question = lines[i];
    const options = [];

    for (let j = 1; j <= 4; j++) {
      const line = lines[i + j];
      const label = line?.[0]; // A, B, C, D
      const text = line?.slice(2)?.trim(); // after 'A. '
      if (label && text) {
        options.push({ label, text });
      }
    }

    const answer = lines[i + 5]?.trim().toUpperCase();

    // Push only if everything is valid
    if (question && options.length === 4 && answer) {
      questions.push({ question, options, answer });
    }
  }

  return questions;
}
