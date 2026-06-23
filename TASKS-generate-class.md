# Tasks: Generate Class with AI

## Phase 1: Backend — Infrastructure (Agora-Agent)

- [ ] 1.1 Create `db/init/002_class_plans.sql` with `CREATE TABLE class_plans` (id, session_id, title, subject, grade, duration, objectives, content, methodology, evaluation, resources, observations, raw_response, created_at)
- [ ] 1.2 Create `db/queries/class_plans.py` with async CRUD: create/update/get by session_id, list by user_id
- [ ] 1.3 Create `schemas/class_plan.py` with Pydantic models: GenerateRequest, ClassPlanResponse, SaveRequest, HistoryResponse

## Phase 2: Backend — LLM + Routes

- [ ] 2.1 Create `services/class_generator.py` — build prompt with subject/grade/duration/objectives, call LLM, parse + validate JSON response
- [ ] 2.2 Add 3 routes to `api/routes.py`: `POST /generate-class` (LLM → plan), `POST /generate-class/save` (persist plan), `GET /generate-class/history` (list saved plans)

## Phase 3: Frontend — API Client + BFF

- [ ] 3.1 Add `ClassPlan` type and `generateClassPlan()` function to `app/src/lib/api/ai.ts`
- [ ] 3.2 Create `app/api/ai/generate-class/route.ts` — POST proxy to `/ai/generate-class`
- [ ] 3.3 Create `app/api/ai/generate-class/save/route.ts` — POST proxy to `/ai/generate-class/save`
- [ ] 3.4 Create `app/api/ai/generate-class/history/route.ts` — GET proxy to `/ai/generate-class/history`

## Phase 4: Frontend — Hooks + Components

- [ ] 4.1 Create `hooks/useGenerateClass.ts` — state machine (idle/loading/success/error), generate/save/loadHistory actions
- [ ] 4.2 Create `components/ClassPlanCard.tsx` — display title, subject, grade, duration, content sections, observations, methodology, evaluation
- [ ] 4.3 Create `components/GenerateClassChat.tsx` — form with subject/grade/duration/objectives inputs, submit → loading → result card, save button
- [ ] 4.4 Create `app/(dashboard)/generar-clase/page.tsx` — page wrapper using GenerateClassChat
- [ ] 4.5 Add nav link "Generar Clase" → `/dashboard/generar-clase` in sidebar

## Phase 5: Verification

- [ ] 5.1 Run `npx tsc --noEmit` and fix type errors across all new/modified files
