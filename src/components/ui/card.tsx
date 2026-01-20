import React, { ReactNode } from 'react';
import Button from './button';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  onClick?: () => void;
  [key: string]: any;
}

const Card = ({
  children,
  className = '',
  variant = 'default',
  onClick,
  ...props
}: CardProps) => {
  const variants = {
    default: 'bg-background  dark:bg-background-dark text-text dark:text-text-dark border-gray-200  ',
    primary: 'bg-primary dark:bg-primary-dark border-primary/20 text-text dark:text-text-dark',
    secondary: 'bg-secondary dark:bg-secondary-dark text-text dark:text-text-dark ',
    accent: 'bg-accent dark:bg-accent-dark border-accent/20 text-text dark:text-text-dark',
  };
  
  return (
    <div 
      className={`border max-w-5xl mb-5 p-4 rounded-md ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardComponentProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

interface CardTitleProps extends CardComponentProps {
  as?: React.ElementType;
}

const CardHeader = ({ children, className = '', ...props }: CardComponentProps) => {
  return (
    <div className={`text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-text dark:text-text-dark ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }: CardTitleProps) => {
  return (
    <Component className={`text-text ${className}`} {...props}>
      {children}
    </Component>
  );
};

const CardDescription = ({ children, className = '', ...props }: CardComponentProps) => {
  return (
    <p className={`text-text/70 ${className}`} {...props}>
      {children}
    </p>
  );
};

const CardContent = ({ children, className = '', ...props }: CardComponentProps) => {
  return (
    <div className={`text-text  z-5 dark:text-text-dark py-8 px-4  ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', ...props }: CardComponentProps) => {
  return (
    <div className={`border-t border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};


interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
}

const CardImage: React.FC<CardImageProps> = ({ src, alt = '', className = '', ...props }) => {
  return (
    <div className="relative overflow-hidden mt-4">
      <img
        src={src}
        alt={alt}
        className={`h-80 w-full object-cover rounded-md ${className}`}
        {...props}
      />
    </div>
  );
};


export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardImage, CardButton };
export default Card;

function CardButton() {
  return <div className='mt-4'>
    <Button>button</Button>

  </div>;
}
