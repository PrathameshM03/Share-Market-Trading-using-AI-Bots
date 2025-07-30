import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Company, Decision, NewsItem, SocialMediaPost, CompanyProfile, TextModelId, Theme, HistoricalDecision, ChartColors, VerifiedSocialMediaResult, PriceData } from '../types';
import { MOCK_COMPANIES, AVAILABLE_MODELS, getMockDecision, getMockNews, getMockSocialPosts, getMockProfile, getMockVerifiedSocialResult, generateMockPriceData } from '../constants';
import * as GeminiService from '../services/geminiService';

import Header from './Header';
import CompanyList from './CompanyList';
import Dashboard from './Dashboard';
import NewsList from './NewsList';
import SocialList from './SocialList';
import TradingHistory from './TradingHistory';
import SettingsPage from './SettingsPage';
import AboutModal from './AboutModal';
import NewsModal from './NewsModal';
import DemoModeNotification from './DemoModeNotification';
import { HistoryIcon, NewsIcon, ChatBubbleIcon } from './IconComponents';

interface MainAppProps {
    currentUser: User;
    onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ currentUser, onLogout }) => {
    // --- STATE MANAGEMENT ---
    
    // Page & View State
    const [currentPage, setCurrentPage] = useState<'dashboard' | 'settings'>('dashboard');
    const [activeInfoTab, setActiveInfoTab] = useState<'news' | 'social' | 'history'>('news');

    // Modal State
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [viewedNewsItem, setViewedNewsItem] = useState<NewsItem | null>(null);

    // User & Settings State
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'dark');
    const [model, setModel] = useState<TextModelId>(() => (localStorage.getItem('ai_model') as TextModelId) || AVAILABLE_MODELS[0].id);
    
    // Company & Data State
    const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
    const [selectedCompany, setSelectedCompany] = useState<Company>(MOCK_COMPANIES[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    
    // Fetched Data State
    const [decision, setDecision] = useState<Decision | null>(null);
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [socialPosts, setSocialPosts] = useState<SocialMediaPost[]>([]);
    const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
    const [verifiedSocialResult, setVerifiedSocialResult] = useState<VerifiedSocialMediaResult | null>(null);
    const [priceData, setPriceData] = useState<PriceData[] | null>(null);
    const [tradingHistory, setTradingHistory] = useState<HistoricalDecision[]>([]);
    
    // --- EFFECTS ---

    // Apply theme to HTML element
    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Save model preference
    useEffect(() => {
        localStorage.setItem('ai_model', model);
    }, [model]);

    // Load user's trading history on mount
    useEffect(() => {
        const storedHistory = localStorage.getItem(`trading_history_${currentUser.username}`);
        if (storedHistory) {
            setTradingHistory(JSON.parse(storedHistory));
        }
    }, [currentUser.username]);
    
    // Save trading history whenever it changes
    useEffect(() => {
        if (tradingHistory.length > 0) {
            localStorage.setItem(`trading_history_${currentUser.username}`, JSON.stringify(tradingHistory));
        }
    }, [tradingHistory, currentUser.username]);

    // Main data fetching logic
    const fetchData = useCallback(async (company: Company) => {
        setIsLoading(true);
        setError(null);
        setIsDemoMode(false);
        setPriceData(null); // Reset price data

        const useCache = true;
        const cacheKey = `company_data_${company.ticker}`;
        const cachedData = useCache ? localStorage.getItem(cacheKey) : null;
        const now = new Date().getTime();

        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            if (now - timestamp < 3600 * 1000) { // 1 hour cache
                setLoadingMessage('Loading from cache...');
                setCompanyProfile(data.companyProfile);
                setNewsItems(data.newsItems);
                setSocialPosts(data.socialPosts);
                setVerifiedSocialResult(data.verifiedSocialResult);
                setDecision(data.decision);
                setPriceData(data.priceData);
                setIsLoading(false);
                return;
            }
        }
        
        try {
            setLoadingMessage('Fetching company profile...');
            const profilePromise = GeminiService.getCompanyInfo(company.name, company.ticker, model);
            
            setLoadingMessage('Analyzing news headlines...');
            const newsPromise = GeminiService.getNewsAndSentiment(company.name, model);

            setLoadingMessage('Scanning X (Twitter)...');
            const xPromise = GeminiService.getSocialMediaPosts(company.name, 'X', model);

            setLoadingMessage('Scanning Reddit...');
            const redditPromise = GeminiService.getSocialMediaPosts(company.name, 'Reddit', model);
            
            setLoadingMessage('Fetching price history...');
            const pricePromise = GeminiService.getHistoricalPriceData(company.ticker, model);

            const [profile, newsResult, xResult, redditResult, prices] = await Promise.all([profilePromise, newsPromise, xPromise, redditPromise, pricePromise]);
            
            setCompanyProfile(profile);
            setNewsItems(newsResult.headlines);
            setPriceData(prices);

            setLoadingMessage('Verifying social sentiment...');
            const verifiedResult = await GeminiService.getVerifiedSocialSentiment(company.name, xResult, redditResult, model);
            setVerifiedSocialResult(verifiedResult);
            setSocialPosts(verifiedResult.posts);

            setLoadingMessage('Bots are making a decision...');
            const finalDecision = await GeminiService.getTradingDecision(company, newsResult.sentiment, verifiedResult, model);
            setDecision(finalDecision);
            
            // Add to history
            const newHistoryItem: HistoricalDecision = {
                ...finalDecision,
                companyTicker: company.ticker,
                companyName: company.name,
                companyLogo: company.logo,
                date: new Date().toISOString(),
            };
            setTradingHistory(prev => [newHistoryItem, ...prev]);

            // Cache the new data
            if(useCache) {
                 const dataToCache = {
                    companyProfile: profile,
                    newsItems: newsResult.headlines,
                    socialPosts: verifiedResult.posts,
                    verifiedSocialResult: verifiedResult,
                    decision: finalDecision,
                    priceData: prices
                };
                localStorage.setItem(cacheKey, JSON.stringify({ data: dataToCache, timestamp: now }));
            }

        } catch (err: any) {
            console.error("API Error:", err);
            setError("The AI bots encountered an error. This might be due to API rate limits.");
            setIsDemoMode(true);
            setCompanyProfile(getMockProfile(company.name));
            setNewsItems(getMockNews(company.name).headlines);
            const mockVerified = getMockVerifiedSocialResult(company.name);
            setSocialPosts(mockVerified.posts);
            setVerifiedSocialResult(mockVerified);
            setDecision(getMockDecision());
            setPriceData(generateMockPriceData());
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [model, currentUser.username]);

    // Fetch data when selected company changes
    useEffect(() => {
        fetchData(selectedCompany);
    }, [selectedCompany, fetchData]);
    
    // --- EVENT HANDLERS ---
    
    const handleSearchCompany = async (query: string) => {
        setIsSearching(true);
        setError(null);
        try {
            const foundCompany = await GeminiService.findCompanyDetails(query, model);
            if (foundCompany) {
                // Check if company already exists
                if (!companies.some(c => c.ticker === foundCompany.ticker)) {
                     setCompanies(prev => [foundCompany, ...prev]);
                }
                setSelectedCompany(foundCompany);
            } else {
                 setError(`Could not find company: "${query}". Please try a different name or ticker.`);
            }
        } catch(e) {
            setError("Failed to search for company. Please check your connection or API key.");
        } finally {
            setIsSearching(false);
        }
    };
    
    const chartColors: ChartColors = useMemo(() => ({
        grid: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        text: theme === 'dark' ? '#e5e7eb' : '#374151'
    }), [theme]);


    // --- RENDER LOGIC ---

    if (currentPage === 'settings') {
        return <SettingsPage theme={theme} onSetTheme={setTheme} model={model} onSetModel={setModel} onGoBack={() => setCurrentPage('dashboard')} />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header
                currentUser={currentUser}
                onLogout={onLogout}
                onNavigate={setCurrentPage}
                onOpenAboutModal={() => setIsAboutModalOpen(true)}
            />
            <main className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
                {isDemoMode && <DemoModeNotification onGoToSettings={() => setCurrentPage('settings')} />}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <aside className="lg:col-span-1 space-y-8">
                        <CompanyList 
                            companies={companies}
                            selectedCompany={selectedCompany}
                            onSelectCompany={setSelectedCompany}
                            onSearchCompany={handleSearchCompany}
                            isSearching={isSearching}
                        />
                    </aside>
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                           <div className="xl:col-span-2">
                             <Dashboard
                                company={selectedCompany}
                                decision={decision}
                                companyProfile={companyProfile}
                                verifiedSocialResult={verifiedSocialResult}
                                priceData={priceData}
                                isLoading={isLoading}
                                loadingMessage={loadingMessage}
                                error={error}
                                chartColors={chartColors}
                            />
                           </div>
                           <div className="xl:col-span-1">
                               <div className="h-[calc(100vh-10rem)] flex flex-col bg-card rounded-xl shadow-lg border border-border">
                                    <div className="p-4 border-b border-border flex">
                                        <button
                                            onClick={() => setActiveInfoTab('news')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 text-center font-medium text-sm transition-all duration-200 rounded-l-md ${activeInfoTab === 'news' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'}`}
                                        >
                                            <NewsIcon className="h-5 w-5 flex-shrink-0" />
                                            News
                                        </button>
                                        <button
                                            onClick={() => setActiveInfoTab('social')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 text-center font-medium text-sm transition-all duration-200 ${activeInfoTab === 'social' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'}`}
                                        >
                                            <ChatBubbleIcon className="h-5 w-5 flex-shrink-0" />
                                            Social Buzz
                                        </button>
                                        <button
                                            onClick={() => setActiveInfoTab('history')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 text-center font-medium text-sm transition-all duration-200 rounded-r-md ${activeInfoTab === 'history' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'}`}
                                        >
                                            <HistoryIcon className="h-5 w-5 flex-shrink-0" />
                                            History
                                        </button>
                                    </div>
                                    <div className="flex-grow p-2 overflow-y-auto">
                                        {activeInfoTab === 'news' && (
                                            <NewsList
                                                newsItems={newsItems}
                                                isLoading={isLoading}
                                                onViewItem={setViewedNewsItem}
                                            />
                                        )}
                                        {activeInfoTab === 'social' && (
                                            <SocialList
                                                socialPosts={socialPosts}
                                                isLoading={isLoading}
                                            />
                                        )}
                                        {activeInfoTab === 'history' && (
                                            <TradingHistory history={tradingHistory} isLoading={false} />
                                        )}
                                    </div>
                                </div>
                           </div>
                        </div>
                    </div>
                </div>
            </main>
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
            <NewsModal item={viewedNewsItem} onClose={() => setViewedNewsItem(null)} />
        </div>
    );
};

export default MainApp;