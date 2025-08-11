# Dataday Flow: TikTok Livestream → Daily App Use

Last updated: 2025-08-11

## Customer Journey Logic Tree (Step X/9 System)

```mermaid
flowchart TD
  %% Box-and-line journey map (Step X/9: Phase – Substep)
  classDef phase fill:#0b1220,stroke:#2b3a55,color:#dbeafe,rx:8,ry:8;
  classDef action fill:#0f172a,stroke:#334155,color:#e2e8f0,rx:6,ry:6;
  classDef terminal fill:#1f2937,stroke:#475569,color:#f1f5f9,rx:6,ry:6;

  %% Step 1: Lead Intake
  subgraph S1[Step 1/9: Lead Intake]
    A1[1.1 New Lead – Untouched]:::phase
    A2[1.2 Auto-Invalid – Bad Number]:::terminal
  end

  %% Step 2: Reach Out
  subgraph S2[Step 2/9: Reach Out]
    B1[2.1 No Response – VM Left – Text and VM]:::action
    B2[2.2 No Response – No Voicemail]:::action
    B3[2.3 No Response – Text Sent]:::action
    B4[2.4 Connected – Live Now]:::action
    B5[2.5 Connected – Scheduled Discovery]:::action
    B6[2.6 Wrong Number – Not Reachable]:::terminal
  end

  %% Step 3: Discovery Scheduling
  subgraph S3[Step 3/9: Discovery Scheduling]
    C1[3.1 Discovery – Scheduled]:::action
    C2[3.2 Discovery – Rescheduled]:::action
    C3[3.3 Discovery – No Show]:::action
  end

  %% Step 4: Discovery Call
  subgraph S4[Step 4/9: Discovery Call]
    D1[4.1 Completed – Qualified]:::phase
    D2[4.2 Completed – Not Qualified]:::terminal
    D3[4.3 Declined – Price]:::action
    D4[4.4 Declined – Time]:::action
    D5[4.5 Declined – Fit]:::terminal
    D6[4.6 Think About It – Follow-Up Needed]:::action
  end

  %% Step 5: Follow-Up
  subgraph S5[Step 5/9: Follow-Up]
    F1[5.1 Follow-Up – Scheduled]:::action
    F2[5.2 No Response (Attempt 1)]:::action
    F3[5.3 No Response (Attempt 2)]:::action
    F4[5.4 Reconnected – Proceed to Onboarding]:::phase
    F5[5.5 Closed Lost – No Response After N Attempts]:::terminal
  end

  %% Step 6: Onboarding Start
  subgraph S6[Step 6/9: Onboarding Start]
    E1[6.1 Account – Created]:::action
    E2[6.2 App – Installed]:::action
    E3[6.3 Coach – Assigned]:::action
    E4[6.4 Initial Goal – Set by Coach]:::phase
  end

  %% Step 7: Support Circle
  subgraph S7[Step 7/9: Support Circle]
    G1[7.1 Contacts – Added]:::action
    G2[7.2 Consents – Sent]:::action
    G3[7.3 Completion – 50%]:::action
    G4[7.4 Completion – 100%]:::phase
  end

  %% Step 8: Activation (First 7 Days)
  subgraph S8[Step 8/9: Activation (First 7 Days)]
    H1[8.1 Day 1 – Proof Complete]:::action
    H2[8.2 Day 1 – Missed (Day Guide Ping)]:::action
    H3[8.3 Day 2 – Missed (Support Circle Ping)]:::action
    H4[8.4 Week 1 – Complete]:::phase
  end

  %% Step 9: Subscription Outcome
  subgraph S9[Step 9/9: Subscription Outcome]
    I1[9.1 Trial – Active]:::action
    I2[9.2 Paid – Active]:::phase
    I3[9.3 Subscription – Paused]:::action
    I4[9.4 Subscription – Canceled/Churned]:::terminal
    I5[9.5 Payment – Failed (Recovery Needed)]:::action
    END[[End]]:::terminal
  end

  %% Edges: Intake -> Reach Out
  A1 --> B1
  A1 --> B2
  A1 --> B3
  A1 --> B4
  A1 --> B5
  A1 --> A2

  %% Reach Out branching
  B1 --> F1
  B2 --> F1
  B3 --> F1
  B4 --> D1
  B4 --> C1
  B5 --> C1
  B6 --> F5

  %% Discovery Scheduling to Call/Follow-up
  C1 --> D1
  C2 --> C1
  C3 --> F1

  %% Discovery Call outcomes
  D1 --> E1
  D2 --> F5
  D3 --> F1
  D4 --> F1
  D5 --> F5
  D6 --> F1

  %% Follow-Up paths
  F1 --> C1
  F1 --> D1
  F2 --> F3
  F3 --> F1
  F4 --> E1
  F5 -.-> END

  %% Onboarding progression
  E1 --> E2
  E2 --> E3
  E3 --> E4
  E4 --> G1

  %% Support Circle progression
  G1 --> G2
  G2 --> G3
  G3 --> G4
  G4 --> H1

  %% Activation week
  H1 --> H4
  H2 --> H3
  H3 --> H4
  H4 --> I1

  %% Subscription outcomes
  I1 --> I2
  I1 --> I3
  I1 --> I4
  I1 --> I5
  I5 --> I2
  I5 --> I4
```

### Legend
- **Dark Blue Boxes**: Key milestone phases (qualified, onboarded, paying customer)
- **Light Gray Boxes**: Action states (in progress, waiting for response)
- **Dark Gray Boxes**: Terminal outcomes (lost, churned, invalid)


## ASCII Box-and-Line Diagram (plain text, viewable anywhere)

```
Step 1/9: Lead Intake
  ├─ 1.1 New Lead – Untouched
  └─ 1.2 Auto-Invalid – Bad Number (END)

Step 2/9: Reach Out
  ├─ 2.1 No Response – VM Left – Text and VM ─┐
  ├─ 2.2 No Response – No Voicemail ┤
  ├─ 2.3 No Response – Text Sent ───┤→ Step 5/9: Follow-Up
  ├─ 2.4 Connected – Live Now ─────────→ Step 4/9: Discovery Call
  ├─ 2.5 Connected – Scheduled Discovery → Step 3/9: Discovery Scheduling
  └─ 2.6 Wrong Number – Not Reachable (END)

Step 3/9: Discovery Scheduling
  ├─ 3.1 Discovery – Scheduled ─────→ Step 4/9: Discovery Call
  ├─ 3.2 Discovery – Rescheduled ───→ Step 3/9: Discovery Scheduling (loop)
  └─ 3.3 Discovery – No Show ───────→ Step 5/9: Follow-Up

Step 4/9: Discovery Call
  ├─ 4.1 Completed – Qualified ─────→ Step 6/9: Onboarding Start
  ├─ 4.2 Completed – Not Qualified (END)
  ├─ 4.3 Declined – Price ──────────→ Step 5/9: Follow-Up
  ├─ 4.4 Declined – Time ───────────→ Step 5/9: Follow-Up
  ├─ 4.5 Declined – Fit (END)
  └─ 4.6 Think About It – Follow-Up Needed → Step 5/9: Follow-Up

Step 5/9: Follow-Up
  ├─ 5.1 Follow-Up – Scheduled ──┬─→ Step 3/9: Discovery Scheduling
  │                              └─→ Step 4/9: Discovery Call
  ├─ 5.2 No Response (Attempt 1) ─→ 5.3 No Response (Attempt 2)
  ├─ 5.3 No Response (Attempt 2) ─→ 5.1 Follow-Up – Scheduled
  ├─ 5.4 Reconnected – Proceed to Onboarding → Step 6/9
  └─ 5.5 Closed Lost – No Response After N Attempts (END)

Step 6/9: Onboarding Start
  ├─ 6.1 Account – Created ─→ 6.2 App – Installed ─→ 6.3 Coach – Assigned ─→ 6.4 Initial Goal – Set by Coach ─→ Step 7/9

Step 7/9: Support Circle
  ├─ 7.1 Contacts – Added ─→ 7.2 Consents – Sent ─→ 7.3 Completion – 50% ─→ 7.4 Completion – 100% ─→ Step 8/9

Step 8/9: Activation (First 7 Days)
  ├─ 8.1 Day 1 – Proof Complete ─→ 8.4 Week 1 – Complete
  ├─ 8.2 Day 1 – Missed (Day Guide Ping) ─→ 8.3 Day 2 – Missed (Support Circle Ping) ─→ 8.4 Week 1 – Complete
  └─ 8.4 Week 1 – Complete ─→ Step 9/9

Step 9/9: Subscription Outcome
  ├─ 9.1 Trial – Active ─→ 9.2 Paid – Active
  ├─ 9.1 Trial – Active ─→ 9.3 Subscription – Paused
  ├─ 9.1 Trial – Active ─→ 9.4 Subscription – Canceled/Churned (END)
  ├─ 9.1 Trial – Active ─→ 9.5 Payment – Failed (Recovery) ─→ 9.2 Paid – Active | 9.4 Canceled/Churned
  └─ 9.2 Paid – Active (END unless changed)
```

## 1) TikTok Livestream → Landing
- Chris goes live (roasting, coaching, clarity session)
- Bio link and pinned comment: https://mydataday.app/learn-more
- Viewers tap link during live

## 2) Landing Page (/learn-more)
- Mobile-first page
- Phone input formats live as (XXX) XXX-XXXX
- CTA: Continue
- On submit → POST /api/phone-leads/notify
- Success state: "Thanks! You'll receive a call shortly."

## 3) Lead Handling
- DB insert: leads { id, phone, lead_source='tiktok_learn_more', lead_status='new', created_at }
- Email to Chris via Resend with copy-to-clipboard phone
- Future: SMS to Chris (Twilio)
- Future: Upsert on duplicate phones (normalize to digits-only, unique index)

## 4) Live Call Workflow
- Chris clicks "Call Now" in email or taps phone
- Optional: click Background Check button (opens fastbackgroundcheck.com/phone)
- Quick discovery: pain, goal, timeline, support circle willingness

## 5) Conversion → App Onboarding
- If qualified: send signup link (auth/signup)
- Admin/Coach account sets initial goal(s) for user
- User lands on Today view; coach explains how proof-based completion works

## 6) Day-to-Day Use
- User sees scheduled goals on day view
- User taps goal and records proof (voice/photo/video)
- Support Circle expectations set during onboarding
- Missed entries trigger escalation flow (AI → human → Support Circle)

## 7) Admin / Coach Operations
- Admin dashboard: Phone Leads tab (status, notes, call, background check)
- Future quick actions: Copy phone, Mark as Contacted, Assign to me
- Weekly review: lead conversion, retention, goal success rates

## 8) Metrics to Watch
- Landing conversion rate (live -> submit)
- Lead → Call Connect rate
- Call → Signup rate
- Onboarding completion rate
- Day 7 active rate
- Goal proof completion rate

## Open Items / Later
- Implement upsert on leads by phone (unique index + API upsert)
- Add SMS notifications to Chris (Twilio)
- UTM/source capture for livestream variants (optional)
- Add quick actions to Admin Leads UI

