import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postData } from '../../../mocks/CallingAPI.js';
import { useAuth } from '../../hooks/AuthContext/AuthContext.jsx';

import './LoginFace.css';

export default function LoginFace({
    setRotate = () => { },
    onClose = () => { },
}) {
    console.log('Login');
    const { login } = useAuth();
    const navigate = useNavigate();

    const ResetLoginInputs = () => {
        var inputs = document.querySelectorAll('input');
        inputs.forEach(function (input) {
            input.value = '';
        });
        setLoginError({ value: '', name: '' });
    };

    const [remember, setRemember] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState({ value: '', name: '' });

    const Login = async (Email, Password) => {
        if (!Email) {
            console.error('Invalid value');
            setLoginError({ value: 'Vui lòng nhập email', name: 'Email' });
            return;
        }
        if (!Password) {
            console.error('Invalid value');
            setLoginError({ value: 'Vui lòng nhập mật khẩu', name: 'Password' });
            return;
        }

        const LoginData = {
            email: Email,
            password: Password,
        };
        console.log('LoginData:', LoginData);

        try {
            setLoading(true);
            const loginQuery = new URLSearchParams(LoginData);
            const result = await postData(`auth/login?${loginQuery}`, LoginData, '');
            console.log('result', result);

            if (result?.user?.status == 0) {
                console.error('Tài khoản này đã bị vô hiệu hóa');
                setLoginError({ value: 'Tài khoản này đã bị vô hiệu hóa', name: 'Email, Password' });
                return;
            }

            login({ ...result?.user, token: result?.accessToken, refreshToken: result?.refreshToken });

            onClose(false);
            if (result.user.roleName == 'Guest' || result.user.roleName == 'Student') navigate('/profile');
            else if (result.user.roleName == 'Instructor') navigate('/instructor');
            else if (result.user.roleName == 'Admin') navigate('/admin');
        } catch (error) {
            console.error('Login failed:', error);
            setLoginError({ value: error?.data?.detail || 'Đăng nhập thất bại', name: 'Email, Password' });
        } finally {
            setLoading(false);
        };
    };

    const handleSubmitLogin = (e) => {
        e.preventDefault();
        setLoginError({ value: '', name: '' });
        const Email = e.target.email.value;
        const Password = e.target.password.value;
        console.log({ Email, Password });
        Login(Email, Password);
    };

    const handleRemember = () => {
        setRemember(p => !p);
    };

    return (
        <div className='login-face-container'>
            <h1>ĐĂNG NHẬP</h1>
            <form onSubmit={handleSubmitLogin}>
                <div className='form-group'>
                    <input type='text' name='email' placeholder='' />
                    <label htmlFor={'email'} style={{ color: loginError.name.includes('Email') && '#ff4d4f', }}>Email</label>
                </div>
                <div className='form-group'>
                    <input type={passwordVisible ? 'text' : 'password'} name='password' placeholder='' />
                    <label htmlFor={'password'} style={{ color: loginError.name.includes('Password') && '#ff4d4f', }}>Mật khẩu</label>
                    <i className={`fa-solid fa-${passwordVisible ? 'eye-slash' : 'eye'} eye-btn`} onClick={() => setPasswordVisible(p => !p)} />
                </div>
                <div className='form-check'>
                    <div className='checkbox-container'>
                        {/* <label>
                            <input type='checkbox' checked={remember} onChange={handleRemember} />
                            Lưu đăng nhập
                        </label> */}
                    </div>
                    <Link to='forget-password' state={{ openLogin: 'false' }} className='forget-link'>Quên mật khẩu?</Link>
                </div>

                {loginError && <div className='message error-message'>{loginError.value}</div>}
                {!loginError && <div className='message error-message'></div>}

                <div className='btn-box'>
                    <button type='submit' className='btn-submit' disabled={loading}>
                        {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
                    </button>
                    <button type='reset' className='btn-reset' onClick={ResetLoginInputs}>XÓA</button>
                </div>
            </form>
            <div className='other-method'>Hoặc</div>
            <div className='link-box'>
                <div>Chưa có tài khoản?</div>
                <div className='link' onClick={() => setRotate(-180)}>Đăng ký ngay!</div>
            </div>
        </div>
    )
}
