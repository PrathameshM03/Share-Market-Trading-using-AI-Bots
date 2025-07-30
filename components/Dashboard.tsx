import React from 'react';
import { Company, Decision, CompanyProfile, ChartColors, VerifiedSocialMediaResult, PriceData } from '../types';
import Card from './ui/Card';
import PriceChart from './PriceChart';
import BotDecisionCard from './BotDecisionCard';
import Spinner from './ui/Spinner';

interface DashboardProps {
    company: Company;
    decision: Decision | null;
    companyProfile: CompanyProfile | null;
    verifiedSocialResult: VerifiedSocialMediaResult | null;
    priceData: PriceData[] | null;
    isLoading: boolean;
    loadingMessage: string;
    error: string | null;
    chartColors: ChartColors;
}

const Dashboard: React.FC<DashboardProps> = ({ company, decision, companyProfile, verifiedSocialResult, priceData, isLoading, loadingMessage, error, chartColors }) => {
    return (
        <div className="space-y-8">
            <section>
                <Card>
                    <Card.Header>
                        <div className="flex items-center">
                            <img src={company.logo} alt={`${company.name} logo`} className="h-10 w-10 rounded-full mr-4 bg-white" />
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">{company.name} ({company.ticker})</h2>
                                <p className="text-muted-foreground">Real-time Simulated Data</p>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {isLoading && !decision ? (
                            <div className="h-40 flex items-center justify-center">
                                <Spinner />
                            </div>
                        ) : companyProfile ? (
                             <p className="text-foreground/80 leading-relaxed">{companyProfile.summary}</p>
                        ) : (
                             <p className="text-muted-foreground italic">Company profile not available.</p>
                        )}
                    </Card.Body>
                </Card>
            </section>

            <section>
                 <BotDecisionCard decision={decision} verifiedSocialResult={verifiedSocialResult} isLoading={isLoading} loadingMessage={loadingMessage} error={error} />
            </section>

            <section>
                <Card>
                    <Card.Header>Price Chart</Card.Header>
                    <Card.Body>
                        {priceData ? (
                           <PriceChart data={priceData} colors={chartColors} />
                        ) : (
                           <div className="flex items-center justify-center h-[300px]">
                               <Spinner />
                               <p className="ml-4 text-muted-foreground">Fetching price history...</p>
                           </div>
                        )}
                    </Card.Body>
                </Card>
            </section>
        </div>
    );
};

export default Dashboard;