
import React, { useState } from 'react';
import { Company } from '../types';
import Card from './ui/Card';
import { SearchIcon } from './IconComponents';
import Spinner from './ui/Spinner';

interface CompanyListProps {
    companies: Company[];
    selectedCompany: Company;
    onSelectCompany: (company: Company) => void;
    onSearchCompany: (query: string) => void;
    isSearching: boolean;
}

const CompanyList: React.FC<CompanyListProps> = ({ companies, selectedCompany, onSelectCompany, onSearchCompany, isSearching }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isSearching) {
            onSearchCompany(query.trim());
        }
    };

    return (
        <Card>
            <div className="p-4 border-b border-border">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search e.g. 'Netflix' or 'NFLX'"
                        className="w-full bg-background border border-border rounded-lg py-2 pl-4 pr-10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Search for a company"
                        disabled={isSearching}
                    />
                    <button 
                        type="submit" 
                        className="absolute inset-y-0 right-0 flex items-center pr-3 disabled:opacity-50"
                        aria-label="Search"
                        disabled={isSearching}
                    >
                        {isSearching ? <Spinner /> : <SearchIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />}
                    </button>
                </form>
            </div>
            <Card.Body>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider">Tracked Companies</h4>
                <ul className="space-y-2">
                    {companies.map((company) => (
                        <li key={company.ticker}>
                            <button
                                onClick={() => onSelectCompany(company)}
                                className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                    selectedCompany.ticker === company.ticker
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'bg-secondary/50 hover:bg-secondary'
                                }`}
                                aria-current={selectedCompany.ticker === company.ticker ? 'page' : undefined}
                            >
                                <img 
                                    src={company.logo} 
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0EwQUVDMCI+PHBhdGggZD0iTTEyIDJDNi40OCA MiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDh6TTExIDE1aDJ2M2gtMnptMC04aDJ2NmgtMnoiLz48L3N2Zz4='}}
                                    alt={`${company.name} logo`} 
                                    className="h-8 w-8 rounded-full mr-3 bg-white object-contain flex-shrink-0" 
                                />
                                <div className="text-left overflow-hidden">
                                    <p className={`font-semibold ${selectedCompany.ticker !== company.ticker && 'text-foreground'}`}>{company.ticker}</p>
                                    <p className={`text-sm  ${selectedCompany.ticker === company.ticker ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{company.name}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </Card.Body>
        </Card>
    );
};

export default CompanyList;