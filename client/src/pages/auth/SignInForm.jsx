import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container'; 
import { FcGoogle } from 'react-icons/fc'; 
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/userSlice';
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import avatarImage from '../../assets/Avatar6.png'; 
import illustrationImage from '../../assets/computer.png';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#F27438',
    },
    secondary: {
      main: '#E64A19',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontWeightBold: 700,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: '80px',
          height: '80px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        },
      },
    },
  },
});

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      if (!email || !password) {
        setError("Veuillez remplir tous les champs.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        dispatch(loginSuccess(response.data));
        navigate("/home");
      } else {
        setError(response.data.errors[0].msg);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setError(error.response.data.errors[0].msg);
      } else {
        setError("Erreur lors de la connexion. Veuillez réessayer plus tard.");
      }
    }
  };

  const signInWithGoogle = async () => {
    if (loading) return;
    setLoading(true);
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post("http://localhost:5000/api/v1/auth/googleAuth", {
            nomComplet: result.user.displayName,
            email: result.user.email,
          }, {
            withCredentials: true
          })
          .then((res) => {
            dispatch(loginSuccess(res.data));
            navigate("/home");
          })
          .catch((error) => {
            dispatch(loginFailure());
          })
          .finally(() => {
            setLoading(false);
          });
      });
  };

  const handleForgotPassword = () => {
    navigate('/ResetPassword');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Navbar sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }} />

      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 9,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid #ccc',
            borderRadius: '16px',
            padding: '30px',
            background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography component="h1" variant="h4" fontWeight="bold" sx={{ color: '#333', marginBottom: 2 }}>
            Connexion
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                flex: 1,
              }}
            >
              <Avatar sx={{ m: 1, marginLeft:"150px"}} src={avatarImage} alt="Avatar" />
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Adresse Email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Mot de passe"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox value="remember" color="primary" />}
                      label="Se souvenir de moi"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'secondary.main',
                    },
                  }}
                >
                  Se connecter
                </Button>

                

                <div className="google-sign-in">
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 1,
                    mb: 2,
                    bgcolor: '#fff',
                    '&:hover': {
                      bgcolor: '#FFBF66',
                    },
                  }}
                  onClick={signInWithGoogle}
                  disabled={loading}
                >
                  Continuer avec Google <FcGoogle size={"25px"} style={{ marginLeft: '10px'  }} />
                </Button>
                  
                </div>

                <Grid container justifyContent="flex-end">
                  <Grid item xs>
                    <Link to="/ResetPassword" variant="body2" style={{ color: 'black' ,fontWeight :"bold", fontSize: '1rem'}} onClick={handleForgotPassword}>
                      Mot de passe oublié?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link to="/sign-up" variant="body2" style={{ color: 'black', fontWeight: 'bold' }}>
                      {"Vous n'avez pas de compte ? Inscrivez-vous"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box
              sx={{
                marginTop: "-120px",
                flex: 1,
                display: { xs: 'none', md: 'block' },
                marginRight: 4,
              }}
            >
              <img src={illustrationImage} alt="Illustration" style={{ width: '100%', borderRadius: '16px' }} />
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignInForm;
