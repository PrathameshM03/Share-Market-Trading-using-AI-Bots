import React from 'react';
import { BotIcon, CheckShieldIcon, BriefcaseIcon, NewsIcon, GithubIcon, TwitterIcon, LinkedinIcon } from './IconComponents';

interface LandingPageProps {
    onLoginClick: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="bg-secondary/50 p-6 rounded-xl border border-border flex flex-col items-center text-center transform hover:scale-105 hover:bg-secondary transition-transform duration-300">
        <div className="bg-primary/10 p-4 rounded-full mb-4 border border-primary/20">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    return (
        <div className="bg-background min-h-screen text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-background/70 backdrop-blur-sm">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                            <BotIcon className="h-8 w-8 text-primary" />
                            <h1 className="ml-3 text-2xl font-bold text-foreground tracking-tight">AI Trading Bot</h1>
                        </div>
                        <button
                            onClick={onLoginClick}
                            className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                        >
                            Login / Register
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <section className="relative py-24 md:py-32 text-center overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-10"></div>
                     <div className="absolute inset-0 -mx-20 animate-pulse-slow">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl"></div>
                     </div>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground leading-tight">
                            Power Your Trades with Multi-Agent AI Analysis
                        </h2>
                        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Go beyond basic signals. Our system uses a team of specialized AI bots to gather, verify, and analyze market data, giving you a comprehensive edge.
                        </p>
                        <div className="mt-10">
                            <button
                                onClick={onLoginClick}
                                className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-lg text-lg hover:bg-primary/90 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-secondary/30">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold tracking-tight">A Smarter Way to Analyze the Market</h3>
                            <p className="mt-4 text-lg text-muted-foreground">Our platform is built on a foundation of specialized, collaborative AI agents.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={<NewsIcon className="h-8 w-8 text-primary" />}
                                title="Multi-Source Intelligence"
                                description="AI bots scan news, social media, and financial data to create a complete picture of market sentiment and company health."
                            />
                            <FeatureCard 
                                icon={<CheckShieldIcon className="h-8 w-8 text-primary" />}
                                title="Data Verification Pipeline"
                                description="Information is cross-referenced by verification bots to ensure accuracy and filter out noise before it reaches the decision makers."
                            />
                             <FeatureCard 
                                icon={<BriefcaseIcon className="h-8 w-8 text-primary" />}
                                title="Dual-Perspective Decisions"
                                description="Final trading recommendations are synthesized from two distinct AI personas—a 'Growth' and a 'Value' analyst—for a balanced view."
                            />
                        </div>
                    </div>
                </section>

                {/* Platform Preview Section */}
                <section className="py-20 bg-background">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">See It In Action</h3>
                            <p className="mt-4 text-lg text-muted-foreground">A clean, powerful dashboard designed for clarity and quick decisions.</p>
                        </div>
                        
                        <div className="relative max-w-5xl mx-auto">
                            {/* Glow effect */}
                            <div className="absolute -inset-2">
                                <div className="w-full h-full max-w-5xl mx-auto lg:h-full bg-primary/10 rounded-3xl blur-3xl"></div>
                            </div>

                            {/* Mockup UI */}
                            <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-xl shadow-2xl p-2 sm:p-3 lg:p-4">
                                <div className="bg-background rounded-lg aspect-video w-full p-2 sm:p-4 flex gap-4 overflow-hidden">
                                    {/* Sidebar */}
                                    <div className="w-1/4 flex-shrink-0 bg-secondary/40 rounded-md p-2 space-y-2">
                                        <div className="h-6 w-3/4 bg-muted rounded"></div>
                                        <div className="space-y-1.5">
                                            <div className="h-10 w-full bg-primary/70 rounded-md"></div>
                                            <div className="h-10 w-full bg-muted/40 rounded-md"></div>
                                            <div className="h-10 w-full bg-muted/40 rounded-md"></div>
                                        </div>
                                    </div>
                                    {/* Main panel */}
                                    <div className="w-3/4 flex flex-col gap-4">
                                        <div className="h-1/3 bg-secondary/40 rounded-md p-2">
                                            <div className="h-4 w-1/3 bg-muted rounded"></div>
                                        </div>
                                        <div className="h-2/3 bg-secondary/40 rounded-md p-2 flex items-center justify-center">
                                            <div className="w-1/2 h-1/2 bg-success/10 rounded-lg flex items-center justify-center">
                                                <span className="text-2xl font-bold text-success">BUY</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* How It Works Section */}
                <section className="py-20">
                     <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold tracking-tight">Simple Yet Powerful Pipeline</h3>
                            <p className="mt-4 text-lg text-muted-foreground">From raw data to actionable insight in three steps.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="p-4">
                                <div className="text-5xl font-extrabold text-primary/50 mb-2">1</div>
                                <h4 className="text-xl font-semibold mb-2">Data Ingestion</h4>
                                <p className="text-muted-foreground">Bots gather real-time news and social buzz from across the web.</p>
                            </div>
                            <div className="p-4">
                                <div className="text-5xl font-extrabold text-primary/70 mb-2">2</div>
                                <h4 className="text-xl font-semibold mb-2">AI Verification</h4>
                                <p className="text-muted-foreground">A dedicated AI agent verifies and synthesizes the raw data into a coherent sentiment analysis.</p>
                            </div>
                            <div className="p-4">
                                 <div className="text-5xl font-extrabold text-primary mb-2">3</div>
                                <h4 className="text-xl font-semibold mb-2">Trading Decision</h4>
                                <p className="text-muted-foreground">Our main AI analysts debate the findings and issue a final, synthesized trading recommendation.</p>
                            </div>
                        </div>
                     </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-secondary/30 border-t border-border">
                <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center space-x-6">
                         <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Github">
                            <GithubIcon className="h-6 w-6" />
                        </a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                            <TwitterIcon className="h-6 w-6" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                            <LinkedinIcon className="h-6 w-6" />
                        </a>
                    </div>
                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} AI Trading Bot. All Rights Reserved. For educational purposes only.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;