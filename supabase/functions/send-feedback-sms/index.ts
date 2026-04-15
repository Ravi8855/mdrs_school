/**
 * Sends feedback as SMS to NOTIFY_SMS_TO (default 10-digit Indian 8855025560).
 *
 * Set ONE provider in Supabase → Edge Functions → send-feedback-sms → Secrets:
 *
 * **Option A — Fast2SMS (India, common for schools)**
 *   FAST2SMS_API_KEY   = from https://www.fast2sms.com/ → Dev API
 *   FAST2SMS_SENDER_ID = optional, 6-char approved sender (default FSTSMS where allowed)
 *   NOTIFY_SMS_TO      = optional, 10 digits or 91XXXXXXXXXX (default 8855025560)
 *
 * **Option B — Twilio**
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
 *   NOTIFY_SMS_TO      = E.164 e.g. +918855025560
 *
 * Deploy: `supabase functions deploy send-feedback-sms`
 * India DLT: your Fast2SMS/Twilio template may need to be registered for promotional SMS.
 */

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function indianMobile10(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length >= 10) return d.slice(-10);
  return d;
}

function buildSmsBody(
  name: string,
  role: string,
  message: string,
  more_memories: string,
): string {
  return `MDRS feedback\nName: ${name}\nRole: ${role}\nMemories: ${more_memories}\nMsg: ${message}`.slice(
    0,
    1500,
  );
}

async function sendViaFast2Sms(smsBody: string, numbers10: string): Promise<{ ok: boolean; detail: string }> {
  const apiKey = Deno.env.get("FAST2SMS_API_KEY");
  if (!apiKey) {
    return { ok: false, detail: "fast2sms_not_configured" };
  }

  const senderId = Deno.env.get("FAST2SMS_SENDER_ID") ?? "FSTSMS";
  const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      route: "q",
      sender_id: senderId,
      message: smsBody,
      language: "english",
      flash: 0,
      numbers: numbers10,
    }),
  });

  let data: Record<string, unknown> = {};
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    return { ok: false, detail: `fast2sms_http_${res.status}:${JSON.stringify(data)}` };
  }
  if (data.return === true) {
    return { ok: true, detail: "fast2sms_ok" };
  }
  return { ok: false, detail: `fast2sms:${JSON.stringify(data)}` };
}

async function sendViaTwilio(smsBody: string, toE164: string): Promise<{ ok: boolean; detail: string }> {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const from = Deno.env.get("TWILIO_PHONE_NUMBER");
  if (!accountSid || !authToken || !from) {
    return { ok: false, detail: "twilio_not_configured" };
  }

  const auth = btoa(`${accountSid}:${authToken}`);
  const params = new URLSearchParams({ To: toE164, From: from, Body: smsBody });
  const twilioRes = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    },
  );

  if (!twilioRes.ok) {
    const text = await twilioRes.text();
    return { ok: false, detail: `twilio:${text}` };
  }
  return { ok: true, detail: "twilio_ok" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    const role = String(body.role ?? "").trim();
    const message = String(body.message ?? "").trim();
    const more_memories = String(body.more_memories ?? "").trim();

    if (!name || !role || !message || !more_memories) {
      return new Response(JSON.stringify({ error: "missing_fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawTo = Deno.env.get("NOTIFY_SMS_TO") ?? "8855025560";
    const smsBody = buildSmsBody(name, role, message, more_memories);

    // 1) Fast2SMS (India) if API key present
    const fast2Key = Deno.env.get("FAST2SMS_API_KEY");
    if (fast2Key) {
      const num10 = indianMobile10(rawTo);
      const r = await sendViaFast2Sms(smsBody, num10);
      if (r.ok) {
        return new Response(JSON.stringify({ sent: true, provider: "fast2sms" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ sent: false, provider: "fast2sms", error: r.detail }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2) Twilio
    const toE164 = rawTo.startsWith("+") ? rawTo : `+${rawTo.replace(/\D/g, "")}`;
    const tw = await sendViaTwilio(smsBody, toE164);
    if (tw.ok) {
      return new Response(JSON.stringify({ sent: true, provider: "twilio" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (tw.detail === "twilio_not_configured") {
      return new Response(
        JSON.stringify({
          sent: false,
          reason: "no_sms_provider",
          message:
            "Add FAST2SMS_API_KEY (India) or Twilio secrets on this Edge Function to deliver SMS.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ sent: false, provider: "twilio", error: tw.detail }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
