/*
 * Pošiljanje povpraševanja prek Netlify Forms (strežniška obdelava, zaščita pred neželeno pošto,
 * obvestilo po e-pošti). Obrazec je registriran v public/__forms.html.
 */
export const FORM_NAME = "povprasevanje";
const ENDPOINT = "/__forms.html";

export type InquiryData = {
  ime: string;
  telefon: string;
  email: string;
  storitev: string;
  sporocilo: string;
  soglasje: string;
  "bot-field": string;
};

export class SubmitError extends Error {}

export async function submitInquiry(data: InquiryData, signal?: AbortSignal): Promise<void> {
  if (!__FORMS_ENABLED__) {
    throw new SubmitError("Obrazec na tej različici strani ni povezan s strežnikom.");
  }
  const body = new URLSearchParams({ "form-name": FORM_NAME, ...data });
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal,
    });
  } catch {
    throw new SubmitError("Povezava ni uspela. Preverite internetno povezavo in poskusite znova.");
  }
  // Uspeh potrdimo samo, če strežnik dejansko sprejme obrazec.
  if (!res.ok) {
    throw new SubmitError("Sporočila trenutno ni bilo mogoče poslati.");
  }
}
