import React, { useEffect, useState, useRef } from 'react';
import { Fancybox as NativeFancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

const Instagram = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const containerRef = useRef(null);

    const MAX_RETRIES = 5;
    const RETRY_DELAY = 2000;

    const fetchData = async (retryCount = 0) => {
        setError(false);
        setData(null);
        try {
            const response = await fetch('/api/instagram-feed-cached');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const result = await response.json();
            setError(false);
            setData(result);
        } catch (error) {
            console.error(error);
            if (retryCount < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return fetchData(retryCount + 1);
            }
            setError(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            NativeFancybox.bind(containerRef.current, '[data-fancybox]');
        }

        return () => {
            NativeFancybox.unbind(containerRef.current);
        };
    }, [data]);

    if (error) {
        return (
            <div className="about-us">
                <p>Prepáčte, niečo sa pokazilo...</p>
            </div>
        );
    }

    if (!data) {
        return <div className="white-loader"></div>;
    }

    const renderImages = () => {
        const rows = [];

        for (let i = 0; i < data.length; i += 3) {
            const rowItems = data.slice(i, i + 3).map(item => (
                <div key={item.id} className="col-4 col-md-4 p-1">
                    <a
                        href={item.link}
                        data-fancybox="gallery"
                        data-caption={item.caption}
                        className="d-block img-container custom-height position-relative overflow-hidden"
                    >
                        <img
                            className="img-fluid insta-img"
                            src={item.link}
                            alt={item.caption}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                        <div className="img-overlay"></div>
                    </a>
                </div>
            ));

            rows.push(
                <React.Fragment key={i}>
                    {rowItems}
                </React.Fragment>
            );
        }

        return rows;
    };

    return (
        <div ref={containerRef}>
            <div className="row g-0">
                {renderImages()}
            </div>
            <div className="pt-5">
                <a className="btn btn-secondary send-button" href="/realizacie">
                    Zobraziť viac
                </a>
            </div>
        </div>
    );
};

export default Instagram;
