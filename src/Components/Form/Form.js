import React, { useState, useEffect } from "react";
import Aux from '../../hoc/Wrapper';
import FormCss from './Form.module.css';
import Input from '../UI/Input/Input';
import Button from '../UI/Buttons/Buttons';
import {useDispatch} from 'react-redux';
import {makeStyles} from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import { Redirect } from "react-router-dom";
import axios from '../../API/api';
import Snackbar from '../UI/Snackbar/Snackbar';
import Alert from '@material-ui/lab/Alert';
import translations from '../../Translation.json';
import img from '../../assets/icons/user.svg';
import Agreement from "./Agreement";
import pills from '../../assets/icons/pills.svg';
import camera from '../../assets/icons/camera.svg';
import delivery from '../../assets/icons/delivery-man.svg';
import tshirt from '../../assets/icons/tshirt.svg';
import apple from '../../assets/icons/apple.svg';
import avatar from '../../assets/icons/userAvatar.svg';
import style from '../RightContentEdit/RightSideBar.module.css'
import Maps from "./Map";

const useStyles = makeStyles((theme) => ({
   camera: {
      marginTop: '-90px',
      zIndex: 100,
      position: 'absolute',
      marginLeft: '-20px',
      cursor: 'pointer'
   },
}));

function Form(props) {
   const classes = useStyles();
   const dispatch = useDispatch();
   const [userType, setUsertype] = useState('volunteer');
   const [nextUrl, setNextUrl] = useState(props.match.url);
   const [lang, setLang] = useState(props.match.params.lang ? props.match.params.lang : 'ru');
   const [publicGroup, setsPublcGroup] = useState(null);
   const [message, setMessage] = useState(null);
   const [completeAva, setCompleteAva] = useState(null);
   
   const [btn1, setbtn1] = useState({status:false, text:''});
   const [btn2, setbtn2] = useState({status:false, text:''});
   const [btn3, setbtn3] = useState({status:false, text:''});
   const [btn4, setbtn4] = useState({status:false, text:''});
   const uploadedImage = React.useRef(null);
   const imageUploader = React.useRef(null);
   const mapData = {
      center: [55.751574, 37.573856],
      zoom: 5,
   };
   
   const coordinates = [
      [55.684758, 37.738521],
      [57.684758, 39.738521]
   ];
   const handleChange1 = (event) => {
      setbtn1({status:!event.target.checked, text:!event.target.checked?'medicine':''});
   };
   const handleChange2 = (event) => {
      setbtn2({status:!event.target.checked, text:!event.target.checked?'food':''});
   };
   const handleChange3 = (event) => {
      setbtn3({status:!event.target.checked, text:!event.target.checked?'delivery':''});
   };
   const handleChange4 = (event) => {
      setbtn4({status:!event.target.checked, text:!event.target.checked?'clothes':''});
   };
   
   
   
   const [formData, setFormData] = useState({
      inputsForm: props.inputsForm,
      formIsValid: false,
      regSuccess: false,
      error: false,
      regError: false,
      redirect: false
   });
   useEffect(() => {
      setFormData({
         ...formData, inputsForm: props.inputsForm
      });
      setNextUrl(props.match.url);
      setLang(props.match.params.lang ? props.match.params.lang : 'ru')
   },[props.match.params,props.inputsForm]);
   
   const handleUserType = (user) => {
      setUsertype(user);
   };
   const handlePublicGroupStatus = () => {
      setsPublcGroup(!publicGroup);
   };
   const handleSuccess=()=>{
      setFormData({...formData,regSuccess:true})
   }
   const handleError=()=>{
      setFormData({...formData,error:true})
   }
   const  handleClose=()=>{
      setFormData({...formData,regSuccess:false,error:false})
      if(formData.regSuccess && (!props.login && !props.registration && !props.application))
        setFormData({inputsForm: props.inputsForm,
         formIsValid: false,
         regSuccess: false,
         error: false,
         regError: false,
         redirect: false});
   }
   const handleImageUpload = e => {
      const [file] = e.target.files;
      if (file) {
         const reader = new FileReader();
         const {current} = uploadedImage;
         current.file = file;
         reader.onload = e => {
            current.src = e.target.result;
           
         };
         reader.readAsDataURL(file);
      }
       setCompleteAva(e.target.files[0]);
   }
   const formHandler = (event) => {
      event.preventDefault();
      const {inputsForm}=formData
      const Data ={};
      const DataForm= new FormData();
      
      
      if (inputsForm["username"]) {
         Data["username"] = inputsForm["username"].value.replace("+", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "");
      }
      if (inputsForm["phone"]){
         Data["phone"] = inputsForm["phone"].value.replace("+", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "");
      }
      // if(props.registration){
      //    Data["profile"]={};
      //    Data["password"] = inputsForm["password"].value;
      //    Data.profile["fio"]=inputsForm["fio"].value;
      //    Data.profile["role"]=userType;
      //    Data.profile=JSON.stringify(Data.profile)
      // }
      // else 
      if(props.personal){
         Data["profile"]={};
         Data["email"] = inputsForm["email"].value;
         Data.profile["fio"]=inputsForm["fio"].value;
         // Data.profile["username"]=inputsForm["username"].value.replace("+", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "");
         Data.profile["about"]=inputsForm["about"].value;
         Data.profile=JSON.stringify(Data.profile)
      }
      else if(props.safety){
         Data["old_password"] = inputsForm["old_password"].value;
         Data["new_password"] = inputsForm["new_password"].value;
         
      }
      else if(props.makegroup){
         for (let formElementIdentifier in inputsForm) {
            if (!inputsForm[formElementIdentifier].headLine)
               if (inputsForm[formElementIdentifier].elementConfig && inputsForm[formElementIdentifier].elementConfig.type === 'file') {
                  
                  DataForm.append(formElementIdentifier, inputsForm[formElementIdentifier].value[0]);
               }
               else {
                  if (formElementIdentifier === 'phone')
                     DataForm.append(formElementIdentifier, inputsForm[formElementIdentifier].value.replace("+","").replace(" ","").replace(" ","").replace(" ","").replace(" ",""));
                  else
                     DataForm.append(formElementIdentifier, inputsForm[formElementIdentifier].value);
               }
         }
         DataForm.append('public', publicGroup);
      }
      else if(props.registerComplete){
         for (let formElementIdentifier in inputsForm) {
            if(formElementIdentifier==='avatar')
            DataForm.append('avatar', completeAva);
            else
               DataForm.append(formElementIdentifier, inputsForm[formElementIdentifier].value);
         }
         DataForm.append('role', userType);
      }
      else
         for (let formElementIdentifier in inputsForm) {
            if (!Data[formElementIdentifier] && !inputsForm[formElementIdentifier].headLine)
               Data[formElementIdentifier] = inputsForm[formElementIdentifier].value;
         }
      if(props.quickReq){
         Data["type"]=""
         if(btn1.text!==''){
            Data["type"]=btn1.text;
         }
         if(btn2.text!==''){
            if( Data["type"]==="")
            Data["type"]=btn2.text;
            else{
               Data["type"]=`${Data["type"]}, ${btn2.text}`;
            }
         }
         if(btn3.text!==''){
            if( Data["type"]==="")
            Data["type"]=btn3.text;
            else{
               Data["type"]=`${Data["type"]}, ${btn3.text}`;
            }
         }
         if(btn4.text!==''){
            if( Data["type"]==="")
            Data["type"]=btn4.text;
            else{
               Data["type"]=`${Data["type"]}, ${btn4.text}`;
            }
         }
      }
     
      if(props.registration || props.login)
         axios.post( props.url, Data)
             .then( response => {
                if(props.registration){
                   if(response.data.status===false){
                     setFormData({...formData,error:true})
                   }
                 else{
                     props.ChangeLogin();
                     localStorage.setItem('auth',response.data.token);
                     setFormData({...formData,regSuccess:true})
                  }
                }
                if(props.login)
                {
                   localStorage.setItem('auth',response.data.token);
                  if(response.data.registered){ 
                     let user=response.data.role==='requester'?'applicant':response.data.role;
                     if(user==='applicant' || (user==='volunteer' && response.data.has_group) || (user==='coordinator' && response.data.has_group && response.data.group_activated))
                     {
                        if(user!=='applicant')
                           axios.get(`/${user}s/group/info/`,{
                              headers: {Authorization:`Bearer ${localStorage.getItem('auth')}`}
                           })
                              .then(res=>{
                                 dispatch({
                                    type: "MAINDATA",
                                    info:{
                                       groupInfo:res.data,
                                       groupEdit:res.data
                                    }
                                 });
                              })
                              .catch(err=>{
                                 // console.log('group Error',err)
                              });
                        setNextUrl(`/${props.match.params.lang}/${user}`);
                        let data={...response.data}
                        if(data.avatar)
                        {
                           if(!(data.avatar).includes("https://api.birdamlik.uz"))
                              data.avatar=`https://api.birdamlik.uz${data.avatar}`;
                        }
                        else{
                           data.avatar=img
                        }
                        dispatch({
                           type: "MAINDATA",
                           info:{
                              currentUser:{...data},
                              editProfile:{...data}
                           }
                        });
                     }
                     else{
                        setNextUrl(`/${props.match.params.lang}/groups`);
                     }
                     setFormData({...formData,redirect:true})
                     setUsertype(response.data.role)
                  }
                  else{
                     props.handleCompleteStat()
                  }
                }
                
             })
             .catch( error => {
                setFormData({...formData,error:true})
             } );
      else if(props.makegroup){
         axios.post('/coordinators/group/create/',DataForm,{
                headers: {
                   Authorization: `Bearer ${localStorage.getItem('auth')}`,
                   'Content-Type': 'multipart/form-data'
                }
             }
         )
             .then( response => {
                // console.log(response)
                setNextUrl(`/${props.match.params.lang}`);
                setFormData({...formData,redirect:true})
                setFormData({...formData,regSuccess:true})
             } )
             .catch( error => {
                setFormData({...formData,error:true})
             } );
      }
      else if(props.registerComplete){
         axios.post(props.url,DataForm,{
                     headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth')}`,
                        'Content-Type': 'multipart/form-data'
                     }
                  }
               )
             .then( response => {
               let user=response.data.role==='requester'?'applicant':response.data.role;
               if(user==='applicant' || (user==='volunteer' && response.data.has_group) || (user==='coordinator' && response.data.has_group && response.data.group_activated))
               {
                  setNextUrl(`/${props.match.params.lang}/${user}`);
                  let data={...response.data}
                  if(data.avatar)
                  {
                     if(!(data.avatar).includes("https://api.birdamlik.uz"))
                        data.avatar=`https://api.birdamlik.uz${data.avatar}`;
                  }
                  else{
                     data.avatar=img
                  }
                  dispatch({
                     type: "MAINDATA",
                     info:{
                        currentUser:{...data},
                        editProfile:{...data}
                     }
                  });
               }
               else{
                  setNextUrl(`/${props.match.params.lang}/groups`);
               }
               setFormData({...formData,redirect:true})
               setUsertype(response.data.role)
             } )
             .catch( error => {
                setFormData({...formData,error:true})
             } );
      }
      else if(props.personal || props.safety || props.groupInfo || props.applicationEdit){
         axios.patch(props.url,Data,{
            headers: {
               Authorization: `Bearer ${localStorage.getItem('auth')}`
            }
         })
             .then(res=>{
                if((res.data.message==="Success" && res.data.status && (props.safety)) || props.groupInfo || props.personal || props.applicationEdit)
                   setFormData({...formData,regSuccess:true})
                else
                {
                   setMessage(res.data.message)
                   setFormData({...formData,error:true})
                }
             })
             .catch(err=>{
                setMessage(err.message)
                setFormData({...formData,error:true})
             })
      }
      else if(props.application){
         axios.post(props.url,Data,
             {headers: {
                   Authorization: `Bearer ${localStorage.getItem('auth')}`}})
             .then(res=>{
                setNextUrl(`/${props.match.params.lang}/${props.match.params.user}/myapps/1`);
                setFormData({...formData,redirect:true});
             })
             .catch(err=>{
                setFormData({...formData,error:true});
             })
      }
      else if(props.quickReq || props.sponsorReq){
         axios.post(props.url,Data)
             .then(res=>{
                 props.handleClose();
                setTimeout(function(){props.handleSuccess();},150)
             })
             .catch(err=>{
                setFormData({...formData,error:true});
             })
      }
      else if(props.forgotPass){
         axios.post(props.url,Data)
             .then(res=>{
                   props.handleCodeForm(Data.phone);
             })
             .catch(err=>{
                setFormData({...formData,error:true});
             })
      }
      else if(props.forgotPassCode){
         axios.post(props.url,Data)
             .then(res=>{
                  if(!res.data.status)
                  setFormData({...formData,error:true});
                  else{
                     props.handleClose();
                     setTimeout(function(){ props.handleSuccess(); },150)
                   }
             })
             .catch(err=>{
                setFormData({...formData,error:true});
             })
      }
   }
   
   const checkValidity = (value, rules) => {
      let isValid = true;
      if (!rules) {
         return true;
      }
      
      if (rules.required) {
         isValid = value.trim() !== '' && isValid;
      }
      
      if (rules.minLength) {
         isValid = value.length >= rules.minLength && isValid
      }
      
      if (rules.maxLength) {
         isValid = value.length <= rules.maxLength && isValid
      }
      
      if (rules.isNumeric) {
         const pattern = /^\d+$/;
         isValid = pattern.test(value) && isValid
      }
      if (rules.isEmail) {
         const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
         isValid = pattern.test(value) && isValid
      }
      if (rules.match) {
         isValid = value === formData.inputsForm[rules.match].value && isValid
      }
      if (rules.notmatch) {
         isValid = value !== formData.inputsForm[rules.notmatch].value && isValid
      }
      
      return isValid;
      
   }
   const inputChangedHandler = (event, inputIdentifier) => {
      // console.log(event.target.files[0].name)
      const updatedOrderForm = {
         ...formData.inputsForm
      };
      const updatedFormElement = {
         ...updatedOrderForm[inputIdentifier]
      };
      if(updatedFormElement.elementConfig.type === 'file'){
         updatedFormElement.value = event.target.files;
      }
      else if(updatedFormElement.elementType === 'date')
         updatedFormElement.value = event;
      else
         updatedFormElement.value = event.target.value;
      updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
      updatedFormElement.touched = true;
      updatedOrderForm[inputIdentifier] = updatedFormElement;
      
      let formIsValid = true;
      for (let inputIdentifier in updatedOrderForm) {
         if (!updatedOrderForm[inputIdentifier].headLine)
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
      }
      if(props.groupInfo || props.personal || props.applicationEdit)
         formIsValid=true
      setFormData({ ...formData, inputsForm: updatedOrderForm, formIsValid: formIsValid });
   }
   const handleForgotPass = () => {
      props.handleOpen()
   }
   
   const formElementsArray = [];
   for (let key in formData.inputsForm) {
      formElementsArray.push({
         id: key,
         config: formData.inputsForm[key]
      });
   }
   let form = (
       <form onSubmit={formHandler} encType='multipart/form-data'>
          <Grid container spacing={2}>
             {formElementsArray.map(formElement => {
                if(formElement.config.headLine)
                   return(formElement.config.contentText?<Aux>
                      { props.makegroup?
                        <Grid key={formElement.config} item xs={12}>
                           <label className={FormCss.labelF}>{translations.groupType[lang]}</label>
                           <Grid container spacing={2}>
                              <Grid item xs={6}>
                                 <Button  btnType={publicGroup ? 'activeButton' : 'passiveButton'}
                                          clicked={(e) =>{e.preventDefault();handlePublicGroupStatus()}}>
                                    {translations.publicGroup[lang]}
                                 </Button>
                              </Grid>
                              <Grid item xs={6}>
                                 <Button btnType={!publicGroup ? 'activeButton' : 'passiveButton'}
                                          clicked={(e) => { e.preventDefault(); handlePublicGroupStatus() }}>
                                    {translations.privateGroup[lang]}
                                 </Button>
                              </Grid>
                           </Grid>
                        </Grid>
                        :''}
                              <Grid key={formElement.config} item xs={12}>
                                 <div
                                     className={props.quickReq ? FormCss.QuickreqTitle : FormCss.ConfigTitle}> {formElement.config.title[lang]}
                                    <p className={FormCss.contextText}>{formElement.config.contentText}</p>
                                 </div>
                              </Grid></Aux> :
                           <Grid key={formElement.config} item xs={12}>
                              <div
                                  className={props.quickReq ? FormCss.QuickreqTitle : props.sponsorReq ? FormCss.sponsorReq : FormCss.ConfigTitle}> {formElement.config.title[lang]}
                                 {formElement.config.contentText ?
                                     <p className={FormCss.contextText}>{formElement.config.contentText}</p> : null}
                              </div>
                           </Grid>
                   )
                else if (props.quickReq && formElement.id === 'city') {
                   return (<Aux key={formElement.config}>
                      <Input
                          lang={lang}
                          key={formElement.id}
                          inputs={formElement.config.inputs}
                          elementType={formElement.config.elementType}
                          elementConfig={formElement.config.elementConfig}
                          label={formElement.config.label}
                          value={formElement.config.elementConfig.type==='file' && formElement.config.value!==''?formElement.config.value.name:formElement.config.value}
                          invalid={!formElement.config.valid}
                          shouldValidate={formElement.config.validation}
                          touched={formElement.config.touched}
                          disabled={formElement.config.disabled}
                          files={formElement.config.elementConfig.type==='file'}
                          changed={(event) => inputChangedHandler(event, formElement.id)}/>
                      {/*<div style={{marginTop: '10px', margin: '7px', width: '100%'}}>*/}
                      {/*   <label className={FormCss.labelF}>{translations.accountType[lang]}</label>*/}
                      {/*   <Grid container xl={12} lg={12} md={12} sm={12} xs={12}>*/}
                      {/*      <Maps lang={lang}/>*/}
                      {/*   </Grid>*/}
                      {/*</div>*/}
                      <div style={{marginTop: '10px', marginLeft: '7px'}}>
                         <label className={FormCss.labelF}>{translations.accountType[lang]}</label>
                         <Grid container spacing={2}>
                            <Grid item>
                                    <span>
                                 <Button btnType={btn1.status === false ? "passiveButton" : "activeBtnFsz12"} checked={btn1.status}
                                         clicked={(e)=>{e.preventDefault();handleChange1(e)}}>
                                         <img className={FormCss.imgTitle} src={pills} /> {translations.medicine[lang]}
                                       </Button>
                                       </span>
                            </Grid>
                            <Grid item>
                                    <span>
                                    <Button btnType={btn2.status === false ? "passiveButton" : "activeBtnFsz12"} checked={btn2.status}
                                            clicked={(e)=>{e.preventDefault();handleChange2(e)}}>
                                          <img className={FormCss.imgTitle} src={apple}/> {translations.food[lang]}
                                       </Button>
                                       </span>
                            </Grid>
                            <Grid item>
                                    <span>
                                 <Button btnType={btn3.status === false ? "passiveButton" : "activeBtnFsz12"} checked={btn3.status}
                                         clicked={(e)=>{e.preventDefault();handleChange3(e)}}>
                                          <img className={FormCss.imgTitle} src={delivery}/> {translations.delivery[lang]}
                                       </Button>
                                       </span>
                            </Grid>
                            <Grid item>
                                    <span>
                                 <Button btnType={btn4.status === false ? "passiveButton" : "activeBtnFsz12"} checked={btn4.status}
                                         clicked={(e)=>{e.preventDefault();handleChange4(e)}}>
                                           <img className={FormCss.imgTitle} src={tshirt}/> {translations.clothes[lang]}
                                       </Button>
                                       </span>
                            </Grid>
                         </Grid>
                      </div>
                   </Aux>)
                }
                else if(props.registerComplete && formElement.id==='avatar'){
                   return (
                       <div className={FormCss.photo}>
                          <div className={style.circle}>
                             <img className={style.large} ref={uploadedImage}
                                  src={avatar}/>
                             <div className={style.overlay}>
                                <label for="file-input">
                                   <img src={camera} className={classes.camera} alt="img"/>
                                </label>
                                <input style={{display: 'none'}} type="file" id="file-input"
                                       onChange={handleImageUpload} ref={imageUploader}/>
                             </div>
                          </div>
                       </div>
                   )
                }
                else
                   return (<Input
                       lang={lang}
                       key={formElement.id}
                       inputs={formElement.config.inputs}
                       elementType={formElement.config.elementType}
                       elementConfig={formElement.config.elementConfig}
                       label={formElement.config.label}
                       value={formElement.config.elementConfig.type==='file' && formElement.config.value!==''?formElement.config.value.name:formElement.config.value}
                       invalid={!formElement.config.valid}
                       shouldValidate={formElement.config.validation}
                       touched={formElement.config.touched}
                       disabled={formElement.config.disabled}
                       files={formElement.config.elementConfig.type==='file'}
                       changed={(event) => inputChangedHandler(event, formElement.id)}/>)
             })}
          </Grid>
          {props.registerComplete ?
              <div style={{marginTop: '10px'}}>
                 <label className={FormCss.labelF}>{translations.accountType[lang]}</label>
                 <Grid container spacing={2}>
                    <Grid item xs={6}>
                       <Button  btnType={userType === 'volunteer' ? 'activeButton' : 'passiveButton'}
                                clicked={(e) =>{e.preventDefault();handleUserType('volunteer')}}>
                          {translations.volunteer[lang]}
                       </Button>
                    </Grid>
                    <Grid item xs={6}>
                       <Button btnType={userType === 'requester' ? 'activeButton' : 'passiveButton'}
                               clicked={(e) => { e.preventDefault(); handleUserType('requester') }}>
                          {translations.applicant[lang]}
                       </Button>
                    </Grid>
                 </Grid>
              </div>
              :''}
          <div style={{ marginTop: '10px' }} className={props.quickReq? FormCss.bottomAgreePanel :FormCss.agree}>
             <p className={FormCss.label}>
                {props.login ? 
                    <span onClick={handleForgotPass} style={{ color: '#000', fontWeight: 'bold', textDecoration: 'none',cursor:'pointer'}}>{translations.forgotPass[lang]}</span>
                    :
                    props.registration || props.makegroup || props.quickReq || props.registerComplete?
                        <Agreement lang={lang} />  : ''
                }
             </p>
             {props.applicationEdit ?
                 <div >
                    <Button btnType="Simple" clicked={props.handleClose}>
                       {translations.cancel[lang]}
                    </Button>
                    <Button btnType="Yellow" >
                       {translations.toSend[lang]}
                    </Button>
                 </div>
                 :props.quickReq?
                     <div className={FormCss.quickReqAgreebtn}>
                        <Button btnType="Simple" clicked={props.handleClose}>
                           {translations.cancel[lang]}
                        </Button>
                        <Button btnType="Yellow" btnType={formData.formIsValid ? 'Yellow' : 'Grey7'} disabled={!formData.formIsValid}>
                           {translations.toSend[lang]}
                        </Button>
                     </div>: props.forgotPass || props.forgotPassCode?
                     <div className={FormCss.quickReqAgreebtn}>
                        <Button btnType="Simple" clicked={props.handleClose}>
                           {translations.cancel[lang]}
                        </Button>
                        <Button btnType="Yellow" btnType={formData.formIsValid ? 'Yellow' : 'Grey7'} disabled={!formData.formIsValid}>
                           {props.forgotPassCode?translations.resetPass[lang]:translations.getCode[lang]}
                        </Button>
                     </div>
                     :<Button btnType={formData.formIsValid ? 'Yellow' : 'Grey7'} disabled={!formData.formIsValid}>
                        {props.application?translations.makeApplication[lang]:props.registration?translations.getPassword[lang]:translations.ready[lang]}
                     </Button>}
          
          </div>
       </form>
   );
   if (formData.redirect && (props.login  || props.application || props.makegroup || props.registerComplete)) {
      return (<Redirect to={nextUrl} />)
   }
   return (
       <Aux>
          {form}
          <Snackbar open={formData.regSuccess} handleOpen={handleSuccess} handleClose={handleClose}>
             <Alert elevation={6} variant="filled" onClose={handleClose} severity="success">{props.makegroup?translations.successGroupCreate[lang]:props.forgotPassCode?translations.sentNewPassword[lang]:translations.successfullyreistered[lang]}</Alert>
          </Snackbar>
          <Snackbar open={formData.error} handleOpen={handleError} handleClose={handleClose}>
             <Alert elevation={6} variant="filled" onClose={handleClose} severity="error">{props.login?translations.wrong[lang]:props.registration?translations.registerError[lang]:props.forgotPassCode?translations.codeIsWrong[lang]:translations.error[lang]}</Alert>
             {/* {message} */}
          </Snackbar>
       </Aux>
   );
}

export default (Form);