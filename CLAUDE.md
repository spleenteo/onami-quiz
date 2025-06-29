# O-Nami Karate Quiz - Claude Code Project Guide

## Project Overview
This is an educational quiz application designed for O-Nami Karate Firenze dojo members to test and improve their knowledge of Japanese karate terminology. The app serves as both a learning tool and a competitive platform for the martial arts community.

## Purpose & Goals
- **Educational**: Help karate practitioners learn and memorize over 200+ authentic Japanese karate terms
- **Community Building**: Create a shared learning experience for O-Nami dojo members
- **Gamification**: Use competitive elements (leaderboards, scoring, streaks) to motivate learning
- **Accessibility**: Provide a mobile-friendly, installable PWA for easy access during training

## Target Audience
- Students of O-Nami Karate Firenze (ages 5+)
- Karate instructors and senseis
- Martial arts enthusiasts interested in Japanese terminology
- Anyone preparing for karate exams or competitions

## Key Features
1. **Interactive Quiz System**: 15 random questions per session with multiple choice answers
2. **Comprehensive Database**: 200+ authentic terms from traditional karate dictionary
3. **Real-time Scoring**: Points awarded for correct answers with time and streak bonuses
4. **Global Leaderboard**: Centralized database storing all players' scores
5. **Performance Analytics**: Track accuracy, response time, and improvement over time
6. **Mobile PWA**: Installable app for smartphones and tablets
7. **O-Nami Branding**: Official colors and design reflecting the dojo's identity

## Technical Stack
- **Frontend**: React 18 with modern hooks and component architecture
- **Styling**: Tailwind CSS with custom O-Nami color scheme
- **Backend**: Cloudflare Pages Functions for serverless API endpoints
- **Database**: Cloudflare D1 (SQLite) for persistent data storage
- **Hosting**: Cloudflare Pages with automatic GitHub deployment
- **Build System**: Vite for fast development and optimized production builds
- **Icons**: Lucide React for consistent UI elements

## Development Environment
```bash
# Installation
npm install

# Local development
npm run dev

# Production build
npm run build

# Deploy to Cloudflare
npm run deploy
```

## Database Structure
### Players Table
```sql
- id: Primary key
- name: Player name
- score: Best score achieved
- questions_answered: Total questions attempted
- correct_answers: Total correct responses
- avg_time_per_question: Average response time
- streak_max: Longest correct answer streak
- created_at: Registration timestamp
```

### Game Sessions Table
```sql
- id: Primary key
- player_name: Reference to player
- score: Session score
- questions: JSON array of questions asked
- answers: JSON array of responses given
- duration: Total session time
- created_at: Session timestamp
```

## API Endpoints
- `GET /api/leaderboard` - Retrieve global rankings and statistics
- `POST /api/save-score` - Save player score and session data

## File Structure
```
onami-karate-quiz/
├── public/
│   ├── index.html          # Main HTML template
│   └── manifest.json       # PWA configuration
├── src/
│   └── App.jsx            # Main React component
├── functions/api/
│   ├── leaderboard.js     # GET leaderboard endpoint
│   └── save-score.js      # POST score saving endpoint
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite build configuration
└── wrangler.toml          # Cloudflare configuration
```

## Development Guidelines
When working on this project, keep in mind:

1. **Educational Focus**: Any changes should prioritize learning effectiveness
2. **Performance**: Maintain fast load times for mobile users in the dojo
3. **Accessibility**: Ensure the app works for all age groups (5+ years)
4. **Data Integrity**: Protect the authenticity of Japanese karate terminology
5. **Community Features**: Foster healthy competition and engagement

## Deployment Process
1. Code changes pushed to GitHub main branch
2. Cloudflare Pages automatically builds and deploys
3. Database migrations handled via Wrangler CLI
4. Environment variables configured in Cloudflare Dashboard

## Cultural Context
This app preserves and shares traditional Japanese martial arts terminology from authentic sources. The terms come from a comprehensive karate dictionary and represent centuries of martial arts tradition. Maintaining accuracy and respect for this cultural heritage is paramount.

## Success Metrics
- User engagement (quiz completion rate)
- Learning effectiveness (accuracy improvement over time)
- Community participation (active players)
- Technical performance (load times, uptime)

## Future Roadmap
- Difficulty levels and specialized categories
- Instructor dashboard for student progress tracking
- Integration with dojo class schedules
- Offline mode for training sessions without internet
- Achievement system and badges for milestones