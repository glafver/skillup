const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center flex-grow">
            <img
                src="/404.png"
                alt="Not found illustration"
                className="max-h-full max-w-full object-contain"
            />
        </div>
    );
};

export default NotFound;
