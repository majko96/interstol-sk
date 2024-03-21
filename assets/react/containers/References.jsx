import React, {useEffect, useState} from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {Rating} from 'react-simple-star-rating'
import Modal from 'react-modal';
import ReferenceForm from "./ReferenceForm";

Modal.setAppElement('#root');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#262626',
        maxWidth: '600px',
        borderRadius: '30px'
    },
    overlay: {
        position: 'fixed',
        zIndex: 1100,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

const References = () => {
    const [arrow, setArrow] = useState(true);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    const MAX_RETRIES = 5;
    const RETRY_DELAY = 2000; // 2 seconds

    const getReferences = async (retryCount = 0) => {
        const url = '/api/references';
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            console.log(error);
            if (retryCount < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return getReferences(retryCount + 1);
            } else {
                throw error;
            }
        }
    }

    useEffect(() => {
        getReferences().then(data => {
            setData(data);
        }).catch(error => {
            setError(true);
        });
    }, []);

    const renderLoading = () => {
        return (
            <div className="white-loader"></div>
        )
    }

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        if (window.innerWidth <= 700) {
            setArrow(false);
        }
    }, []);

    const renderModal = () => {
        return(
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <div className={'d-flex justify-content-between'}>
                    <h2>Napíšte nám recenziu</h2>
                    <span onClick={closeModal}><i className="fa-regular fa-circle-xmark fa-2xl"></i></span>
                </div>
                <ReferenceForm/>
            </Modal>
        )
    }

    const renderReferences = (items) => {
        return items.map((item, index) => (
            <div key={index} className="pe-4 ps-4 pb-4 ">
                <div className="mb-3">
                    <Rating
                        initialValue={item.hodnotenie}
                        readonly={true}
                    />
                </div>
                <p>{item.recenzia}</p>
                <b>{item.meno}</b>
            </div>
        ));
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 15000,
        arrows: arrow,
    };

    if (error) {
        return (
            <div className="about-us">
                Prepáčte, niečo sa pokazilo...
            </div>
        )
    }

    if (!data) return (
        <div className={'p-4'}>{renderLoading()}</div>
    );

    return (
        <div className="slider-container pb-5">
            {renderModal()}
            <Slider {...settings}>
                {renderReferences(data)}
            </Slider>
            <div className={'pt-5 mt-3'}>
                <button
                    className='btn btn-secondary send-button'
                    type="submit"
                    onClick={openModal}
                >
                    Pridať recenziu
                </button>
            </div>
        </div>
    );
};

export default References;
