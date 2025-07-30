import React from 'react';
import { Decision, DecisionType, DecisionPerspective, VerifiedSocialMediaResult } from '../types';
import { BuyIcon, SellIcon, HoldIcon, AlertTriangleIcon, CheckShieldIcon } from './IconComponents';
import Card from './ui/Card';
import Spinner from './ui/Spinner';

interface BotDecisionCardProps {
    decision: Decision | null;
    verifiedSocialResult: VerifiedSocialMediaResult | null;
    isLoading: boolean;
    loadingMessage: string;
    error: string | null;
}

const decisionConfig = {
    [DecisionType.BUY]: {
        Icon: BuyIcon,
        bgColor: 'bg-success/10',
        textColor: 'text-success',
        borderColor: 'border-success/50',
        title: 'BUY',
    },
    [DecisionType.SELL]: {
        Icon: SellIcon,
        bgColor: 'bg-danger/10',
        textColor: 'text-danger',
        borderColor: 'border-danger/50',
        title: 'SELL',
    },
    [DecisionType.HOLD]: {
        Icon: HoldIcon,
        bgColor: 'bg-secondary/20',
        textColor: 'text-muted-foreground',
        borderColor: 'border-border',
        title: 'HOLD',
    },
};

const sentimentColors = {
    Positive: { bg: 'bg-success/10', text: 'text-success' },
    Negative: { bg: 'bg-danger/10', text: 'text-danger' },
    Neutral: { bg: 'bg-secondary/50', text: 'text-muted-foreground' },
};


const PerspectiveCard: React.FC<{ perspective: DecisionPerspective }> = ({ perspective }) => {
    const config = decisionConfig[perspective.decision] || decisionConfig.HOLD;
    
    return (
        <div className={`p-4 rounded-lg border ${config.borderColor} ${config.bgColor}`}>
            <h4 className="font-bold text-lg text-foreground">{perspective.name}</h4>
            <div className={`flex items-center gap-2 mt-1 font-semibold ${config.textColor}`}>
                <config.Icon className="h-5 w-5" />
                <span>{config.title} Signal</span>
            </div>
            <p className="text-sm text-foreground/80 mt-2">{perspective.rationale}</p>
        </div>
    );
};

const BotDecisionCard: React.FC<BotDecisionCardProps> = ({ decision, verifiedSocialResult, isLoading, loadingMessage, error }) => {
    if (isLoading) {
        return (
             <Card>
                <Card.Body className="flex items-center justify-center h-48">
                    <Spinner />
                    <p className="ml-4 text-lg text-muted-foreground">{loadingMessage || 'AI Bots are analyzing...'}</p>
                </Card.Body>
            </Card>
        );
    }
    
    if (error) {
         return (
             <Card>
                <Card.Body className="flex items-center justify-center h-24 text-danger">
                    <AlertTriangleIcon className="h-6 w-6 mr-3" />
                    <div>
                        <p className="font-semibold">Analysis Failed</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </Card.Body>
            </Card>
         );
    }

    if (!decision) {
        return (
             <Card>
                <Card.Body className="flex items-center justify-center h-24 text-muted-foreground">
                    <p>No decision available.</p>
                </Card.Body>
            </Card>
        );
    }

    const { Icon, bgColor, textColor, borderColor, title } = decisionConfig[decision.decision] || decisionConfig.HOLD;
    const sentimentConfig = verifiedSocialResult ? sentimentColors[verifiedSocialResult.sentiment] : sentimentColors.Neutral;

    return (
        <Card>
            <div className={`p-5 border-b ${borderColor} ${bgColor}`}>
                <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-4 ${bgColor}`}>
                        <Icon className={`h-10 w-10 ${textColor}`} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Synthesized Decision</h3>
                        <p className={`text-3xl font-bold ${textColor}`}>{title}</p>
                    </div>
                </div>
                <p className="text-foreground mt-3 text-lg">{decision.rationale}</p>
            </div>

            {/* Data Verification Panel */}
            {verifiedSocialResult && (
                 <div className="p-4 border-b border-border bg-secondary/20">
                    <h4 className="flex items-center text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                        <CheckShieldIcon className="h-5 w-5 mr-2 text-primary" />
                        Data Verification
                    </h4>
                    <div className="space-y-2">
                        <p className="text-sm text-foreground/80 italic">
                            "{verifiedSocialResult.verificationSummary}"
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">Verified Social Sentiment:</span>
                            <span className={`font-bold text-sm px-2 py-0.5 rounded-full ${sentimentConfig.bg} ${sentimentConfig.text}`}>
                                {verifiedSocialResult.sentiment}
                            </span>
                        </div>
                    </div>
                </div>
            )}
           
            <Card.Body>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">AI Analyst Perspectives</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {decision.perspectives.map(p => <PerspectiveCard key={p.name} perspective={p} />)}
                </div>
            </Card.Body>
        </Card>
    );
};

export default BotDecisionCard;