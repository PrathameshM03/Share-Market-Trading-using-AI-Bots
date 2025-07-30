export interface Company {
    ticker: string;
    name: string;
    logo: string;
}

export interface PriceData {
    name: string;
    price: number;
}

export enum DecisionType {
    BUY = 'BUY',
    SELL = 'SELL',
    HOLD = 'HOLD'
}

export interface DecisionPerspective {
    name: string;
    decision: DecisionType;
    rationale: string;
}

export interface Decision {
    decision: DecisionType;
    rationale: string;
    perspectives: DecisionPerspective[];
}

export interface NewsItem {
    headline: string;
    source: string;
    url: string;
    summary: string;
}

export interface SocialMediaPost {
    platform: 'X' | 'Reddit' | 'Other';
    author: string;
    content: string;
    url?: string;
}

export interface CompanyProfile {
    summary: string;
}

export interface NewsSentimentResult {
    headlines: NewsItem[];
    sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export interface SocialMediaResult {
    posts: SocialMediaPost[];
}

export interface VerifiedSocialMediaResult {
    posts: SocialMediaPost[];
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    verificationSummary: string;
}

export interface User {
    username: string;
    fullName: string;
    email: string;
    password?: string;
}

export interface HistoricalDecision extends Decision {
    companyTicker: string;
    companyName: string;
    companyLogo: string;
    date: string; // ISO 8601 string
}


export type Theme = 'light' | 'dark';

export interface ChartColors {
    grid: string;
    text: string;
}

export type TextModelId = string;

export interface ModelInfo {
  id: TextModelId;
  name: string;
  description: string;
  isAvailable?: boolean;
}