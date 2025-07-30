import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { ExternalLinkIcon } from './IconComponents';

interface NewsListProps {
    newsItems: NewsItem[];
    isLoading: boolean;
    onViewItem: (item: NewsItem) => void;
}

const ITEMS_PER_PAGE = 7;

const SkeletonLoader: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3">
                <div className="bg-secondary rounded-full h-2 w-2 mt-2 flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-secondary rounded w-full"></div>
                    <div className="h-4 bg-secondary rounded w-2/3"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
            </div>
        ))}
    </div>
);


const NewsList: React.FC<NewsListProps> = ({ newsItems, isLoading, onViewItem }) => {
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [newsItems]);

    const totalPages = Math.ceil(newsItems.length / ITEMS_PER_PAGE);
    const paginatedItems = newsItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    if (isLoading) return <div className="p-2"><SkeletonLoader /></div>;
    
    if (paginatedItems.length === 0) {
         return <p className="text-center text-muted-foreground italic py-8">No news available.</p>;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto pr-2">
                <ul className="space-y-5">
                    {paginatedItems.map((item, index) => (
                        <li key={index} className="flex items-start space-x-3 group">
                            <div className="flex-shrink-0 pt-1.5">
                                <span className="block h-2 w-2 rounded-full bg-primary"></span>
                            </div>
                            <div className="flex-1">
                                <button onClick={() => onViewItem(item)} className="text-left w-full hover:text-primary transition-colors">
                                <p className="text-foreground font-medium leading-tight group-hover:text-primary transition-colors">
                                    {item.headline}
                                </p>
                            </button>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <span>Source: {item.source}</span>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="ml-2 p-1 rounded-full text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                                        aria-label="Read full article in new tab"
                                    >
                                        <ExternalLinkIcon className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {totalPages > 1 && (
                <div className="pt-2 mt-auto flex justify-center items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`h-7 w-7 rounded-md text-xs font-medium transition-colors ${
                                currentPage === page
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary hover:bg-primary/20 text-foreground'
                            }`}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsList;
