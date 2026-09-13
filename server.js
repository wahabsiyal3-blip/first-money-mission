require("dotenv").config();
const express = require("express");
const path = require("path");
const crypto = require("crypto");


const app = express();
app.use(express.json({limit:"1mb",verify:(req,res,buf)=>{req.rawBody=buf;}}));
app.use(express.static(__dirname));

app.get("/api/config",(req,res)=>{
  res.json({
    checkoutUrl: process.env.CHECKOUT_URL || "",
    aiConnected: Boolean(process.env.AI_WEBHOOK_URL)
  });
});

app.post("/api/mission", async (req,res)=>{
  const input = req.body || {};
  if (process.env.AI_WEBHOOK_URL) {
    try {
      const r = await fetch(process.env.AI_WEBHOOK_URL, {
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify(input)
      });
      if(!r.ok) throw new Error("AI service error");
      return res.json(await r.json());
    } catch(e) {
      return res.status(502).json({error:"AI service is unavailable. Demo mode can still be used."});
    }
  }
  res.json(buildDemoMission(input));
});

function buildDemoMission(i){
  const s=(i.skills||"").toLowerCase();
  let base;
  if(s.includes("translat")){
    base={
      title:"Bilingual Document Rescue",
      price:"$5–$15",
      offer:"Translate and clean one short document, listing, message or caption into a polished ready-to-use version within 24 hours.",
      sample:"Create one before/after sample using your own fictional bilingual text. Show the messy original and the clean final version.",
      customer:"Small online sellers, service businesses, students and freelancers who need quick bilingual communication.",
      routes:[
        "Short translation + formatting",
        "Bilingual product-listing cleanup",
        "PDF/image to editable translated document"
      ]
    };
  } else if(s.includes("typing") || s.includes("data entry") || s.includes("pdf")){
    base={
      title:"Editable Document Rescue",
      price:"$5–$20",
      offer:"Turn one PDF, image or messy document into a clean editable Word/Docs file with consistent formatting.",
      sample:"Make a fictional two-page before/after sample showing a messy image and the clean editable result.",
      customer:"Recruiters, small offices, students, online sellers and freelancers handling forms, catalogs or documents.",
      routes:["PDF/image to editable file","Document cleanup + formatting","Simple data-entry sheet"]
    };
  } else if(s.includes("canva") || s.includes("design")){
    base={
      title:"24-Hour Promo Rescue",
      price:"$10–$25",
      offer:"Redesign one promotion into a clean mini-campaign with 3 social posts and 1 story format.",
      sample:"Create a fictional before/after promotion for a café, salon or small store.",
      customer:"Small businesses with outdated or inconsistent promotional graphics.",
      routes:["Social post pack","Flyer redesign","Menu / price-list cleanup"]
    };
  } else {
    base={
      title:"Micro-Service Launch",
      price:"$5–$15",
      offer:"Package your strongest skill into one fixed-scope, fast-delivery service that solves one clear customer problem.",
      sample:"Create one realistic before/after sample that proves your strongest skill in under one hour.",
      customer:"People already buying small digital services: freelancers, small businesses, creators and students.",
      routes:["One clear micro-service","Small task bundle","Recurring support add-on"]
    };
  }

  const country=i.country || "your country";
  const languages=i.languages || "your languages";
  const target=i.target || "$100";

  return {
    ...base,
    summary:`Your fastest test is to sell a small outcome, not a broad skill. Start with one offer, one customer type and one proof sample.`,
    firstMessage:`Hi! I offer a small fixed-price service for ${base.offer.toLowerCase()} I can communicate in ${languages}. If you send one small non-confidential example, I’ll confirm the scope and price before starting.`,
    followUp:"Hi! Just following up once in case this is still useful. No pressure — if you want, we can start with one small fixed-price task.",
    objection:"I understand. Instead of reducing quality, we can reduce the scope and start with one smaller task so you can judge the result first.",
    days:[
      "Choose one route and make one portfolio sample.",
      "Find 15 relevant prospects or marketplace listings.",
      "Send 5–10 personalized messages — no mass spam.",
      "Follow up once and record the objections you hear.",
      "Try to close one small fixed-scope starter task.",
      "Deliver cleanly and ask for a testimonial if the buyer is happy.",
      `Review replies, paid jobs and lessons. Improve the offer and repeat. Your target ${target} is a goal, not a guarantee.`
    ],
    country
  };
}
app.post("/api/ziina-webhook", (req, res) => {
  const event = req.body;
  const signature = req.get("X-Hmac-Signature");
  const secret = process.env.ZIINA_WEBHOOK_SECRET;
  const expected = crypto.createHmac("sha256", secret).update(req.rawBody).digest("hex");
  if (!signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature, "utf8"), Buffer.from(expected, "utf8"))) return res.status(401).json({ error: "Invalid signature" });

  console.log("Ziina webhook received:", event);

  if (
    event.event === "payment_intent.status.updated" &&
    event.data &&
    event.data.status === "completed"
  ) {
    console.log("PAYMENT COMPLETED:", event.data.id);

    // Full mission unlock logic yahan add karenge next step mein
  }

  res.status(200).json({ received: true });
});
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(process.env.PORT || 3000,()=>console.log("First Money Mission V4 running."));
