import { GoogleGenAI, Type } from "@google/genai";
import { Company, Decision, NewsSentimentResult, CompanyProfile, DecisionType, SocialMediaResult, TextModelId, SocialMediaPost, VerifiedSocialMediaResult, DecisionPerspective, NewsItem, PriceData } from '../types';
import { generateMockPriceData } from "../constants";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const decisionPerspectiveSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the analyst persona." },
        decision: { type: Type.STRING, enum: [DecisionType.BUY, DecisionType.SELL, DecisionType.HOLD] },
        rationale: { type: Type.STRING, description: "Concise rationale from this persona's viewpoint."}
    },
    required: ["name", "decision", "rationale"]
};

const decisionSchema = {
    type: Type.OBJECT,
    properties: {
        decision: { 
            type: Type.STRING,
            enum: [DecisionType.BUY, DecisionType.SELL, DecisionType.HOLD],
            description: "The final, synthesized trading decision."
        },
        rationale: {
            type: Type.STRING,
            description: "A concise, one-sentence explanation for the final decision, synthesizing all inputs and perspectives."
        },
        perspectives: {
            type: Type.ARRAY,
            description: "An array containing the analysis from two different AI personas.",
            items: decisionPerspectiveSchema
        }
    },
    required: ["decision", "rationale", "perspectives"]
};

const newsSchema = {
    type: Type.OBJECT,
    properties: {
        headlines: {
            type: Type.ARRAY,
            description: "A list of up to 8 recent, real news headlines that could affect the company's stock price.",
            items: {
                type: Type.OBJECT,
                properties: {
                    headline: {
                        type: Type.STRING,
                        description: "The news headline text."
                    },
                    source: {
                        type: Type.STRING,
                        description: "The official news source (e.g., 'Bloomberg', 'Reuters')."
                    },
                    summary: {
                        type: Type.STRING,
                        description: "A concise, 2-3 sentence summary of the news article. Note if information is uncorroborated."
                    }
                },
                required: ["headline", "source", "summary"]
            }
        },
        sentiment: {
            type: Type.STRING,
            enum: ['Positive', 'Negative', 'Neutral'],
            description: "Overall market sentiment based on a critical analysis of these headlines."
        }
    },
    required: ["headlines", "sentiment"]
};

const socialMediaSchema = {
    type: Type.OBJECT,
    properties: {
        posts: {
            type: Type.ARRAY,
            description: "A list of 7 recent, representative social media posts from the specified platform.",
            items: {
                type: Type.OBJECT,
                properties: {
                    platform: {
                        type: Type.STRING,
                        enum: ['X', 'Reddit', 'Other'],
                        description: "The social media platform."
                    },
                    author: {
                        type: Type.STRING,
                        description: "A plausible but fictional author or username (e.g., '@stockguru' or 'u/diamondhands')."
                    },
                    content: {
                        type: Type.STRING,
                        description: "The content of the social media post, summarizing a common viewpoint. Must be realistic."
                    },
                    url: {
                        type: Type.STRING,
                        description: "An optional, valid URL to a relevant source, a search page, or a discussion thread (e.g., a link to the subreddit or a stock discussion forum). Do not link directly to individual user profiles."
                    }
                },
                required: ["platform", "author", "content"]
            }
        }
    },
    required: ["posts"]
};

const verifiedSocialSchema = {
     type: Type.OBJECT,
    properties: {
        posts: {
            type: Type.ARRAY,
            description: "A combined and filtered list of the most relevant social media posts (up to 5) from all provided sources.",
            items: socialMediaSchema.properties.posts.items
        },
        sentiment: {
            type: Type.STRING,
            enum: ['Positive', 'Negative', 'Neutral'],
            description: "The verified overall social media sentiment after analyzing and cross-referencing all inputs."
        },
        verificationSummary: {
            type: Type.STRING,
            description: "A one-sentence summary explaining the verification result. Note any major conflicts or confirmations between platforms."
        }
    },
    required: ["posts", "sentiment", "verificationSummary"]
}


const profileSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A concise, one-paragraph professional summary of the company."
        }
    },
    required: ["summary"]
};

const companyFinderSchema = {
    type: Type.OBJECT,
    properties: {
        ticker: {
            type: Type.STRING,
            description: "The primary stock ticker symbol for the company (e.g., 'NFLX')."
        },
        name: {
            type: Type.STRING,
            description: "The official name of the company (e.g., 'Netflix, Inc.')."
        },
        logo: {
            type: Type.STRING,
            description: "A valid, public URL to the company's logo. Should be a direct image link (e.g., from companiesmarketcap.com)."
        }
    },
    required: ["ticker", "name", "logo"]
};

const priceDataSchema = {
    type: Type.OBJECT,
    properties: {
        prices: {
            type: Type.ARRAY,
            description: "An array of 30 data points representing daily prices.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The day label, e.g., 'Day 1'." },
                    price: { type: Type.NUMBER, description: "The stock price for that day." }
                },
                required: ["name", "price"]
            }
        }
    },
    required: ["prices"]
};


export const getTradingDecision = async (company: Company, newsSentiment: 'Positive' | 'Negative' | 'Neutral', socialResult: VerifiedSocialMediaResult, modelId: TextModelId): Promise<Decision> => {
    const prompt = `
    You are a 'Master Trading AI' that synthesizes analysis from two sub-personas to make a final decision.
    
    **Company:** ${company.name} (${company.ticker})
    **Key Data Points:**
    - Recent News Sentiment: ${newsSentiment}
    - Verified Social Media Sentiment: ${socialResult.sentiment}
    - Social Media Verification Summary: ${socialResult.verificationSummary}

    **Your Personas:**
    1.  **Growth Analyst:** Focuses on hype, momentum, and potential for rapid growth. High risk tolerance.
    2.  **Value Analyst:** Focuses on fundamentals, stability, and long-term value. Low risk tolerance.

    **Task:**
    1.  Provide a trading decision (BUY, SELL, HOLD) and rationale for the **Growth Analyst**.
    2.  Provide a trading decision (BUY, SELL, HOLD) and rationale for the **Value Analyst**.
    3.  Based on a holistic and balanced synthesis of BOTH personas' views and all the data, provide a **final, single trading decision** and a concluding one-sentence rationale.
    `;

    const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: decisionSchema,
            temperature: 0.6,
        },
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Decision;
    } catch (e) {
        console.error("Failed to parse trading decision JSON:", response.text);
        throw new Error("Received an invalid format for trading decision.");
    }
};

export const getNewsAndSentiment = async (companyName: string, modelId: TextModelId): Promise<NewsSentimentResult> => {
    const prompt = `
    You are a 'News Analysis' bot. Your primary function is to find recent, real news from major financial news outlets.
    Company: ${companyName}.
    
    Find up to 8 recent, real news headlines that could plausibly affect this company's stock price.
    For each headline, provide the original source, the headline text, and a concise summary.
    Then, determine the overall market sentiment ('Positive', 'Negative', 'Neutral') based on a critical analysis of these headlines.
    `;

    const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: newsSchema,
            temperature: 0.7,
        },
    });

    try {
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        // Manually add a reliable Google News search URL to each headline
        if (result.headlines && Array.isArray(result.headlines)) {
            result.headlines.forEach((headline: any) => {
                if (headline.headline) {
                    headline.url = `https://www.google.com/search?q=${encodeURIComponent(headline.headline)}&tbm=nws`;
                }
            });
        }

        return result as NewsSentimentResult;
    } catch (e) {
        console.error("Failed to parse news JSON:", response.text);
        throw new Error("Received an invalid format for news and sentiment.");
    }
};

export const getSocialMediaPosts = async (companyName: string, platform: 'X' | 'Reddit', modelId: TextModelId): Promise<SocialMediaResult> => {
    const prompt = `
    You are a 'Social Media Analysis' bot for the ${platform} platform.
    Your job is to gauge the sentiment on ${platform} about a specific company.
    Company: ${companyName}.
    
    Find 7 recent, representative, and plausible social media posts that reflect the current buzz on ${platform}.
    For each post, invent a plausible author and summarize a common viewpoint. Do not use real user handles.
    For each post, also provide an optional, relevant URL. This could be a link to a search on the platform for the company's ticker, a relevant news article they are discussing, or a community page (like a subreddit). Do not link to individual user posts or profiles.
    Ensure you always return content, creating hypothetical but realistic examples.
    `;

    const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: socialMediaSchema,
            temperature: 0.9,
        },
    });

    try {
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as SocialMediaResult;
        // Ensure platform field is correctly set, as model might hallucinate.
        result.posts.forEach(p => p.platform = platform);
        return result;
    } catch (e) {
        console.error(`Failed to parse ${platform} social media JSON:`, response.text);
        return { posts: [] };
    }
};

export const getVerifiedSocialSentiment = async (companyName: string, xData: SocialMediaResult, redditData: SocialMediaResult, modelId: TextModelId): Promise<VerifiedSocialMediaResult> => {
     const prompt = `
        You are a 'Social Sentiment Verification' bot. Your job is to analyze social media data from multiple sources, verify the overall sentiment, and identify key discussion points.
        Company: ${companyName}
        
        X Posts: ${JSON.stringify(xData.posts)}
        Reddit Posts: ${JSON.stringify(redditData.posts)}

        Tasks:
        1. Compare the sentiment and topics from both X and Reddit.
        2. Determine a single, verified overall sentiment ('Positive', 'Negative', 'Neutral').
        3. Write a one-sentence summary of your findings. Did the platforms agree? Was one more bullish than the other?
        4. Select up to 5 of the most relevant and representative posts from the combined list.
     `;
     
     const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: verifiedSocialSchema,
            temperature: 0.5,
        },
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as VerifiedSocialMediaResult;
    } catch (e) {
        console.error("Failed to parse verified social media JSON:", response.text);
        throw new Error("Received an invalid format for verified social sentiment.");
    }
};


export const getCompanyInfo = async (companyName: string, ticker: string, modelId: TextModelId): Promise<CompanyProfile> => {
    const prompt = `
    You are a 'Company Intelligence' bot.
    Your job is to provide a summary about a specific company.
    Company: ${companyName} (${ticker}).

    Provide a concise, one-paragraph professional summary covering its main business, market position, and recent focus.
    `;

    const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: profileSchema,
            temperature: 0.3,
        },
    });

     try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CompanyProfile;
    } catch (e) {
        console.error("Failed to parse company profile JSON:", response.text);
        throw new Error("Received an invalid format for company profile.");
    }
};

export const findCompanyDetails = async (companyQuery: string, modelId: TextModelId): Promise<Company | null> => {
     const prompt = `
    You are a financial data assistant. Your task is to find information about a publicly traded company based on a user's query.
    Query: "${companyQuery}"

    Please find the official company name, its primary stock ticker symbol, and a URL for its logo. 
    The logo must be a direct link to an image file from a reliable source like companiesmarketcap.com.
    If you cannot find the company or any of the required information, you must return an object with null values for all fields.
    `;

    const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: companyFinderSchema,
            temperature: 0.1,
        },
    });

    try {
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as Company;
        if (result.ticker && result.name && result.logo) {
            result.ticker = result.ticker.split(':').pop()?.toUpperCase() || result.ticker;
            return result;
        }
        return null;
    } catch (e) {
        console.error("Failed to parse company finder JSON:", response.text);
        return null;
    }
};

export const getHistoricalPriceData = async (ticker: string, modelId: TextModelId): Promise<PriceData[]> => {
    const prompt = `
    You are a 'Financial Data Bot'.
    Generate a plausible, realistic 30-day historical stock price data set for the company with ticker: ${ticker}.
    The data should look like a real stock's performance, with natural-looking fluctuations, but it does not need to be real historical data.
    The output should be an array of 30 objects, each with a "name" (e.g., "Day 1") and a "price".
    `;

    const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: priceDataSchema,
            temperature: 0.8,
        },
    });

    try {
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result.prices as PriceData[];
    } catch (e) {
        console.error(`Failed to parse price data JSON for ${ticker}:`, response.text);
        // Fallback to mock data on failure
        return generateMockPriceData();
    }
};