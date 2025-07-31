import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().required('Email is required').email('Invalid email'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  role: Yup.string().required('Role is required'),
});

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = async (values: { username: string; email: string; password: string; role: string }) => {
  try {
    // Convert string to enum number
    const roleMap: Record<string, number> = {
      admin: 1,
      manager: 2,
      staff: 3,
    };

    const payload = {
      username: values.username,
      email: values.email,
      password: values.password,
      role: roleMap[values.role.toLowerCase()], // convert to enum value
    };

    await API.post('/auth/register', payload);
    alert('Registration successful');
    navigate('/login');
  } catch (err) {
    console.error('Registration failed:', err);
    alert('Registration failed');
  }
};


  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: '400px' }}>
        <div className="text-center mb-3">
          <img src="/actingoffice-logo.jpg" alt="Logo" height="50" />
        </div>

        <Formik
          initialValues={{  username: '',email: '', password: '', confirmPassword: '', role: '' }}
          validationSchema={RegisterSchema}
          onSubmit={({ username, email, password, role }) => handleRegister({username, email, password, role })}
        >
          <Form>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <Field name="username" className="form-control" placeholder="Enter your username" />
              <ErrorMessage name="username" component="div" className="text-danger" />
            </div>

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

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <Field name="confirmPassword" type="password" className="form-control" placeholder="Confirm your password" />
              <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label className="form-label">Select Role</label>
              <Field as="select" name="role" className="form-control">
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary w-100">Register</button>
          </Form>
        </Formik>

        <div className="mt-3 text-center">
          <span>Already have an account? <Link to="/login">Login here</Link></span>
        </div>
      </div>
    </div>
  );
};

export default Register;