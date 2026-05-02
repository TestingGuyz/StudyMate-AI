# StudyMate AI - Mobile App

React Native mobile app built with Expo for ICSE/CBSE Class 8-10 students.

## Features

- **Authentication**: Sign up with email/password + student details (name, class, board)
- **Onboarding**: Multi-step onboarding to collect weak subjects and exam date
- **Home**: Dashboard with exam countdown, stats, and quick actions
- **Focus Timer**: Pomodoro timer with work/break cycles
- **AI Explain**: Get AI-powered concept explanations
- **Calendar**: Custom calendar with events and reminders
- **Profile**: User profile and settings

## Tech Stack

- React Native (Expo SDK 50)
- React Navigation (Bottom Tabs + Native Stack)
- Supabase (Auth + Database + Edge Functions)
- Expo Secure Store (for session persistence)

## Project Structure

```
studymate-mobile/
├── App.js                    # Entry point
├── app.json                  # Expo config
├── package.json              # Dependencies
├── src/
│   ├── components/           # Reusable components
│   ├── context/
│   │   └── AuthContext.js    # Auth state + Supabase client
│   ├── navigation/
│   │   └── MainTabNavigator.js
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js   # 2-step signup with student details
│   │   ├── OnboardingScreen.js # 3-step onboarding
│   │   ├── HomeScreen.js
│   │   ├── FocusScreen.js    # Pomodoro timer
│   │   ├── ExplainScreen.js  # AI concept explainer
│   │   ├── CalendarScreen.js # Custom calendar
│   │   └── ProfileScreen.js
│   └── services/
│       └── (Supabase client in AuthContext)
└── assets/                   # App icons and splash
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd studymate-mobile
npm install
```

### 2. Configure Supabase

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key
3. Update `src/context/AuthContext.js`:
   ```javascript
   const supabaseUrl = 'https://your-project.supabase.co';
   const supabaseAnonKey = 'your-anon-key';
   ```

3. Run the SQL setup in Supabase SQL Editor (see `supabase-setup.sql`)

### 3. Start Development

```bash
npx expo start
```

Press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## Supabase Database Schema

### Tables Required

```sql
-- Profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users primary key,
  name text not null,
  class text not null,
  board text not null,
  weakSubjects text[] default '{}',
  examDate date,
  onboardingComplete boolean default false,
  darkMode boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Quizzes table
create table quizzes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  subject text not null,
  chapter text not null,
  difficulty text not null,
  questionType text not null,
  score integer not null,
  totalQuestions integer not null,
  percentage integer not null,
  timeTaken integer,
  wrongAnswers jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Events table (calendar)
create table events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  type text not null, -- 'study', 'exam', 'reminder'
  subject text,
  date date not null,
  time text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Concept explanations history
create table concept_explanations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  topic text not null,
  explanation text not null,
  keyPoints text[] default '{}',
  examMistakes text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;
alter table quizzes enable row level security;
alter table events enable row level security;
alter table concept_explanations enable row level security;

-- RLS Policies

-- Profiles: Users can only access their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Quizzes: Users can only access their own quizzes
create policy "Users can view own quizzes"
  on quizzes for select
  using (auth.uid() = user_id);

create policy "Users can create own quizzes"
  on quizzes for insert
  with check (auth.uid() = user_id);

-- Events: Users can only access their own events
create policy "Users can view own events"
  on events for select
  using (auth.uid() = user_id);

create policy "Users can manage own events"
  on events for all
  using (auth.uid() = user_id);

-- Concept explanations
create policy "Users can view own explanations"
  on concept_explanations for select
  using (auth.uid() = user_id);

create policy "Users can create own explanations"
  on concept_explanations for insert
  with check (auth.uid() = user_id);

-- Triggers

-- Update updated_at on profiles
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();
```

### Edge Function for AI

Create a Supabase Edge Function `explain-concept`:

```typescript
// supabase/functions/explain-concept/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

serve(async (req) => {
  const { topic, simplify, board, studentClass } = await req.json();

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a tutor for Indian ${board} board Class ${studentClass} students. Return JSON with explanation, keyPoints, and examMistakes.`
        },
        {
          role: 'user',
          content: `Explain "${topic}" ${simplify ? 'in simple terms for a 14-year-old' : 'in detail'}`
        }
      ],
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  return new Response(data.choices[0].message.content, {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

## Environment Variables

Create `.env` file:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Build for Production

### iOS

```bash
npx expo prebuild -p ios
cd ios
pod install
# Open ios/studymate.xcworkspace in Xcode
# Configure signing and build
```

### Android

```bash
npx expo prebuild -p android
cd android
./gradlew assembleRelease
# APK will be in android/app/build/outputs/apk/release/
```

### EAS Build (Recommended)

```bash
npm install -g eas-cli
eas login
eas build --platform ios    # or android
```

## Web App vs Mobile App

| Feature | Web App (React) | Mobile App (React Native) |
|---------|-----------------|---------------------------|
| Storage | localStorage | Supabase Database |
| Auth | None (local) | Supabase Auth |
| AI | Groq API (direct) | Supabase Edge Functions |
| Notifications | None | Push notifications |
| Offline | Limited | Better with caching |
| Data Sync | None | Cross-device sync |

The mobile app connects to **auth and database only** - it doesn't share localStorage with the web app.

## License

MIT - Built for Hackazrds 3.0
