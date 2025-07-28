import React, {useState} from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

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

    return (
        <>
            {renderModal()}

                <button
                    className='btn btn-secondary send-button'
                    type="submit"
                    onClick={openModal}
                ><i className="fas fa-plus me-3"></i>
                    Pridať recenziu
                </button>
        </>
    );
};

export default References;