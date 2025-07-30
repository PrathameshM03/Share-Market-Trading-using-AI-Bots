import React from 'react';
import { SocialMediaPost } from '../types';
import { ExternalLinkIcon } from './IconComponents';


interface SocialListProps {
    socialPosts: SocialMediaPost[];
    isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-secondary/50 p-3 rounded-lg">
                <div className="flex items-center text-xs font-semibold mb-2">
                     <div className="h-4 w-12 bg-muted rounded"></div>
                     <div className="mx-2 h-4 w-1 bg-muted rounded-full"></div>
                     <div className="h-4 w-24 bg-muted rounded"></div>
                </div>
                <div className="h-3 bg-muted rounded w-full mt-2"></div>
                <div className="h-3 bg-muted rounded w-5/6 mt-1"></div>
            </div>
        ))}
    </div>
);

const SocialList: React.FC<SocialListProps> = ({ socialPosts, isLoading }) => {
    
    if (isLoading) return <div className="p-2"><SkeletonLoader /></div>;
    
    if (socialPosts.length === 0) {
        return <p className="text-center text-muted-foreground italic py-8">No social media buzz detected.</p>;
    }

    return (
        <div className="overflow-y-auto h-full pr-2">
            <ul className="space-y-4">
                {socialPosts.map((post, index) => (
                    <li key={index} className="bg-secondary/50 p-3 rounded-lg">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center text-xs font-semibold mb-2">
                                    <span className={`font-bold ${post.platform === 'X' ? 'text-sky-400' : 'text-orange-500'}`}>{post.platform}</span>
                                    <span className="text-muted-foreground mx-2">•</span>
                                    <span className="text-muted-foreground truncate">{post.author}</span>
                                </div>
                                <p className="text-foreground/80 text-sm">{post.content}</p>
                            </div>
                            {post.url && (
                                <a
                                    href={post.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="ml-2 mt-0.5 flex-shrink-0 p-1 rounded-full text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                                    aria-label="View source"
                                >
                                    <ExternalLinkIcon className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SocialList;
