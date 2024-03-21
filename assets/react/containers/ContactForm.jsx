import React, {useState} from 'react';
import {ErrorMessage, Field, Formik} from 'formik';
import { useDropzone } from 'react-dropzone';

const ImageUpload = ({ onFileUpload }) => {
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [error, setError] = useState(false);
    const maxSize = 2 * 1024 * 1024;
    const onDrop = (acceptedFiles) => {
        setError(false);
        const file = acceptedFiles[0];
        if (file.size > maxSize) {
            setError(true);
            return;
        }
        onFileUpload(file);
        setUploadedFileName(file.name);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div>
            <div {...getRootProps()} style={dropzoneStyles}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the image here...</p>
                ) : (
                    <span>Nahrať prílohu...</span>
                )}
            </div>
            {uploadedFileName && (
                <p style={{ marginTop: '10px' }}>Príloha: {uploadedFileName}</p>
            )}
            {error &&
                <p style={{marginTop: '10px', color: 'red'}}>Velkosť prílohy nesmie byť väčšia ako 2MB</p>
            }
        </div>
    );
};

const dropzoneStyles = {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
};

const ContactForm = () => {
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isSending, setIsSending] = useState(false);


    const handleSubmit = async (values) => {
        setIsSending(true);
        const url = '/api/send-message';

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('surname', values.surname);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('message', values.message);
        formData.append('subject', values.subject);
        formData.append('image', values.image);
    
        try {
          const response = await fetch(url, {
            method: 'POST',
            body: formData,
          });
    
          if (!response.ok) {
              setIsSending(false);
              throw new Error('Network response was not ok');
          }
    
          const data = await response.json();
          setIsEmailSent(true);
          setIsSending(false);
        } catch (error) {
            setIsSending(false);
            console.error('There was an error sending the email:', error.message);
        }
      };

    return (
        <div>
            <p className='fw-bold'>Neváhajte a kontaktujte nás.</p>
            &nbsp;
            <Formik
            initialValues={{ name: '', surname: '', email: '', phone: '', message: '', subject: '', image: null }}
            validate={values => {
                const errors = {};
                if (!values.email) {
                errors.email = 'Vyplňte prosím E-mail';
                } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                errors.email = 'Nesprávny tvar e-mailovej adresy';
                }
                if (!values.message) {
                    errors.message = 'Vyplňte prosím Správu';
                }
                if (!values.name) {
                    errors.name = 'Vyplňte prosím Meno';
                }
                if (!values.surname) {
                    errors.surname = 'Vyplňte prosím Priezvisko';
                }
                if (!values.phone) {
                    errors.phone = 'Vyplňte prosím Telefón';
                }
                if (!values.subject) {
                    errors.subject = 'Vyplňte prosím Predmet';
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
                /* and other goodies */
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
                        <div className='col-md-6 mb-3'>
                            <input
                                type="email"
                                name="email"
                                placeholder='E-mail*'
                                className='form-control'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                            />
                            <div className="invalid-data">
                                {errors.email && touched.email && errors.email}
                            </div>
                        </div>
                        <div className='col-md-6 mb-3'>
                            <input
                                type="text"
                                name="phone"
                                placeholder='Telefón*'
                                className='form-control'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.phone}
                            />
                            <div className="invalid-data">
                                {errors.phone && touched.phone && errors.phone}
                            </div>
                        </div>
                        <div className='col-md-12 mb-3'>
                            <input
                                type="text"
                                name="subject"
                                placeholder='S čím Vám môžeme pomôcť?*'
                                className='form-control'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.subject}
                            />
                            <div className="invalid-data">
                                {errors.subject && touched.subject && errors.subject}
                            </div>
                        </div>
                        <div className='col-md-12 mb-3'>
                            <textarea
                                name="message"
                                placeholder='Správa*'
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
                        <div className='col-md-12'>
                            <Field name="image">
                                {({ field }) => (
                                    <ImageUpload
                                        onFileUpload={(file) => setFieldValue('image', file)}
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="image" component="div" />
                        </div>
                    </div>
                    {errors.message && touched.message}
                    {errors.surname && touched.surname}
                    {errors.message && touched.message}
                    <div className='mt-3 mb-3'>
                        <small>Kópia správy bude odoslaná na Váš e-mail.</small>
                    </div>
                    {isEmailSent &&
                        <div className="alert alert-success mt-3 mb-3" role="alert">
                            <b>Email bol úspešne odoslaný.</b>
                        </div>
                    }
                    <div className='send-button-div d-flex pl-3'>
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

export default ContactForm;
