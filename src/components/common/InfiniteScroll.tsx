import { ReactNode, useEffect, useRef } from "react";

interface InfiniteScrollProps {
  children: ReactNode;
  loader: ReactNode;
  fetchMore: () => void;
  hasMore: boolean;
  endMessage?: ReactNode;
  className?: string;
}
const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  loader,
  fetchMore,
  hasMore,
  endMessage,
  className,
}) => {
  const pageEndRef = useRef(null);
  useEffect(() => {
    if (hasMore) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      });

      if (pageEndRef.current) {
        observer.observe(pageEndRef.current);
      }

      return () => {
        if (pageEndRef.current) {
          observer.unobserve(pageEndRef.current);
        }
      };
    }
  }, [hasMore]);
  return (
    <div className={className}>
      {children}

      {hasMore ? <div ref={pageEndRef}>{loader}</div> : endMessage}
    </div>
  );
};

export default InfiniteScroll;
