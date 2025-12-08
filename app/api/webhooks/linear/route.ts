import { env } from "@/lib/config/env";
import {
  LINEAR_WEBHOOK_SIGNATURE_HEADER,
  LINEAR_WEBHOOK_TS_FIELD,
  LinearWebhookClient,
} from "@linear/sdk/webhooks";
import { NextRequest, NextResponse } from "next/server";
import getRawBody from "raw-body";

export const config = {
  api: {
    bodyParser: false, // CRITICAL: Disable body parser to get raw body
  },
};

export async function POST(req: NextRequest) {
  // @ts-ignore
  const rawBodyFromReq = (await getRawBody(req)) as Buffer;
  console.log("Raw body from request", rawBodyFromReq);
  const bodyString = rawBodyFromReq.toString("utf-8");
  console.log("Body string", bodyString);

  const signature = req.headers.get(LINEAR_WEBHOOK_SIGNATURE_HEADER);
  console.log("Signature", signature);
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  const parsedBody = JSON.parse(bodyString);
  console.log("Parsed body", parsedBody);
  const timestamp = parsedBody[LINEAR_WEBHOOK_TS_FIELD];
  console.log("Timestamp", timestamp);
  const webhookClient = new LinearWebhookClient(env.LINEAR_WEBHOOK_SECRET);

  const verified = webhookClient.verify(rawBodyFromReq, signature, timestamp);
  console.log("Verified", verified);
  if (!verified) {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "Webhook verified" });
}
