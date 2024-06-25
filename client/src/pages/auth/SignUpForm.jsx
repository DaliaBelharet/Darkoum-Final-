import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/Navbar'; 
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import avatarImage from '../../assets/Avatar6.png'; 
import illustrationImage from '../../assets/Houses-pana.png';

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

const SignUpForm = () => {
  const [nomComplet, setNomComplet] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [inscriptionReussie, setInscriptionReussie] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/register', {
        nomComplet,
        email,
        password,
        confirmPassword,
        phoneNumber,
      },
      {withCredentials: true});
      
      console.log('Réponse du serveur:', response.data);
      setInscriptionReussie(true); 
      navigate('/sign-in');
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Navbar sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }} />
      
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
            Inscrivez-vous
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
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
              <Avatar sx={{ m: 1,  marginLeft:"150px"}} src={avatarImage} alt="Avatar" />
             
              {inscriptionReussie && (
                <Typography variant="body1" color="primary" align="center" sx={{ mt: 2 }}>
                  Inscription réussie. Vous pouvez vous connecter pour accéder à votre compte.
                </Typography>
              )}
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="nomComplet"
                      required
                      fullWidth
                      id="nomComplet"
                      label="Nom Complet"
                      autoFocus
                      value={nomComplet}
                      onChange={(e) => setNomComplet(e.target.value)}
                      sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                    />
                  </Grid>
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
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirmer le mot de passe"
                      type="password"
                      id="confirmPassword"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="phoneNumber"
                      label="Numéro de téléphone"
                      type="tel"
                      id="phoneNumber"
                      autoComplete="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox value="agreeToTerms" color="primary" />}
                      label="J'accepte les conditions générales et la politique de confidentialité"
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
                  S'inscrire
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                  <Link href="/sign-in" variant="body2" sx={{ color: 'black', fontWeight: 'bold', fontSize: '1rem' }}>
  {"Vous avez déjà un compte ? Connectez-vous"}
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
                marginLeft: 4,
              }}
            >
              <img src={illustrationImage} alt="Illustration" style={{ width: '100%', borderRadius: '16px' }} />
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUpForm;