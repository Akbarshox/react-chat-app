import React, {useState, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import Container from '@material-ui/core/Container';
import {withStyles, withTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ScrollTo from "react-scroll-into-view";
import Appstyle from './Appbar.module.css';
import Aux from '../../hoc/Wrapper';
import logo from '../../assets/icons/logo.svg';
import SidebarDrawer from './SideDrawer/SideDrawer';
import MenuIcon from '../../assets/icons/bars.svg';
import Button from '../UI/Buttons/Buttons';
import Elevation from './Elevation.js';
import tick from "../../assets/icons/verified.svg";
import img from "../../assets/icons/user.svg";
import star from "../../assets/icons/StarYell.svg";
import translate from '../../Translation.json'
import axios from '../../API/api';
import Form from '../../Components/Form/Form';
import Modal from '../../Components/UI/Modal/Modal';
import Snackbar from '../../Components/UI/Snackbar/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {useSelector, useDispatch} from 'react-redux';
import translations from '../../Translation.json';
import regions from '../../regions.json';
import DynamicSideBar from "./SideDrawer/DynamicSideBar";
import Backdrop from "@material-ui/core/Backdrop";
import UserBlock from "./UserBlock";

const styles = theme => ({
   appBar: {
      paddingRight: 0,
      paddingLeft: 0,
      alignItems: 'center'
   },
   shadow: {
      boxShadow: '0 2px 3px -2px #ccc'
   },
   toolbar: {
      paddingRight: 0,
      paddingLeft: 0,
      alignItems: 'center'

   },
   Applink: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'flex-end',

   },
   menu_media: {
      [theme.breakpoints.down('md')]: {
         display: 'none',
      },
   },
   menuButton: {
      padding: '10px',
      alignSelf: 'center',
      [theme.breakpoints.up('lg')]: {
         display: 'none',
      },
   },
   menuIcon: {
      [theme.breakpoints.down('xs')]: {
         width: 19
      }
   },
   middle: {
      alignItems: 'center',
      verticalAlign: 'middle'
   }
});


function Appbar(props) {
   const {classes, window} = props;
   const {lang, user, contenttype} = props.match.params;
   const {json} = props;
   const [right, setRight] = useState(false)
   const [open, setOpen] = useState(false)
   const [matches, setMatches] = useState(window ? window.innerWidth : null)
   const {groupInfo, notificationStatus} = useSelector(state => ({
      ...state.mainData
   }));
   const dispatch = useDispatch();
   const [groupData, setGroupData] = useState(groupInfo);
   const [success, setSuccess] = useState(false);
   const [error, setError] = useState(false);
   const districtsOptions = []
   regions.map(d => {
      districtsOptions.push({
         value: d[lang],
         displayValue: d[lang]
      })
   })
   const sponsorForm = {
      headLine: {
         headLine: true,
         title: {
            ru: "Оставьте заявку",
            uz: "Arizangizni qoldiring"
         },
         contentText: null
      },
      name: {
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
      title: {
         elementType: 'input',
         elementConfig: {
            type: 'text',
            placeholder: translations.organization.placeholder[lang]
         },
         label: translations.organization.label[lang],
         value: '',
         validation: {
            required: true
         },
         valid: false,
         touched: false,
         disabled: false
      },
      description: {
         elementType: 'textarea',
         elementConfig: {
            type: 'text',
            placeholder: translations.organizationJob.placeholder[lang]
         },
         label: translations.organizationJob.label[lang],
         value: '',
         validation: {
            required: true
         },
         valid: false,
         touched: false,
         disabled: false
      },
      phone: {
         elementType: 'phone',
         elementConfig: {
            type: 'text',
            placeholder: translations.phone.placeholder[lang]
         },
         label: translations.phone.label[lang],
         value: '',
         valid: true,
         touched: false,
         disabled: false
      },
      email: {
         elementType: 'email',
         elementConfig: {
            type: 'email',
            placeholder: translations.emailInput.placeholder[lang]
         },
         label: translations.emailInput.label[lang],
         value: '',
         validation: {
            required: true
         },
         valid: false,
         touched: false,
         disabled: false
      },
   };

   const inputsForm = {
      headLine: {
         headLine: true,
         title: {
            ru: "Создать заявку",
            uz: "Yangi so'rovnoma"
         },
         contentText: null
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
      phone: {
         elementType: 'phone',
         elementConfig: {
            type: 'text',
            placeholder: translations.phone.placeholder[lang]
         },
         label: translations.phone.label[lang],
         value: '',
         valid: true,
         touched: false,
         disabled: false
      },
      city: {
         elementType: 'select',
         elementConfig: {
            options: [
               {value: '', displayValue: translations.chooseRegion[lang], selected: true},
               ...districtsOptions
            ]
         },
         label: translations.region[lang],
         value: '',
         validation: {
            required: true
         },
         valid: false,
         touched: false,
         disabled: false
      },
      description: {
         elementType: 'textarea',
         elementConfig: {
            type: 'text',
            placeholder: translations.quickDesRequest.placeholder[lang]
         },
         label: translations.quickDesRequest.label[lang],
         value: '',
         validation: {
            required: true
         },
         valid: false,
         touched: false,
         disabled: false
      }
   }
   useEffect(() => {
      if (!groupData && ["coordinator", "volunteer"].includes(props.match.params.user)) {
         axios.get(`/${props.match.params.user}s/group/info/`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('auth')}`
            }
         })
            .then(res => {
               let data = {...res.data}
               if (data.avatar) {
                  if (!(data.avatar).includes("https://api.birdamlik.uz"))
                     data.avatar = `https://api.birdamlik.uz${data.avatar}`;
               } else {
                  data.avatar = img
               }
               setGroupData(data);

               dispatch({
                  type: "MAINDATA",
                  info: {
                     groupInfo: data,
                     groupEdit: data
                  }
               })
            })
            .catch(err => {

               setError(true)
            })
      }
   }, [props])

   const toggleDrawer = (side, open) => {
      setRight(open);
   };
   const handleError = () => {
      setError(true)
   }
   const handleSuccess = () => {
      setSuccess(true)
   }
   const handleSuccessCLose = () => {
      setSuccess(false)
   }
   const handleOpen = () => {
      setOpen(true)
   };
   const handleClose = () => {
      setOpen(false)
      setError(false)
   };

   return (
      <Aux>
         <Elevation>
            <AppBar position="sticky" color="inherit" className={classes.appBar}>
               <Container maxWidth="lg">
                  <Toolbar className={classes.toolbar}>
                     <Grid container className={classes.middle}>
                        <Grid item xl={2} lg={2} md={3} sm={4} xs={4}>
                           <Link
                              to={user && contenttype ? "coordinator" === user ? `/${lang}/${user}/appsfeed` : "volunteer" === user ? `/${lang}/${user}/groupfeed` : `/${lang}/${user}/myapps` : `/${props.match.params.lang}`}><img
                              className={Appstyle.logo} src={logo}/></Link>
                        </Grid>
                        <Grid item xl={1} lg={1} md={2} sm={4} xs={3}>
                           <Link
                              to={user && contenttype ? lang === 'ru' ? `/uz/${user}/${contenttype}` : `/ru/${user}/${contenttype}` : lang === 'ru' ? (props.match.url).replace('/ru', '/uz') : (props.match.url).replace('/uz', '/ru')}
                              className={Appstyle.lang}> {translate.changeLang[lang]}</Link>
                        </Grid>
                        <Grid item xl={9} lg={9} md={7} sm={4} xs={5} className={classes.Applink}>
                           <ul className={Appstyle.menu + ' ' + classes.menu_media}>
                              {json.length !== 0 ? json.map((element, i) =>
                                 <li key={i}>
                                    <img src={element.icon1} className={Appstyle.ring}/>
                                    {element.scroll === '' ?
                                       element.link === 'newReq' || element.link === 'sponsorFeed' ?
                                          <Button clicked={handleOpen}
                                                  btnType={contenttype === element.link ? element.active : element.css}>
                                             {element.name[lang]}
                                          </Button>
                                          :
                                          <Link
                                             to={props.match.params.user ? `/${lang}/${props.match.params.user}/${element.link}` : element.link === '' ? `/${lang}` : `/${lang}/${element.link}`}>
                                             <Button
                                                btnType={props.match.params.user && props.match.params.user === 'coordinator' ?
                                                   element.link === 'quick-posts' && (contenttype === 'appsfeed' || contenttype === 'quick-posts') ? element.active
                                                      : element.link === 'shared-posts' && (contenttype === 'groupfeed' || contenttype === 'shared-posts') ? element.active : contenttype === element.link ? element.active : element.css
                                                   : contenttype === element.link ? element.active : element.css}>
                                                {element.name[lang]}
                                             </Button>
                                          </Link>
                                       :
                                       <ScrollTo selector={element.scroll}>
                                          <Link
                                             to={props.match.params.user ? `/${lang}/${props.match.params.user}/${element.link}` : element.link === '' ? `/${lang}` : `/${lang}/${element.link}`}>
                                             <Button
                                                btnType={contenttype === element.link ? element.active : element.css}>
                                                {element.name[lang]}
                                             </Button>
                                          </Link>
                                       </ScrollTo>}
                                    {notificationStatus !== 'not set' && notificationStatus ?
                                       <img src={element.icon2} className={Appstyle.ellipse}/> : ''}
                                 </li>
                              ) : null}
                              {props.match.path === '/:lang/:user/:contenttype' ?
                                 <li>
                                    <UserBlock {...props} />
                                 </li>
                                 : null}
                           </ul>
                           {props.match.path === '/:lang/:user/:contenttype' && props.matches === true && groupData ?
                              <ul className={Appstyle.socialCareList}>
                                 <li>
                                    <img src={groupData.avatar} className={Appstyle.avagr} alt="group"/>
                                    <p><p
                                       className={Appstyle.Socialcare + ' ' + Appstyle.groupName}>{groupData.title} {groupData.is_verified ?
                                       <img src={tick} style={{width: 10, height: 10, marginLeft: '5px'}}/> : null}</p>

                                       <span className={Appstyle.titleStar}>  <img src={star} alt="starYell"
                                                                                   style={{marginRight: '5px'}}/> {groupData.stars} {translate.stars[lang]} </span>
                                    </p>
                                 </li>
                              </ul>
                              : null}
                           {props.match.path === '/:lang/:user/:contenttype' && props.matches === false ?
                              <IconButton
                                 onClick={() => toggleDrawer('right', true)}
                                 className={classes.menuButton}>
                                 <img src={MenuIcon} className={classes.menuIcon}/>
                              </IconButton> : null}
                           {props.match.path !== '/:lang/:user/:contenttype' ?
                              <IconButton
                                 onClick={() => toggleDrawer('right', true)}
                                 className={classes.menuButton}>
                                 <img src={MenuIcon} className={classes.menuIcon}/>
                              </IconButton> : null}
                        </Grid>
                     </Grid>
                     {props.match.path !== '/:lang/:user/:contenttype' ?
                        <SidebarDrawer json={json} {...props} right={right} handleOpen={handleOpen}
                                       toggleDrawer={toggleDrawer}/>
                        : null}
                     {props.match.path === '/:lang/:user/:contenttype' && props.matches === false ?
                        <DynamicSideBar json={json} {...props} right={right} toggleDrawer={toggleDrawer}/>
                        : null}
                  </Toolbar>
               </Container>
            </AppBar>
         </Elevation>
         <Snackbar open={error} handleOpen={handleError} handleClose={handleClose}>
            <Alert elevation={6} variant="filled" onClose={handleClose} severity="error">{translate.error[lang]}</Alert>
         </Snackbar>
         <Snackbar open={success} handleOpen={handleSuccess} handleClose={handleSuccessCLose}>
            <Alert elevation={6} variant="filled" onClose={handleClose}
                   severity="success">{translate.successSent[lang]}</Alert>
         </Snackbar>
         <Modal open={open} handleClose={handleClose} handleOpen={handleOpen}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                   timeout: 50,
                }}
         >
            {json.length !== 0 ? json.map((element, i) =>
                  element.link === 'newReq' ?
                     <div className={Appstyle.modal}>
                        <Form quickReq={true} url={'/misc/quick-post/create/'} inputsForm={inputsForm} {...props}
                              handleSuccess={handleSuccess} handleClose={handleClose}/>
                     </div>
                     :
                     (element.link === 'sponsorFeed' ?
                        <div className={Appstyle.modal}>
                           <Form sponsorReq={true} url={'/misc/sponsors/create/'} inputsForm={sponsorForm} {...props}
                                 handleSuccess={handleSuccess} handleClose={handleClose}/>
                        </div> : '')
               )
               : ''}
         </Modal>
      </Aux>
   );

}

export default (withStyles(styles)(Appbar));