import React, {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import style from './Appbar.module.css';
import user from "../../assets/icons/user.svg";
import {useDispatch, useSelector} from "react-redux";
import axios from "../../API/api";
import translations from "../../Translation";
import Aux from '../../hoc/Wrapper';
import {Link, Redirect} from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../UI/Buttons/Buttons';

const StyledMenu = withStyles({
   paper: {
      marginTop: 55,
      width: '200px',
      borderRadius: '5px',
      background: '#eee',
      textAlign: 'center',
      marginLeft: -40,
      paddingBottom: 10
   },
   list: {
      marginTop: 10
   }
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
           vertical: 'bottom',
           horizontal: 'center',
        }}
        transformOrigin={{
           vertical: 'top',
           horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
   root: {
      '&:hover': {
         backgroundColor: 'transparent',
      },
      height: 20,
      textAlign: 'center',
   },
}))(MenuItem);

export default function UserBlock(props) {
   const {currentUser} = useSelector(state => ({
      ...state.mainData
   }));
   const dispatch = useDispatch();
   const [userData, setUserData] = useState(currentUser);
   const [redirect, setRedirect] = useState(false);
   const [matchParams, setParams] = useState(props.match.params);
   const [error, setError] = useState(false);
   const [open, setDialogOpen] = useState(false);
   useEffect(() => {
      setParams(props.match.params)
      if (props.match.params) {
         if (currentUser) {
            setUserData(currentUser);
         } else {
            axios.get('/profile/', {
               headers: {Authorization: `Bearer ${localStorage.getItem('auth')}`}
            })
                .then(res => {
                   // console.log(res)
                   let data = {...res.data.profile, email: res.data.email, has_group: res.data.has_group}
                   if (data.avatar) {
                      if (!(data.avatar).includes("https://api.birdamlik.uz"))
                         data.avatar = `https://api.birdamlik.uz${data.avatar}`;
                   } else {
                      data.avatar = user
                   }
                   if (props.match.params.user === 'applicant' || (res.data.has_group && res.data.group_activated && props.match.params.user === 'coordinator') || (res.data.has_group && props.match.params.user === 'volunteer')) {
                      setUserData(data)
                      setRedirect(false)
                   } else {
                      setRedirect(`/${props.match.params.lang}/groups`);
                   }
                   dispatch({
                      type: "MAINDATA",
                      info: {
                         currentUser: {...data},
                         editProfile: {...data}
                      }
                   })
                })
                .catch(err => {
                   setError(true)
                   setRedirect(`/${props.match.params.lang}/auth`);
                })
         }
      }
      
   }, [props.match, currentUser]);
   
   const [anchorEl, setAnchorEl] = React.useState(null);
   
   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleOpen = () => {
      setDialogOpen(true)
   }
   const handleClose = () => {
      setAnchorEl(null);
      setDialogOpen(false);
   };
   const handleLogOut = () => {
      setRedirect(`/${matchParams.lang}/auth`);
      setDialogOpen(false)
   }
   if (redirect)
      return (<Redirect to={redirect}/>)
   else
      return (
          <div className={style.btnUser}>
             {userData ?
                 <div>
                    <div
                        onClick={handleClick}
                    >
                       <div className={style.userBlock2}>
                          <p className={style.userBlock}>{userData.fio}</p>
                          <p className={style.userBlock1}>{userData.role === 'coordinator' ? translations.coordinator[matchParams.lang] : userData.role === 'volunteer' ? translations.volunteer[matchParams.lang] : translations.requester[matchParams.lang]}</p>
                       </div>
                       <span><img src={userData.avatar ? userData.avatar : user} className={style.avagr1} alt="group"/></span>
                    </div>
                    <StyledMenu
                        id="customized-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                       {props.match.params && props.match.params.user === 'applicant' ?
                           <Aux>
                              <StyledMenuItem disableRipple={true} onClick={handleClose}>
                                 <ListItemText
                                     primary={<Link to={`/${matchParams.lang}/${matchParams.user}/application`}
                                                    style={{textDecoration: 'none'}}><p style={{
                                        fontSize: 12,
                                        color: '#777',
                                     }}>+ {translations.newApplication[matchParams.lang]}</p></Link>}/>
                              </StyledMenuItem>
                              <hr className={style.appbarListItem}/>
                           </Aux> : null}
                       <StyledMenuItem disableRipple={true} onClick={handleClose}>
                          <ListItemText primary={<Link to={`/${matchParams.lang}/${matchParams.user}/settings`}
                                                       style={{textDecoration: 'none'}}><p
                              style={{fontSize: 12, color: '#777'}}>{translations.settingsMenu[matchParams.lang]}</p>
                          </Link>}/>
                       </StyledMenuItem>
                       <hr className={style.appbarListItem}/>
                       <StyledMenuItem disableRipple={true} onClick={handleOpen}>
                          <ListItemText primary={<p
                              style={{fontSize: 12, color: '#777'}}>{translations.log_out[matchParams.lang]}</p>}/>
                       </StyledMenuItem>
                    </StyledMenu>
                 </div>
                 : null}
             <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{translations.wannaleave[matchParams.lang]}</DialogTitle>
                <ul className={style.leave}>
                   <li>
                      <Button clicked={handleClose} btnType="Grey7">
                         {translations.cancel[matchParams.lang]}
                      </Button>
                   </li>
                   <li>
                      <Button clicked={handleLogOut} btnType="Yellow">
                         {translations.yes[matchParams.lang]}
                      </Button>
                   </li>
                </ul>
             </Dialog>
          </div>
      
      );
}