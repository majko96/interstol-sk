import React, {useState} from 'react';
import {Formik} from 'formik';
import {Rating} from "react-simple-star-rating";

const ReferenceForm = () => {
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (values) => {
        setIsSending(true);
        const url = '/api/send-reference';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                setIsSending(false);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Email sent successfully:', data);
            setIsSending(false);
            setIsEmailSent(true);
            window.location.href = '/recenzie';
        } catch (error) {
            setIsSending(false);
            console.error('There was an error sending the email:', error.message);
        }
    };

    return (
        <div>
            &nbsp;
            <Formik
                initialValues={{ name: '', surname: '', message: '', rating: ''}}
                validate={values => {
                    const errors = {};
                    if (!values.message) {
                        errors.message = 'Vyplňte prosím Recenziu';
                    }
                    if (!values.name) {
                        errors.name = 'Vyplňte prosím Meno';
                    }
                    if (!values.surname) {
                        errors.surname = 'Vyplňte prosím Priezvisko';
                    }
                    if (!values.rating) {
                        errors.rating = 'Vyplňte prosím Hodnotenie';
                    }
                    return errors;
                }}

                onSubmit={(values, { setSubmitting }) => {
                    handleSubmit(values);
                    setSubmitting(false);
                }}
            >
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      setFieldValue,
                      isSubmitting,
                  }) => (
                    <form onSubmit={handleSubmit}>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder='Meno*'
                                    className='form-control'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                />
                                <div className="invalid-data">
                                    {errors.name && touched.name && errors.name}
                                </div>
                            </div>
                            <div className='col-md-6 mb-3'>
                                <input
                                    type="text"
                                    name="surname"
                                    placeholder='Priezvisko*'
                                    className='form-control'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.surname}
                                />
                                <div className="invalid-data">
                                    {errors.surname && touched.surname && errors.surname}
                                </div>
                            </div>
                            <div className='col-md-12 mb-3'>
                                <Rating
                                    initialValue={0}
                                    name={'rating'}
                                    onClick={async e => {
                                        await setFieldValue("rating", e);
                                    }}
                                    onBlur={handleBlur}
                                    value={values.rating}
                                />
                                <div className="invalid-data">
                                    {errors.rating && touched.rating && errors.rating}
                                </div>
                            </div>
                            <div className='col-md-12'>
                            <textarea
                                name="message"
                                placeholder='Text recenzie*'
                                rows={5}
                                className='form-control'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.message}
                                maxLength={1024}
                            />
                                <div className="invalid-data">
                                    {errors.message && touched.message && errors.message}
                                </div>
                            </div>
                        </div>
                        {errors.message && touched.message}
                        {errors.surname && touched.surname}
                        {errors.message && touched.message}
                        {isEmailSent &&
                            <div className="alert alert-success mt-3 mb-3" role="alert">
                                <b>Ďakujeme Vám za vašu recenziu.</b>
                            </div>
                        }
                        <div className='send-button-div mt-3 text-center'>
                            {!isEmailSent &&
                                <button className='btn btn-secondary send-button' type="submit" disabled={isSending}>
                                    {isSending &&
                                        <>
                                            Odosielam...
                                        </>
                                    }
                                    {!isSending &&
                                        <>
                                            Odoslať
                                        </>
                                    }
                                </button>
                            }
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default ReferenceForm;
