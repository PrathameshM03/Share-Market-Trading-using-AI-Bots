import React from 'react';
import { HistoricalDecision, DecisionType } from '../types';
import { BuyIcon, SellIcon, HoldIcon, HistoryIcon } from './IconComponents';

interface TradingHistoryProps {
    history: HistoricalDecision[];
    isLoading: boolean;
}

const decisionConfig = {
    [DecisionType.BUY]: { Icon: BuyIcon, textColor: 'text-success' },
    [DecisionType.SELL]: { Icon: SellIcon, textColor: 'text-danger' },
    [DecisionType.HOLD]: { Icon: HoldIcon, textColor: 'text-muted-foreground' },
};

const HistorySkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse p-1">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-secondary/50 p-3 rounded-lg flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
                <div className="h-6 w-16 bg-muted rounded-md"></div>
            </div>
        ))}
    </div>
);


const TradingHistory: React.FC<TradingHistoryProps> = ({ history, isLoading }) => {
    if (isLoading) {
        return <HistorySkeleton />;
    }

    if (!history || history.length === 0) {
        return (
            <div className="text-center py-16 px-4 h-full flex flex-col items-center justify-center">
                <HistoryIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium text-foreground">No Trading History</h3>
                <p className="mt-1 text-sm text-muted-foreground text-center">
                    AI decisions for companies you analyze will be recorded here.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto h-full p-1">
            <ul className="space-y-3">
                {history.map((item, index) => {
                    const config = decisionConfig[item.decision];
                    const date = new Date(item.date);
                    const formattedDate = isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    return (
                        <li key={index} className="bg-secondary/50 p-3 rounded-lg flex items-start space-x-4 transition-colors hover:bg-secondary">
                            <img 
                                src={item.companyLogo}
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0EwQUVDMCI+PHBhdGggZD0iTTEyIDJDNi40OCA MiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDh6TTExIDE1aDJ2M2gtMnptMC04aDJ2NmgtMnoiLz48L3N2Zz4='}}
                                alt={`${item.companyName} logo`} 
                                className="h-10 w-10 rounded-full bg-white object-contain flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-foreground truncate">{item.companyName} ({item.companyTicker})</p>
                                        <p className="text-xs text-muted-foreground">{formattedDate}</p>
                                    </div>
                                    <div className={`flex items-center gap-1.5 font-bold text-sm ${config.textColor} flex-shrink-0 ml-2`}>
                                        <config.Icon className="h-4 w-4" />
                                        <span>{item.decision}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-foreground/80 mt-2">{item.rationale}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TradingHistory;
