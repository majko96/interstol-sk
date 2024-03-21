import React from 'react';
import 'photoswipe/dist/photoswipe.css'
import { Gallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css'
import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin'

const FittingsGallery = () => {
    const renderGallery = () => {
        const rows = [];
        return (
            <>
                <div className={'row'}>
                    <div key={1} className="col-12 col-md-6">
                        <Item
                            original={`/build/images/gallery/blum1.jpg`}
                            thumbnail={`/build/images/gallery/blum1.jpg`}
                            width={920}
                            height={700}
                            key={1}
                            alt={'Aventos HF top - dvojdielne čelo sa pri otváraní skladá v strede'}
                        >
                            {({ref, open}) => (
                                <img
                                    className="img-fluid radius-30"
                                    src={`/build/images/gallery/blum1.jpg`}
                                    alt="blum1"
                                    style={{objectFit: 'cover', width: '100%', height: '100%'}}
                                    ref={ref}
                                    onClick={open}
                                />
                            )}
                        </Item>
                    </div>
                    <div
                        className="col-12 col-md-6 about-us pt-0 d-flex
                        text-center justify-content-center align-items-center"
                    >
                        Aventos HF top - dvojdielne čelo<br/>sa pri otváraní skladá v strede
                    </div>
                </div>
                <div className={'row mt-5'}>
                    <div
                        className="col-12 col-md-6 about-us pt-0 d-flex
                        text-center justify-content-center align-items-center order-lg-1 order-2"
                    >
                        Aventos HS top - jednodielne čelo<br/>sa vyklápa nad korpus
                    </div>
                    <div key={2} className="col-12 col-md-6 order-lg-2 order-1">
                        <Item
                            original={`/build/images/gallery/blum2.jpg`}
                            thumbnail={`/build/images/gallery/blum2.jpg`}
                            width={920}
                            height={700}
                            key={1}
                            alt={'Aventos HS top - jednodielne čelo sa vyklápa nad korpus'}
                        >
                            {({ref, open}) => (
                                <img
                                    className="img-fluid radius-30"
                                    src={`/build/images/gallery/blum2.jpg`}
                                    alt="blum2"
                                    style={{objectFit: 'cover', width: '100%', height: '100%'}}
                                    ref={ref}
                                    onClick={open}
                                />
                            )}
                        </Item>
                    </div>
                </div>
                <div className={'row mt-5'}>
                    <div key={3} className="col-12 col-md-6">
                        <Item
                            original={`/build/images/gallery/blum3.jpg`}
                            thumbnail={`/build/images/gallery/blum3.jpg`}
                            width={920}
                            height={700}
                            key={1}
                            alt={'Aventos HL top - jednodielne čelo sa pohybuje paralelne nahor'}
                        >
                            {({ref, open}) => (
                                <img
                                    className="img-fluid radius-30"
                                    src={`/build/images/gallery/blum3.jpg`}
                                    alt="blum3"
                                    style={{objectFit: 'cover', width: '100%', height: '100%'}}
                                    ref={ref}
                                    onClick={open}
                                />
                            )}
                        </Item>
                    </div>
                    <div
                        className="col-12 col-md-6 about-us pt-0 d-flex
                        text-center justify-content-center align-items-center"
                    >
                        Aventos HL top - jednodielne čelo<br/> sa pohybuje paralelne nahor
                    </div>
                </div>
                <div className={'row mt-5'}>
                    <div
                        className="col-12 col-md-6 about-us pt-0 d-flex
                        text-center justify-content-center align-items-center order-lg-1 order-2"
                    >
                        Aventos HK top - decentné kovanie<br/> pre malé a veľké výklopy
                    </div>
                    <div key={4} className="col-12 col-md-6 order-lg-2 order-1">
                        <Item
                            original={`/build/images/gallery/blum4.jpg`}
                            thumbnail={`/build/images/gallery/blum4.jpg`}
                            width={920}
                            height={700}
                            key={1}
                            alt={'Aventos HK top - decentné kovanie pre malé a veľké výklopy'}
                        >
                            {({ref, open}) => (
                                <img
                                    className="img-fluid radius-30"
                                    src={`/build/images/gallery/blum4.jpg`}
                                    alt="blum4"
                                    style={{objectFit: 'cover', width: '100%', height: '100%'}}
                                    ref={ref}
                                    onClick={open}
                                />
                            )}
                        </Item>
                    </div>
                </div>
                <div className={'row mt-5'}>
                    <div key={5} className="col-12 col-md-6">
                        <Item
                            original={`/build/images/gallery/blum5.jpg`}
                            thumbnail={`/build/images/gallery/blum5.jpg`}
                            width={920}
                            height={700}
                            key={1}
                            alt={'Aventos HK-S - komfort obsluhy s malými rozmermi a ľahkými výklopmi'}
                        >
                            {({ref, open}) => (
                                <img
                                    className="img-fluid radius-30"
                                    src={`/build/images/gallery/blum5.jpg`}
                                    alt="blum5"
                                    style={{objectFit: 'cover', width: '100%', height: '100%'}}
                                    ref={ref}
                                    onClick={open}
                                />
                            )}
                        </Item>
                    </div>
                    <div
                        className="col-12 col-md-6 about-us pt-0 d-flex
                        text-center justify-content-center align-items-center"
                    >
                        Aventos HK-S - komfort obsluhy<br/> s malými rozmermi a ľahkými výklopmi
                    </div>
                </div>
            </>
        )
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

export default FittingsGallery;
