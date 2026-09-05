import { useRef, useState } from 'react';
import { postData } from '../../../mocks/CallingAPI.js';
import CheckValidation from './CheckValidation.jsx';

import './RegisterFace.css';

export default function RegisterFace({
    setRotate = () => { },
}) {
    console.log('Register');
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const ResetRegisterInputs = () => {
        var inputs = document.querySelectorAll('input');
        inputs.forEach(function (input) {
            input.value = '';
        });
        setAccept(false);
        setRegisterError({ value: '', name: '' });
        setRegisterSuccess('');
    };

    const [loading, setLoading] = useState(false);
    const [accept, setAccept] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [registerError, setRegisterError] = useState({ value: '', name: '' });
    const [registerSuccess, setRegisterSuccess] = useState(null);
    const [otpError, setOtpError] = useState({ value: '', name: '' });
    const [otpSuccess, setOtpSuccess] = useState(null);
    const [successSendOTP, setSuccessSendOTP] = useState(false);

    const CheckOTP = async (Email, OTP) => {
        setOtpError({ value: '', name: '' });
        setOtpSuccess('');

        const CheckOtpData = {
            email: Email,
            otp: OTP,
        };
        console.log('CheckOtpData:', CheckOtpData);

        try {
            setLoading(true);
            const result = await postData('auth/register-confirm', CheckOtpData, '');
            console.log('result', result);
            await sleep(1000);

            setOtpSuccess('Đăng ký thành công!');
            setOtpError({ value: '', name: '' });
            await sleep(1000);
            setSuccessSendOTP(false);
            setRotate(0);
        } catch (error) {
            console.log('Check OTP failed:', error);
            setOtpError({ value: 'OTP không chính xác', name: 'OTP' });
            setOtpSuccess('');
        } finally {
            setLoading(false);
        };
    };

    const Register = async (Email, Name, Phone, Gender, Password, Confirm, Accept) => {
        const Validate = CheckValidation(Email, Name, Phone, Gender, Password, Confirm, Accept);
        console.log('Validate: ', Validate);
        if (Validate.value != 'OK') {
            console.log('Validation is false');
            setRegisterError(Validate);
            setRegisterSuccess('');
            return;
        }

        const RegisterData = {
            email: Email,
            password: Password,
            name: Name,
            phone: Phone,
            gender: Gender,
            avatar: 'https://i.pinimg.com/736x/af/59/b3/af59b36b88bdbea5172a618872f3bbc5.jpg',
            roleId: '67b62c82-e459-4b1a-b912-e1758a5c87c4',
        };
        console.log('RegisterData:', RegisterData);

        try {
            setLoading(true);
            const result = await postData('auth/register-request', RegisterData, '');
            console.log('result', result);
            await sleep(1000);

            setRegisterSuccess('Đã gửi OTP đến gmail của bạn!');
            setRegisterError({ value: '', name: '' });
            await sleep(1000);
            setSuccessSendOTP(true);
        } catch (error) {
            console.log('Register failed:', error);
            setRegisterError({ value: 'Gửi OTP thất bại, hãy thử lại sau', name: 'Email, Name, Phone, Password, Confirm, Accept' });
            setRegisterSuccess('');
        } finally {
            setLoading(false);
        };
    };

    const handleSubmitRegister = (e) => {
        e.preventDefault();
        setRegisterError({ value: '', name: '' });
        setRegisterSuccess('');
        setOtpError({ value: '', name: '' });
        setOtpSuccess('');
        const Email = e.target.email.value;
        const Name = e.target.name.value;
        const Phone = e.target.phone.value;
        const Gender = e.target.gender.value;
        const Password = e.target.password.value;
        const Confirm = e.target.confirm.value;
        console.log({
            Email,
            Name,
            Phone,
            Gender,
            Password,
            Confirm,
            accept,
        });
        Register(
            Email,
            Name,
            Phone,
            Gender,
            Password,
            Confirm,
            accept,
        );
    };

    const handleAccept = () => {
        setAccept(p => !p);
    };



    // OTP
    const inputsRef = useRef([]);
    const refEmail = useRef(null);

    const handleChange = (e, index) => {
        const value = e.target.value;

        // Chỉ cho nhập số
        if (!/^[0-9]?$/.test(value)) return;

        e.target.value = value;

        // Tự động chuyển sang ô tiếp theo
        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Backspace quay lại ô trước
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

    return (
        <div className='register-face-container'>
            <h1>ĐĂNG KÝ</h1>
            <form onSubmit={handleSubmitRegister}>
                <div className='form-group'>
                    <input type='text' name='email' placeholder='' ref={refEmail} />
                    <label htmlFor={'email'} style={{ color: registerError.name.includes('Email') && '#ff4d4f', }}>Email</label>
                </div>
                <div className='form-group'>
                    <input type='text' name='name' placeholder='' />
                    <label htmlFor={'name'} style={{ color: registerError.name.includes('Name') && '#ff4d4f', }}>Họ tên</label>
                </div>
                <div className='form-group'>
                    <input type='text' name='phone' placeholder='' />
                    <label htmlFor={'phone'} style={{ color: registerError.name.includes('Phone') && '#ff4d4f', }}>Số điện thoại</label>
                </div>
                <div className='gender-group'>
                    {['Nam', 'Nữ'].map((gender, index) => (
                        <label key={index} className='radio-label' style={{ border: registerError.name.includes('Gender') && '2px solid #ff4d4f', }} >
                            <input
                                type='radio'
                                name='gender'
                                value={gender}
                                className='hidden-radio'
                            />
                            <span className='radio-box'>{gender}</span>
                        </label>
                    ))}
                </div>
                <div className='form-group'>
                    <input type='password' name='password' placeholder='' />
                    <label htmlFor={'password'} style={{ color: registerError.name.includes('Password') && '#ff4d4f', }}>Mật khẩu</label>
                </div>
                <div className='form-group'>
                    <input type={passwordVisible ? 'text' : 'password'} name='confirm' placeholder='' />
                    <label htmlFor={'confirm'} style={{ color: registerError.name.includes('Confirm') && '#ff4d4f', }}>Xác nhận mật khẩu</label>
                    <i className={`fa-solid fa-${passwordVisible ? 'eye-slash' : 'eye'} eye-btn`} onClick={() => setPasswordVisible(p => !p)} />
                </div>
                <div className='form-check'>
                    <a href='https://docs.google.com/document/d/1UiDYYRMq2Ty5SJgOJQnF78aIiI11_Z2X/edit' className='provision' target='_blank'><b>ĐIỀU KHOẢN</b></a>

                    <div className='checkbox-container'>
                        <label style={{ borderBottom: (registerError.name.includes('Accept') && !accept) && '1px solid #ff4d4f', color: (registerError.name.includes('Accept') && !accept) && '#ff4d4f', }}>
                            <input type='checkbox' checked={accept} onChange={handleAccept} />
                            Chấp nhận điều khoản
                        </label>
                    </div>
                </div>

                {registerError.value && <div className='message error-message'>{registerError.value}</div>}
                {registerSuccess && <div className='message success-message'>{registerSuccess}</div>}
                {!registerError.value && !registerSuccess && <div className='message'></div>}

                <div className='btn-box'>
                    <button type='submit' className='btn-submit' disabled={!accept || loading}>
                        {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ'}
                    </button>
                    <button type='reset' className='btn-reset' onClick={ResetRegisterInputs}>XÓA</button>
                </div>
            </form>

            <div className='link-box'>
                <div className=''>Đã có tài khoản?</div>
                <div className='link' onClick={() => setRotate(0)}>Đăng nhập ngay!</div>
            </div>

            {successSendOTP &&
                <div className='form-otp'>
                    <div className='otp-container' onPaste={handlePaste}>
                        <button onClick={() => setSuccessSendOTP(false)} className='close-otp' disabled={loading}>
                            <i className='fa-solid fa-arrow-left' />
                            <span>Quay lại</span>
                        </button>

                        <h2>XÁC THỰC OTP</h2>
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

                        {otpError.value && <div className='message error-message'>{otpError.value}</div>}
                        {otpSuccess && <div className='message success-message'>{otpSuccess}</div>}
                        {!otpError.value && !otpSuccess && <div className='message'></div>}

                        <button
                            className='submit-btn'
                            onClick={() => {
                                const email = refEmail.current.value;
                                const otp = inputsRef.current.map((input) => input.value).join('');
                                CheckOTP(email, otp);
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Đang xác nhận...' : 'Xác nhận'}
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}
