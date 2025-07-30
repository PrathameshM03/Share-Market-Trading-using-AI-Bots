import { Company, PriceData, ModelInfo, Decision, DecisionType, NewsSentimentResult, SocialMediaResult, CompanyProfile, VerifiedSocialMediaResult } from './types';

export const MOCK_COMPANIES: Company[] = [
    { ticker: 'APPL', name: 'Apple Inc.', logo: 'https://companiesmarketcap.com/img/company-logos/64/AAPL.png' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', logo: 'https://companiesmarketcap.com/img/company-logos/64/GOOG.png' },
    { ticker: 'MSFT', name: 'Microsoft Corp.', logo: 'https://companiesmarketcap.com/img/company-logos/64/MSFT.png' },
    { ticker: 'AMZN', name: 'Amazon.com, Inc.', logo: 'https://companiesmarketcap.com/img/company-logos/64/AMZN.png' },
    { ticker: 'TSLA', name: 'Tesla, Inc.', logo: 'https://companiesmarketcap.com/img/company-logos/64/TSLA.png' },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', logo: 'https://companiesmarketcap.com/img/company-logos/64/NVDA.png' },
];

export const AVAILABLE_MODELS: ModelInfo[] = [
    { 
        id: 'gemini-2.5-flash', 
        name: 'Gemini 2.5 Flash',
        description: 'The latest and fastest model, good for most tasks.',
        isAvailable: true,
    },
    { 
        id: 'gemini-pro', 
        name: 'Gemini Pro (Legacy)',
        description: 'A powerful legacy model. Note: This model is deprecated and will not work.',
        isAvailable: false,
    },
];

export const generateMockPriceData = (): PriceData[] => {
    const data: PriceData[] = [];
    let price = 150 + Math.random() * 50;
    for (let i = 0; i < 30; i++) {
        data.push({
            name: `Day ${i + 1}`,
            price: parseFloat(price.toFixed(2)),
        });
        price += (Math.random() - 0.5) * 10;
        price = Math.max(price, 50); // Ensure price doesn't go below 50
    }
    return data;
};

// --- MOCK DATA FOR DEMO MODE ---

export const getMockDecision = (): Decision => {
    const decisions: Decision[] = [
        { 
            decision: DecisionType.BUY, 
            rationale: 'Synthesized analysis suggests a strong buy signal due to overwhelming positive sentiment and growth indicators.',
            perspectives: [
                { name: 'Growth Analyst', decision: DecisionType.BUY, rationale: 'Aggressive growth indicators and market hype point to a strong upward trajectory.'},
                { name: 'Value Analyst', decision: DecisionType.HOLD, rationale: 'While sentiment is positive, fundamentals suggest waiting for a better entry point.'}
            ]
        },
        { 
            decision: DecisionType.SELL, 
            rationale: 'A combination of negative news and waning social media interest points towards a sell recommendation.',
            perspectives: [
                { name: 'Growth Analyst', decision: DecisionType.SELL, rationale: 'The negative shift in market narrative is a key indicator to exit the position.'},
                { name: 'Value Analyst', decision: DecisionType.SELL, rationale: 'Fundamental risks highlighted in recent news outweigh the current valuation.'}
            ]
        },
        { 
            decision: DecisionType.HOLD, 
            rationale: 'Mixed signals from news and social media suggest a period of consolidation. It is best to hold and observe.',
            perspectives: [
                { name: 'Growth Analyst', decision: DecisionType.BUY, rationale: 'Despite some concerns, the long-term growth story remains intact.'},
                { name: 'Value Analyst', decision: DecisionType.HOLD, rationale: 'The risk-reward ratio is currently balanced. Holding is the most prudent action.'}
            ]
        },
    ];
    return decisions[Math.floor(Math.random() * decisions.length)];
};

export const getMockNews = (companyName: string): NewsSentimentResult => ({
    headlines: [
        { headline: `${companyName} Unveils Next-Generation Product Line to High Praise`, source: 'Tech Weekly', url: `https://www.google.com/search?q=${encodeURIComponent(`${companyName} Unveils Next-Generation Product`)}&tbm=nws`, summary: 'The tech giant revealed its new flagship products today, receiving positive reviews from early testers for its innovative features and design.' },
        { headline: `Analysts Raise Price Target for ${companyName} Stock`, source: 'Finance Today', url: `https://www.google.com/search?q=${encodeURIComponent(`Analysts Raise Price Target for ${companyName} Stock`)}&tbm=nws`, summary: 'Following a strong earnings report, several financial analysts have upgraded their rating for the company, citing robust growth and market leadership.' },
        { headline: 'Regulatory Scrutiny Looms Over Tech Sector', source: 'Global News', url: `https://www.google.com/search?q=${encodeURIComponent(`Regulatory Scrutiny Looms Over Tech Sector`)}&tbm=nws`, summary: 'Governments worldwide are discussing new regulations that could impact major tech companies, creating uncertainty in the market.' },
        { headline: `${companyName} Expands into New International Markets`, source: 'Business Insider', url: `https://www.google.com/search?q=${encodeURIComponent(`${companyName} Expands into New International Markets`)}&tbm=nws`, summary: 'The company announced a strategic expansion into several key international markets, aiming to capture new revenue streams and global market share.' },
        { headline: 'Supply Chain Issues Continue to Challenge Production', source: 'Reuters', url: `https://www.google.com/search?q=${encodeURIComponent(`${companyName} Supply Chain Issues`)}&tbm=nws`, summary: 'Ongoing global supply chain disruptions are presenting challenges for production lines, potentially affecting future inventory levels.' },
        { headline: `Partnership with AutoMaker to Bring ${companyName} Tech to Cars`, source: 'The Verge', url: `https://www.google.com/search?q=${encodeURIComponent(`Partnership with AutoMaker to Bring ${companyName} Tech to Cars`)}&tbm=nws`, summary: 'A new landmark partnership will integrate the company\'s software ecosystem into the next generation of connected vehicles.' },
        { headline: `Competitor Launches Rival Product, Increasing Market Pressure`, source: 'Bloomberg', url: `https://www.google.com/search?q=${encodeURIComponent(`${companyName} Competitor Launches Rival Product`)}&tbm=nws`, summary: 'A major competitor has launched a new product that directly challenges the company\'s core offerings, heating up the market competition.' },
        { headline: `${companyName} Announces $10 Billion Stock Buyback Program`, source: 'Wall Street Journal', url: `https://www.google.com/search?q=${encodeURIComponent(`${companyName} Announces Stock Buyback Program`)}&tbm=nws`, summary: 'The board has authorized a significant stock buyback program, signaling confidence in the company\'s financial health and future prospects.' },
    ],
    sentiment: 'Neutral',
});

export const getMockSocialPosts = (companyName: string): SocialMediaResult => ({
    posts: [
        { platform: 'X', author: '@StockGuru', content: `Watching ${companyName} closely this week. Looks like it's coiling for a big move. #trading`, url: 'https://x.com/search?q=%23trading' },
        { platform: 'Reddit', author: 'u/DiamondHandz', content: `Is anyone else loading up on ${companyName}? The fundamentals look solid.`, url: 'https://www.reddit.com/r/stocks/' },
        { platform: 'X', author: '@TechObserver', content: `The latest feature drop from ${companyName} is a game-changer. Competitors should be worried.`, url: 'https://x.com/search?q=%23technews' },
        { platform: 'Reddit', author: 'u/EconomyWatcher', content: `I'm a bit cautious on ${companyName} until we see how these new regulations play out.`, url: 'https://www.reddit.com/r/investing/' },
        { platform: 'X', author: '@DayTraderJane', content: `Seeing some bearish divergence on the ${companyName} chart. Might be time for a pullback.`, url: 'https://x.com/search?q=%23daytrading' },
    ],
});

export const getMockVerifiedSocialResult = (companyName: string): VerifiedSocialMediaResult => ({
    posts: getMockSocialPosts(companyName).posts.slice(0, 5),
    sentiment: 'Positive',
    verificationSummary: 'Both X and Reddit show strong bullish sentiment, confirming positive market momentum.'
});

export const getMockProfile = (companyName: string): CompanyProfile => ({
    summary: `This is a sample profile for ${companyName}. In a live environment, this summary would provide a professional overview of the company's main business, its position in the market, and recent strategic focus. This allows traders to get a quick, AI-generated snapshot of the company's fundamentals without leaving the dashboard.`
});