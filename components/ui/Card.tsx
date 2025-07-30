

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">{children}</h3>
    </div>
);

const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`p-4 ${className}`}>
        {children}
    </div>
);

const Card: React.FC<CardProps> & { Header: typeof CardHeader; Body: typeof CardBody } = ({ children, className = '', ...props }) => {
    return (
        <div className={`bg-card rounded-xl shadow-lg overflow-hidden border border-border ${className}`} {...props}>
            {children}
        </div>
    );
};

Card.Header = CardHeader;
Card.Body = CardBody;

export default Card;