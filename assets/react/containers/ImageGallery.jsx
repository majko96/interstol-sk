import React from 'react';
import 'photoswipe/dist/photoswipe.css'
import { Gallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css'
import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin'

const ImageGallery = (props) => {
    const data = props.images;

    const renderGallery = () => {
        const rows = [];
        for (let i = 0; i < data.length; i += 3) {
            const rowItems = data.slice(i, i + 3).map((item, index) => (
                <div key={item.id} className="col-6 p-1">
                    <Item
                        original={`/build/images/gallery/${item.shortCode}.jpg`}
                        thumbnail={`/build/images/gallery/${item.shortCode}.jpg`}
                        width={item.width}
                        height={item.height}
                        key={item.id}
                        alt={item.caption}
                    >
                        {({ ref, open }) => (
                            <div className="img-container custom-height-gallery position-relative overflow-hidden"
                                 ref={ref}
                                 onClick={open}
                            >
                                <img
                                    className={'img-fluid insta-img'}
                                    src={`/build/images/gallery/${item.shortCode}.jpg`}
                                    alt=""
                                    style={{objectFit: 'cover', width: '100%', height: '100%'}}
                                />
                                <div className="img-overlay">
                                    <p className="caption m-3">{item.caption}</p>
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
                {renderGallery()}
            </Gallery>
        </>
    );

};

export default ImageGallery;
