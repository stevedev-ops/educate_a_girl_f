const SkeletonCard = () => {
    return (
        <div className="flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 animate-pulse">
            <div className="aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-4 flex flex-col gap-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="flex items-center justify-between mt-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
