import React from 'react';
import 'photoswipe/dist/photoswipe.css'
import { Gallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css'
import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin'

const DrawersGallery = () => {
    const renderGallery = () => {
        const rows = [];
        return (
            <>
                <div className={'row mt-5'}>
                    <div
                        className="col-12 col-md-6 about-us p-0 d-flex flex-column
                        text-center justify-content-center align-items-center order-lg-1 order-2"
                    >
                        <div className="text-center mb-3">
                            Merivobox - systém vedenia v tvare písmena L<br/> pre vysokú flexibilitu a mimoriadnu stabilitu
                        </div>
                        <div className="align-self-center">
                            <a
                                className="btn btn-secondary send-button"
                                href="https://www.jafholz.sk/znacky/blum/merivobox"
                                target="_blank"
                            >
                                Detail
                            </a>
                        </div>
                    </div>
                    <div key={2} className="col-12 col-md-6 order-lg-2 order-1">
                        <Item
                            original={`/build/images/gallery/merivobox.jpg`}
                            thumbnail={`/build/images/gallery/merivobox.jpg`}
                            width={555}
                            height={444}
                            key={1}
                            alt={'Merivobox - systém vedenia v tvare písmena L pre vysokú flexibilitu a mimoriadnu stabilitu'}
                        >
                            {({ref, open}) => (
                                <img
                                    className="img-fluid radius-30"
                                    src={`/build/images/gallery/merivobox.jpg`}
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
                            original={`/build/images/gallery/legrabox.jpg`}
                            thumbnail={`/build/images/gallery/legrabox.jpg`}
                            width={555}
                            height={444}
                            key={1}
                            alt={'Legrabox - systém vedení s plochou konštrukciou pre maximálne dizajnové nároky'}
                        >
                            {({ref, open}) => (
                                <img
                                    className="img-fluid radius-30"
                                    src={`/build/images/gallery/legrabox.jpg`}
                                    alt="blum3"
                                    style={{objectFit: 'cover', width: '100%', height: '100%'}}
                                    ref={ref}
                                    onClick={open}
                                />
                            )}
                        </Item>
                    </div>
                    <div
                        className="col-12 col-md-6 about-us p-0 d-flex flex-column
                        text-center justify-content-center align-items-center"
                    >
                        <div className="text-center mb-3">
                            Legrabox - systém vedení s plochou konštrukciou<br/> pre maximálne dizajnové nároky
                        </div>
                        <div className="align-self-center">
                            <a
                                className="btn btn-secondary send-button"
                                href="https://www.jafholz.sk/znacky/blum/mylegrabox"
                                target="_blank"
                            >
                                Detail
                            </a>
                        </div>
                    </div>
                </div>
                <div className={'row mt-5'}>
                    <div
                        className="col-12 col-md-6 about-us p-0 d-flex flex-column
                        text-center justify-content-center align-items-center order-lg-1 order-2"
                    >
                        <div className="text-center mb-3">
                            Tandembox - systém vedení s vysokou konštrukciou<br/> pre efektívne riešenia
                        </div>
                        <div className="align-self-center">
                            <a
                                className="btn btn-secondary send-button"
                                href="https://www.jafholz.sk/znacky/blum/tandembox-antaro"
                                target="_blank"
                            >
                                Detail
                            </a>
                        </div>
                    </div>
                    <div key={4} className="col-12 col-md-6 order-lg-2 order-1">
                        <Item
                            original={`/build/images/gallery/tandembox.webp`}
                            thumbnail={`/build/images/gallery/tandembox.webp`}
                            width={555}
                            height={444}
                            key={1}
                            alt={'Tandembox - systém vedení s vysokou konštrukciou pre efektívne riešenia'}
                        >
                            {({ref, open}) => (
                                <img
                                    className="img-fluid radius-30"
                                    src={`/build/images/gallery/tandembox.webp`}
                                    alt="blum4"
                                    style={{objectFit: 'cover', width: '100%', height: '100%'}}
                                    ref={ref}
                                    onClick={open}
                                />
                            )}
                        </Item>
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

export default DrawersGallery;
