"use server";

/**
 * Server action: Subscribe an email to the Gradus newsletter via Brevo.
 * The API key lives in process.env.BREVO_API_KEY — never exposed to the browser.
 */
export async function subscribeToNewsletter(
  email: string
): Promise<{ ok: boolean; status: number }> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error("[newsletter] BREVO_API_KEY is not set");
    return { ok: false, status: 500 };
  }

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      listIds: [2],
      updateEnabled: true,
    }),
  });

  return { ok: response.ok, status: response.status };
}
