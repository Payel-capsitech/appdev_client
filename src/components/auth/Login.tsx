import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';

const LoginSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Invalid email'),
  password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await API.post('/auth/login', values);
      const token = response.data.token;
      localStorage.setItem('authToken', token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;

      const user = {
      role: payload.role,
      email: payload.email || '', 
    };

    // Save user in localStorage
    localStorage.setItem('user', JSON.stringify(user));

      if (role === 'admin') {
        navigate('/dashboard/admin');
      } else if (role === 'staff') {
        navigate('/dashboard/staff');
      } else if (role === 'manager') {
        navigate('/dashboard/manager');
      }

    } catch (err) {
      console.error('Login failed:', err);
      alert('Invalid email or password');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: '400px' }}>
        <div className="text-center mb-3">
          <img src="/actingoffice-logo.jpg" alt="Logo" height="50" />
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <Field name="email" className="form-control" placeholder="Enter your email" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <Field name="password" type="password" className="form-control" placeholder="Enter your password" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary w-100">Login</button>
          </Form>
        </Formik>

        <div className="mt-3 text-center">
          <span>Don't registered yet? <Link to="/register">Register here</Link></span>
        </div>
      </div>
    </div>
  );
};

export default Login;