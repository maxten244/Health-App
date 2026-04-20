# Crisis Protocol

This document describes how the Mental Health Check-in app handles crisis-related content and directs users to appropriate help.

## Disclaimer

**This app is not emergency services.** It does not provide real-time crisis intervention. If you or someone you know is in immediate danger, call:

- **United States**: 988 (Suicide & Crisis Lifeline) or 911
- **Other regions**: Use the crisis resources listed in the app or contact local emergency services.

## In-app safety features

### 1. Always-visible crisis entry point

- A **Crisis** button ("In crisis? Get help") is fixed on every page (bottom-right).
- It links to the **Crisis resources** page and is available whether the user is logged in or not.

### 2. Crisis resources page

- Lists crisis hotlines and contacts (e.g. 988, Crisis Text Line, SAMHSA, Trevor Project, etc.).
- Shows a clear disclaimer at the top.
- Data is seeded via the seed script and can include local/campus resources.

### 3. Crisis keyword detection

- When users submit **mood notes**, **anonymous posts**, or **community responses**, the backend checks for crisis-related keywords (e.g. suicide, self-harm, wanting to die).
- If detected:
  - The API response includes `showCrisisModal: true` and a list of crisis resources.
  - The content may still be saved where appropriate (e.g. mood entry with crisis keywords is not saved; the user is shown the modal instead).
  - The frontend opens a **crisis modal** with the disclaimer and resource list.
- Keyword detection is used only to trigger the modal and display resources; it is not used to log or store the user’s content beyond what is needed for the response.

### 4. No replacement for emergency services

- The app does not provide:
  - Real-time crisis counseling
  - Emergency dispatch
  - Clinical diagnosis or treatment
- It directs users to hotlines and professional services. Organizations listed (e.g. 988) are responsible for their own protocols.

## Escalation

- If you are operating this app in a specific institution (e.g. campus), add your local crisis and counseling contacts to the seed data and ensure the Crisis page and modal reflect them.
- Keep crisis contact information up to date (phone numbers, availability, descriptions).

## Data and privacy

- Crisis keyword detection runs server-side. The implementation does not log the user’s raw text for purposes other than generating the API response (e.g. returning the crisis payload).
- Anonymous posts and responses are not tied to user accounts; crisis detection does not associate content with identity beyond the session/request.
