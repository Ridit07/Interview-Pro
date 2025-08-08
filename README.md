# RecruitAura

AI-assisted technical interviews: real-time coding + voice transcription + fair, structured evaluation — all in one place.

## Why this exists

Technical hiring is slow, expensive, and often bottlenecked by engineers’ time. RecruitAura automates the repetitive parts (scheduling, coding checks, transcripts, structured scoring) so teams can focus on decisions, not logistics.

## What it does

- **Live interview room** with video, chat, and a shared coding pad (compiles code via API)
- **Speech-to-text** transcription during interviews (powered by Whisper)
- **Insight extraction** from answers: keywords, entities, sentiment, and topic hints to aid the interviewer
- **Signals for fairness & integrity** (e.g., toxicity/bias checks; optional non-verbal/cheat cues)
- **ATS-style matching** between JD and resume using embeddings and TF-IDF
- **Auto-summary** of long docs/answers for quick reviews
- **Post-interview report** with rubric-based scoring and notes

## Product snapshots

_Add images in `/docs/images` and reference them here._

- Landing, sign-ups, pricing, org dashboard, scheduler, skills panel, interview room, results, ATS view

## Stack

- **Frontend:** React.js (SPA)
- **Backend:** Python (Flask)
- **Database:** MySQL
- **Real-time:** WebRTC for video; Firebase (Firestore/Storage) for room metadata, chat, and code pad sync
- **ML/NLP:** PyTorch, Transformers; Whisper for ASR; BART for summarization; spaCy for NER; Sentence-BERT for JD↔Resume matching; YOLO for attire (optional)
- **Code execution:** RapidAPI Code Compiler

## Data model

- `Candidate`, `Organisation`, `Interviewer`, `Interviews`, `Status`, `Rubrics`
- Foreign key links between who, what, when, and the evaluation rubric per session

## Suggested project layout

/app
/frontend # React app
/backend # Flask API
/docs


## Getting started (local dev)

### Prerequisites
- Node 18+
- Python 3.11+
- MySQL 8+
- Accounts/keys: Firebase (Firestore+Storage), RapidAPI compiler, OpenAI Whisper (or your ASR proxy)

### Backend – Flask
```bash
cd app/backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# set env (see below), then:
flask db upgrade
flask run
```

### Frontend – React

cd app/frontend
npm install
npm run dev


## How the interview flow works

1. **Org** creates a role + rubric and adds candidates  
2. **Org** schedules a slot with an interviewer  
3. **Candidate** joins the room; code pad + mic start  
4. **Backend** streams ASR → NLP insights; compiler runs code; room chat and edits sync via Firebase  
5. **Interviewer** submits the rubric; a **report** is generated and stored  

---

## Models & signals

- Summarization (BART)  
- Emotion detection  
- Lip-sync detection  
- Dual-face detection  
- Toxicity detection  
- Bias detection  
- Attire detection (experimental)  
- JD↔Resume similarity via Sentence-BERT + TF-IDF  

---

## Roadmap

- Improved bias auditing & explainability  
- Interviewer coaching prompts (LLM-assisted)  
- Multi-tenant org admin & SSO  
- Exportable report templates  

---

## Contributing

PRs welcome — especially for:
- Improving evaluation rubrics and scoring UX  
- Expanding test data & reproducible model evaluation  
- Hardening WebRTC flows and TURN fallback  

When opening an issue, include:
1. Steps to reproduce  
2. Expected vs actual result  
3. Logs or screenshots if relevant  

