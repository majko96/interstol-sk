import React, {useEffect, useState} from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'photoswipe/dist/photoswipe.css'
import { Gallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css'
import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin'

const Instagram = (props) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    const MAX_RETRIES = 5;
    const RETRY_DELAY = 2000; // 2 seconds

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
            console.log(error);
            if (retryCount < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return fetchData(retryCount + 1);
            }
            setError(true);
        }
    };

    useEffect(() => {
        fetchData().then();
    }, []);

    const renderLoading = () => {
        return (
            <div className="white-loader"></div>
        )
    }

    const renderFeed = () => {
        if (error) {
            return (
                <div className="about-us">
                    <p>Prepáčte, niečo sa pokazilo...</p>
                    {/*<button className={'btn btn-secondary send-button'} onClick={fetchData}>*/}
                    {/*    Skúsiť znova*/}
                    {/*</button>*/}
                </div>
            )
        }

        if (!data) return (
            <>{renderLoading()}</>
        );

        const rows = [];
        for (let i = 0; i < data.length; i += 3) {
            const rowItems = data.slice(i, i + 3).map((item, index) => (
                <div key={item.id} className="col-4 col-md-4 p-1">
                    <Item
                        original={`/instagram/${item.shortCode}.jpg`}
                        thumbnail={`/instagram/${item.shortCode}.jpg`}
                        width={item.width}
                        height={item.height}
                        key={item.id}
                        alt={item.caption}
                    >
                        {({ ref, open }) => (
                            <div className="img-container custom-height position-relative overflow-hidden"
                                 ref={ref}
                                 onClick={open}
                            >
                                <img
                                    className={'img-fluid insta-img'}
                                    src={`/instagram/${item.shortCode}.jpg`}
                                    alt=""
                                    style={{objectFit: 'cover', width: '100%', height: '100%'}}
                                />
                                <div className="img-overlay">
                                    {window.innerWidth > 1200 &&
                                        <>
                                            <p className="caption m-3">{item.caption}</p>
                                            <div className="d-fles justify-content-between">
                                                <div className={'overlay-info'}>
                                                    <p className={'insta'}>
                                                        <i className="fab fa-instagram fa-xl"></i>
                                                    </p>
                                                    <div className={'d-flex'}>
                                                        <p className="likes">
                                                            <i className="fa fa-heart me-1" aria-hidden="true"></i>
                                                            {item.likes.toLocaleString()}
                                                        </p>
                                                        <p className="comments">
                                                            <i className="fa fa-comment me-1" aria-hidden="true"></i>
                                                            {item.comments.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        )}
                    </Item>
                </div>
            ));

            rows.push(
                <React.Fragment key={i}>
                        {rowItems}
                </React.Fragment>
            );
        }

        return (
            <div>
                <div className="row g-0">{rows}</div>
                <div className={'pt-5'}>
                    <a className='btn btn-secondary send-button'
                       href={`https://instagram.com/${props.instagramAccount}`}  target={'_blank'}>
                        Zobraziť viac
                    </a>
                </div>
            </div>
        );
    };

    return (
        <>
            <Gallery
                withCaption={false}
                plugins={(pswpLightbox) => {
                    const captionPlugin = new PhotoSwipeDynamicCaption(pswpLightbox, {
                        captionContent: (slide) => slide.data.alt,
                    })
                }}
            >
                {renderFeed()}
            </Gallery>
        </>
    );
};

export default Instagram;
