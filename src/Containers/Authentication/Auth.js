import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {MuiThemeProvider} from "@material-ui/core";
import {Link} from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Form from "../../Components/Form/Form";
import Appstyle from "../../Components/Appbar/Appbar.module.css";
import logo from '../../assets/icons/logo.svg';
import FormCss from "../../Components/Form/Form.module.css";
import translations from '../../Translation.json'
import style from '../../Components/Form/Form.module.css';
import Aux from '../../hoc/Wrapper';
import Backdrop from "@material-ui/core/Backdrop";
import Modal from '../../Components/UI/Modal/Modal';
import Snackbar from '../../Components/UI/Snackbar/Snackbar';
import Alert from '@material-ui/lab/Alert';

const themeLight = createMuiTheme({
   palette: {
      background: {
         default: "#ffd600"
      }
   }
});
const useStyles = makeStyles((theme) => ({
   appBar: {
      // paddingRight: 0,
      // paddingLeft: 0,
      alignItems: 'center',
      backgroundColor: '#ffd600',
      marginLeft: -4,
      marginTop: 3,
      [theme.breakpoints.down(600)]: {
         marginLeft: 0,
      },
   },
   toolbar: {
      [theme.breakpoints.down(600)]: {
         marginTop: theme.spacing(5),
         marginBottom: theme.spacing(2)
      },
      paddingRight: 0,
      paddingLeft: 0,
      alignItems: 'center'
   },
   layout: {
      marginLeft: 10,
      marginRight: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
         width: 500,
         marginLeft: 'auto',
         marginRight: 'auto',
      },
      marginBottom: 100
   },
   paper: {
      padding: theme.spacing(2),
      // marginBottom: theme.spacing(-20),
      [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
         marginTop: theme.spacing(6),
         marginBottom: theme.spacing(6),
         padding: theme.spacing(3),
      },
      boxShadow: '0 0 0',
   },
   middle: {
      alignItems: 'center',
      verticalAlign: 'middle'
   },
   indicator: {
      backgroundColor: '#ffd600'
   },
   transform: {
      textTransform: 'none'
   }
}));

function TabPanel(props) {
   const {children, value, index, ...other} = props;
   return (
       <div
           role="tabpanel"
           hidden={value !== index}
           id={`wrapped-tabpanel-${index}`}
           aria-labelledby={`wrapped-tab-${index}`}
           {...other}
       >
          {value === index && (
              <Box p={3}>
                 <Typography>{children}</Typography>
              </Box>
          )}
       </div>
   );
}

TabPanel.propTypes = {
   children: PropTypes.node,
   index: PropTypes.any.isRequired,
   value: PropTypes.any.isRequired,
};

function a11yProps(index) {
   return {
      id: `wrapped-tab-${index}`,
      'aria-controls': `wrapped-tabpanel-${index}`,
   };
}

export default function SignIn(props) {
   const classes = useStyles();
   const [value, setValue] = React.useState('one');
   const [lang, setLang] = useState('ru')
   const [completeRegister, setCompleteStat] = useState(false);
   const [open, setOpen] = useState(false)
   const [codeForm, setCodeInputs] = useState(false)
   const [currPhone, setCurrPhone] = useState('')
   const [success, setSuccess] = useState(false);
   const handleOpen = () => {
      setOpen(true)
   };
   const handleSuccess = () => {
      setSuccess(true)
   }
   const handleClose = () => {
      setOpen(false);
      setCodeInputs(false);
   };
   const handleChange = (event, newValue) => {
      setValue(newValue);
   };
   const handleCompleteStat = () => {
      setCompleteStat(!completeRegister)
   }
   const handleCodeForm = (phone) => {
      setCurrPhone(phone);
      setSuccess(true);
      setCodeInputs(true);
   }
   const handleSuccessCLose = () => {
      setSuccess(false)
   }
   useEffect(() => {
      setLang(props.match.params.lang)
   }, [props.match.params.lang]);
   const inputsFormRegister = {
      username: {
         elementType: 'phone',
         elementConfig: {
            type: 'text',
            placeholder: translations.phone.placeholder[lang]
         },
         label: translations.phone.label[lang],
         value: '',
         validation: {
            required: true
         },
         valid: false,
         touched: false,
         disabled: false
      }
   }
   const inputsFormLogin = {
      username: {
         elementType: 'phone',
         elementConfig: {
            type: 'text',
            placeholder: translations.enterPhone.placeholder[lang]
         },
         label: translations.enterPhone.label[lang],
         value: '',
         validation: {
            required: true
         },
         valid: false,
         touched: false,
         disabled: false
      },
      password: {
         elementType: 'input',
         elementConfig: {
            type: 'password',
            placeholder: translations.password.placeholder[lang]
         },
         label: translations.password.label[lang],
         value: '',
         validation: {
            required: true
         },
         valid: false,
         touched: false,
         disabled: false
      }
   };
   const profileInputs = {
      avatar: {
         elementType: 'file',
         elementConfig: {
            type: 'text',
            placeholder: translations.avatarPlaceholder[lang]
         },
         label: translations.avatarPlaceholder[lang],
         value: '',
         valid: true,
         touched: false,
         disabled: false
      },
      fio: {
         elementType: 'input',
         elementConfig: {
            type: 'text',
            placeholder: translations.fullName.placeholder[lang]
         },
         label: translations.fullName.label[lang],
         value: '',
         validation: {
            required: true
         },
         valid: false,
         touched: false,
         disabled: false
      },
      email: {
         elementType: 'input',
         elementConfig: {
            type: 'email',
            placeholder: translations.emailInput.placeholder[lang]
         },
         label: translations.emailInput.label[lang],
         value: '',
         validation: {
            required: true,
            isEmail: true
         },
         valid: false,
         touched: false,
         disabled: false
      },
      about: {
         elementType: 'textareaBig',
         elementConfig: {
            type: 'textarea',
            placeholder: translations.aboutMeplace[lang]
         },
         label: translations.aboutMe[lang],
         value: '',
         valid: true,
         touched: false,
         disabled: false
      }
   }
   const inputsForgotPass = {
      headLine2: {
         headLine: true,
         title: {
            ru: "Восстановить пароль",
            uz: "Parolni tiklash"
         },
         contentText: null
      },
      phone: {
         elementType: 'phone',
         elementConfig: {
            type: 'text',
            placeholder: translations.phone.placeholder[lang]
         },
         label: translations.phone.label[lang],
         value: '',
         validation: {
            required: true
         },
         valid: false,
         touched: false,
         disabled: false
      }
   }
   const inputsForgotPassCode = {
      headLine2: {
         headLine: true,
         title: {
            ru: "Введите код",
            uz: "Kodni kiriting"
         },
         contentText: null
      },
      phone: {
         elementType: 'phone',
         elementConfig: {
            type: 'text',
            placeholder: translations.phone.placeholder[lang]
         },
         label: translations.phone.label[lang],
         value: currPhone,
         
         valid: true,
         touched: false,
         disabled: false
      },
      code: {
         elementType: 'text',
         elementConfig: {
            type: 'text',
            placeholder: translations.inputCode.placeholder[lang]
         },
         label: translations.inputCode.label[lang],
         value: '',
         validation: {
            required: true,
            isNumeric: true,
            maxLength: 5,
            minLength: 5
         },
         valid: false,
         touched: false,
         disabled: false
      }
   }
   return (
       <div className={style.hidescroll}>
          <MuiThemeProvider theme={themeLight}>
             <CssBaseline/>
          </MuiThemeProvider>
          <AppBar position="relative" color="inherit" elevation={0} className={classes.appBar}>
             <Container maxWidth="lg">
                <Toolbar className={classes.toolbar}>
                   <Grid container className={classes.middle}>
                      <Grid item xl={2} lg={2} md={3} sm={4} xs={4}>
                         <Link to={`/${props.match.params.lang}`}><img src={logo}/></Link>
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={4} xs={6}>
                         <Link to={props.match.params.lang === 'ru' ? `/uz/auth` : `/ru/auth`}
                               className={Appstyle.lang}> {translations.changeLang[lang]}</Link>
                      </Grid>
                   </Grid>
                </Toolbar>
             </Container>
          </AppBar>
          <div className={style.hidescrollChild}>
             <main className={classes.layout}>
                <Paper className={classes.paper}>
                   {!completeRegister ?
                       <Aux><AppBar position="static" elevation={0} color="inherit">
                          <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example"
                                classes={{indicator: classes.indicator}}
                                className={FormCss.tabsHeight}>
                             <Tab
                                 value="one"
                                 label={<p
                                     className={value === 'one' ? FormCss.active : FormCss.nonActive}>{translations.register[lang]}</p>}
                                 wrapped
                                 {...a11yProps('one')}
                                 disableRipple={true}
                                 className={classes.transform}
                             />
                             <Tab
                                 value="two"
                                 label={<p
                                     className={value !== 'two' ? FormCss.nonActive : FormCss.active}>{translations.login[lang]}</p>}
                                 {...a11yProps('two')}
                                 disableRipple={true}
                                 className={[classes.transform, value === 'two' ? FormCss.tabMargin : FormCss.tabLeft]}
                             />
                          </Tabs>
                       </AppBar>
                          <TabPanel value={value} index="one" className={FormCss.tabpanel}>
                             <Form registration={true} inputsForm={inputsFormRegister} {...props}
                                   url="/accounts/register/" ChangeLogin={(e) => handleChange(e, "two")}/>
                          </TabPanel>
                          <TabPanel value={value} index="two" className={FormCss.tabpanel}>
                             <Form login={true} inputsForm={inputsFormLogin} url="/accounts/login/" {...props}
                                   handleCompleteStat={handleCompleteStat} handleOpen={handleOpen}/>
                          </TabPanel>
                       </Aux> :
                       <Aux>
                          <div>
                             <p className={FormCss.completeReg}>{translations.completeRegister[lang]}</p>
                             <span>
                                <p className={FormCss.label}>{translations.avatarPlaceholder[lang]}</p>
                                <p className={FormCss.starYell}>*</p>
                             </span>
                             <Form registerComplete={true} inputsForm={profileInputs}
                                   url="/accounts/register/complete/" {...props} />
                          </div>
                       </Aux>
                   }
                </Paper>
             </main>
          </div>
          <Snackbar open={success} handleOpen={handleSuccess} handleClose={handleSuccessCLose}>
             <Alert elevation={6} variant="filled" onClose={handleClose}
                    severity="success">{codeForm ? translations.codeIsSent[lang] : translations.sentNewPassword[lang]}</Alert>
          </Snackbar>
          <Modal open={open} handleClose={handleClose} handleOpen={handleOpen}
                 closeAfterTransition
                 BackdropComponent={Backdrop}
                 BackdropProps={{
                    timeout: 50,
                 }}
                 width={400}
          >
             <div className={Appstyle.modal}>
                {codeForm ? <Form forgotPassCode={true} url={'/accounts/forgot/check/'}
                                  inputsForm={inputsForgotPassCode} {...props} handleClose={handleClose}
                                  handleSuccess={handleSuccess}/>
                    : <Form forgotPass={true} url={'/accounts/forgot/get/'} inputsForm={inputsForgotPass} {...props}
                            handleClose={handleClose} handleCodeForm={handleCodeForm}/>}
             </div>
          </Modal>
       </div>
   );
}