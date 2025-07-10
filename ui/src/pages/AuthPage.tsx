import React from 'react';
import { Box, Button, TextField, Typography, Paper, Grid, Link } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

type AuthMode = 'login' | 'signup';

type AuthFormInputs = {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

const AuthPage: React.FC<{ mode?: AuthMode }> = ({ mode = 'login' }) => {
  const [authMode, setAuthMode] = React.useState<AuthMode>(mode);
  const navigate = useNavigate();
  const { login, signup, error, loading, token } = useAuthStore();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<AuthFormInputs>();

  const password = watch('password');

  React.useEffect(() => {
    if (token) {
      navigate('/'); // Redirect on successful login/signup
    }
  }, [token, navigate]);

  const onSubmit: SubmitHandler<AuthFormInputs> = async (data) => {
    if (authMode === 'login') {
      await login(data.email, data.password);
    } else {
      if (data.password !== data.confirmPassword) {
        alert("Passwords don't match");
        return;
      }
      await signup(data.fullName!, data.email, data.password);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
      <Grid size={{ xs: 10, sm:6, md:4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" mb={3}>
            {authMode === 'login' ? 'Login' : 'Sign Up'}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {authMode === 'signup' && (
              <TextField
                label="Full Name"
                fullWidth
                margin="normal"
                {...register('fullName', { required: 'Full name is required' })}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
              />
            )}

            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Enter a valid email',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register('password', { required: 'Password is required', minLength: 6 })}
              error={!!errors.password}
              helperText={errors.password && "Password must be at least 6 characters"}
            />

            {authMode === 'signup' && (
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                  validate: value => value === password || "Passwords do not match"
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            )}

            {error && <Typography color="error" mt={2}>{error}</Typography>}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {authMode === 'login' ? 'Login' : 'Sign Up'}
            </Button>
          </form>

          <Box mt={2} textAlign="center">
            <Link
              component="button"
              variant="body2"
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            >
              {authMode === 'login'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Login'}
            </Link>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AuthPage;