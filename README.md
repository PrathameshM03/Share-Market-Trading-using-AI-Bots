# AI Trading Bot Dashboard

An AI-powered trading bot dashboard that provides real-time market analysis, trading decisions, and portfolio management.

## Features

- 🤖 AI-powered trading decisions using Google's Gemini API
- 📊 Real-time price charts and market data
- 📰 News sentiment analysis
- 📱 Social media sentiment tracking
- 📈 Trading history and performance metrics
- 🔐 User authentication and settings

## Run Locally

**Prerequisites:** Node.js 18 or later

1. Clone the repository:
   ```bash
   git clone https://github.com/PrathameshM03/ai-trading-bot-dashboard.git
   cd ai-trading-bot-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Set the `GEMINI_API_KEY` in `.env` to your Gemini API key

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deploy to Netlify

### Method 1: Connect GitHub Repository (Recommended)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/PrathameshM03/ai-trading-bot-dashboard.git
   git push -u origin main
   ```

2. Go to [Netlify](https://netlify.com) and sign in
3. Click "New site from Git"
4. Connect your GitHub account and select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables:
   - Go to Site settings > Environment variables
   - Add `GEMINI_API_KEY` with your API key value
7. Deploy the site

### Method 2: Manual Deploy

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to [Netlify](https://netlify.com) and drag the `dist` folder to deploy

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key

## Developer

Created by **Prathamesh Margale**

- 🔗 LinkedIn: [Prathamesh Margale](https://www.linkedin.com/in/prathamesh-margale/)
- 🐙 GitHub: [PrathameshM03](https://github.com/PrathameshM03)
- 🐦 Twitter: [@Prathamesh8980](https://x.com/Prathamesh8980)

## Technologies Used

- React 19
- TypeScript
- Vite
- Google Gemini AI
- Recharts
- Tailwind CSS

## License

MIT License
