import { useEffect, useState } from 'react';

const Home = () => {
    const [status, setStatus] = useState<string>('Loading...');

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
        fetch(`${apiUrl}/health`)
            .then((res) => res.json())
            .then((data) => setStatus(data.message))
            .catch((err) => {
                console.error('Error connecting to backend:', err);
                setStatus('Error connecting to backend');
            });
    }, []);

    return (
        <div className="p-4">
          <div className="p-4">
                <p className="font-semibold">Backend Status:</p>
                <p className={status.includes('Error') ? 'text-red-500' : 'text-green-500'}>
                    {status}
                </p>
            </div>
        </div>
    );
};

export default Home;
