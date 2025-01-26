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

const References = (props) => {
    const [arrow, setArrow] = useState(true);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

        fetch('/api/reviews')
            .then(response => response.json())
            .then(data => {
                setReviews(data);
                setIsLoading(false)
            })
            .catch(error => {
                console.error("There was an error fetching the reviews!", error);
            });
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
            <div key={index} className="pe-4 ps-4 pb-4">
                <div>
                    <b>{item.author_name}</b>
                </div>
                <div className="mb-3 mt-3">
                    <Rating
                        initialValue={parseInt(item.rating)}
                        readonly={true}
                    />
                </div>
                <p>{item.text}</p>
                <p style={{ fontSize: '12px', color: '#aaa' }}>
                    {item.time}
                </p>
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

    const renderLoading = () => {
        return (
            <div className="white-loader"></div>
        )
    }

    if (isLoading) return (
        <div className={'p-5'}>
            {renderLoading()}
        </div>
    );

    return (
        <div className="slider-container pb-5">
            {renderModal()}
            <Slider {...settings}>
                {renderReferences(reviews)}
            </Slider>
            <div className={'pt-5 mt-3'}>
                <a
                    href={'https://search.google.com/local/writereview?placeid=' + props.place_id}
                    target={'_blank'}
                    className='btn btn-secondary send-button'
                >
                    Pridať recenziu
                </a>
            </div>
        </div>
    );
};

export default References;
