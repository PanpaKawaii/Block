import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { postData } from '../../../../mocks/CallingAPI';
import MovingLabelInput from '../../../components/MovingLabelInput/MovingLabelInput';
import StarsBackground from '../../../components/StarsBackground/StarsBackground';

import './ForgetPassword.css';

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState(0);
    const titles = [
        { h: 'Tìm tài khoản của bạn', p: 'Hãy nhập email của bạn.', },
        { h: 'Xác nhận tài khoản', p: `Chúng tôi đã gửi mã OTP đến email '${email}' của bạn. Hãy nhập mã đó để xác nhận tài khoản.` },
        { h: 'Tạo mật khẩu mới', p: 'Bạn sẽ dùng mật khẩu mới này để đăng nhập vào tài khoản. Hãy sử dụng tối thiểu 6 ký tự.', },
    ];

    const SearchEmail = async () => {
        if (!email) {
            setError({ message: 'Email không hợp lệ hoặc không tồn tại.' });
            return;
        }

        const ForgotPasswordData = {
            email: email,
        };
        console.log('ForgotPasswordData:', ForgotPasswordData);

        try {
            setLoading(true);
            const result = await postData('auth/forgot-password', ForgotPasswordData, '');
            console.log('result', result);
            setStep(p => Math.min(3, p + 1));
        } catch (error) {
            console.error('Error', error);
            setError({ message: 'Email không hợp lệ hoặc không tồn tại.' });
        } finally {
            setLoading(false);
        };
    };

    const CheckOTP = async (OTP) => {
        if (!email || !OTP) {
            setError({ message: 'Mã OTP không hợp lệ.' });
            return;
        }

        const VerifyOtpData = {
            email: email,
            otp: OTP,
        };
        console.log('VerifyOtpData:', VerifyOtpData);

        try {
            setLoading(true);
            const result = await postData('auth/verify-otp', VerifyOtpData, '');
            console.log('result', result);
            setStep(p => Math.min(3, p + 1));
        } catch (error) {
            console.error('Error', error);
            setError({ message: 'Mã OTP không hợp lệ.' });
        } finally {
            setLoading(false);
        };
    };

    const ResetPassword = async () => {
        if (!email) {
            setError({ message: 'Email không hợp lệ.' });
            return;
        } else if (!password) {
            setError({ message: 'Mật khẩu mới không hợp lệ.' });
            return;
        } else if (password?.length < 6) {
            setError({ message: 'Mật khẩu phải chứa ít nhất 6 ký tự.' });
            return;
        }

        const ResetPasswordData = {
            email: email,
            newPassword: password,
        };
        console.log('ResetPasswordData:', ResetPasswordData);

        try {
            setLoading(true);
            const result = await postData('auth/reset-password', ResetPasswordData, '');
            console.log('result', result);
            setStep(p => Math.min(3, p + 1));
        } catch (error) {
            console.error('Error', error);
            setError({ message: 'Email hoặc mật khẩu mới không hợp lệ.' });
        } finally {
            setLoading(false);
        };
    };

    // OTP
    const inputsRef = useRef([]);
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return;
        e.target.value = value;
        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };
    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^[0-9]+$/.test(pasteData)) return;
        pasteData.split('').forEach((char, index) => {
            if (inputsRef.current[index]) {
                inputsRef.current[index].value = char;
            }
        });
        inputsRef.current[pasteData.length - 1]?.focus();
    };


    const handleBack = () => {
        setError(null);
        setStep(p => Math.max(0, p - 1));
    };

    const handleNext = (OTP) => {
        setError(null);
        step == 0 && SearchEmail();
        step == 1 && CheckOTP(OTP);
        step == 2 && ResetPassword();
    };

    return (
        <div className='forget-password-container'>
            <StarsBackground />
            <div className='container'>
                {/* <div>{step}</div> */}
                {step == 1 &&
                    <button className='btn back-btn' onClick={() => handleBack()}>
                        <i className='fa-solid fa-chevron-left' />
                    </button>
                }
                {/* <button className='btn back-btn' onClick={() => setStep(p => Math.max(0, p - 1))}>
                    <i className='fa-solid fa-xmark' />
                </button>
                <button className='btn back-btn' onClick={() => setStep(p => Math.min(3, p + 1))}>
                    <i className='fa-solid fa-check' />
                </button> */}
                <div className='form-container'>
                    <h1>{titles?.[step]?.h}</h1>
                    <p>{titles?.[step]?.p}</p>

                    {step == 0 &&
                        <div className='form-email'>
                            <div className='form-group'>
                                <MovingLabelInput
                                    type={'text'}
                                    value={email || ''}
                                    onValueChange={(propE) => setEmail(propE)}
                                    extraClassName={''}
                                    extraStyle={{}}
                                    label={'Email'}
                                    labelStyle={'left moving'}
                                />
                            </div>
                            <div className='message'>{error?.message}</div>
                            <button type='button' className='btn' onClick={() => handleNext('')} disabled={loading}>Kiểm tra email</button>
                        </div>
                    }

                    {step == 1 &&
                        <div className='form-otp' onPaste={handlePaste}>
                            <div className='otp-inputs'>
                                {[...Array(6)].map((_, index) => (
                                    <input
                                        key={index}
                                        type='text'
                                        maxLength='1'
                                        className='otp-input'
                                        ref={(el) => (inputsRef.current[index] = el)}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                    />
                                ))}
                            </div>

                            <div className='message'>{error?.message}</div>

                            <button
                                type='button'
                                className='btn'
                                onClick={() => {
                                    const otp = inputsRef.current.map((input) => input.value).join('');
                                    handleNext(otp);
                                }}
                                disabled={loading}
                            >
                                Kiểm tra mã OTP
                            </button>
                        </div>
                    }

                    {step == 2 &&
                        <div className='form-password'>
                            <div className='form-group'>
                                <MovingLabelInput
                                    type={'password'}
                                    value={password || ''}
                                    onValueChange={(propE) => setPassword(propE)}
                                    extraClassName={''}
                                    extraStyle={{}}
                                    label={'Password'}
                                    labelStyle={'left moving'}
                                />
                            </div>
                            <div className='message'>{error?.message}</div>
                            <button type='button' className='btn' onClick={() => handleNext('')} disabled={loading}>Đổi mật khẩu</button>
                        </div>
                    }

                    {step == 3 &&
                        <div className='form-success'>
                            <div className='icon-success'>✓</div>
                            <div className='success'>Đổi mật khẩu mới thành công</div>
                            <Link to='/' state={{ openLogin: 'true' }}>
                                <button type='button' className='btn'>Về trang chủ</button>
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
