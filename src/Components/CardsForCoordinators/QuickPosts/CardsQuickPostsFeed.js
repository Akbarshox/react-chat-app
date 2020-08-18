import React, {useState, useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import style from './CardsForQuickPostsFeed.module.css';
import Aux from '../../../hoc/Wrapper';
import Card from '../../UI/Card/Card';
import Button from '../../UI/Buttons/Buttons';
import ShowMore from '../../UI/ShowMore/ShowMore'
import Snackbar from '../../UI/Snackbar/Snackbar'
import Alert from '@material-ui/lab/Alert';
import axios from '../../../API/api';
import moment from "moment";
import {toInteger} from 'lodash';
import translations from '../../../Translation.json'
import {useDispatch} from 'react-redux'
import Tooltip from '@material-ui/core/Tooltip';

export default function AppsFeedCoordinator(props) {
   const [CardContent, setCardContent] = useState(null);
   const [error, setError] = useState(false);
   const [message, setMessage] = useState(null);
   const [success, setSuccess] = useState(false);
   const [helped, setHelped] = useState(false);
   const [btn, setBtn] = useState(false);
   const [lang, setLang] = useState(props.matchParams.lang ? props.matchParams.lang : 'ru')
   const dispatch = useDispatch();
   useEffect(() => {
      setCardContent(props.cardData);
      setLang(props.matchParams.lang ? props.matchParams.lang : 'ru')
      if(props.cardData.helped === true){
         setBtn(true);
      }
   }, [props.cardData], [props.matchParams.lang]);
   const handleShared = () => {
      let Data = {};
      Data.quick_post = toInteger(CardContent.id);
      axios.post('/coordinators/quick-post/share/', Data,
         {
            headers: {Authorization: `Bearer ${localStorage.getItem('auth')}`}
         })
         .then(res => {
            // console.log(res)
            dispatch({
               type: "MAINDATA",
               info: {
                  updateComponent: true
               }
            })
            setSuccess(true)
         })
         .catch(err => {
            setMessage(err.message)
            setError(true)

         });
   }

   const handleClicked = (e) => {
      axios.post(`/coordinators/group/quick-post/help/${e}/`, e,
         {
            headers: {Authorization: `Bearer ${localStorage.getItem('auth')}`}
         })
         .then(res => {
            setBtn(true);
            // console.log(res)
            // setSuccess(true)
         })
         .catch(err => {
            // setMessage(err.message)
            // setError(true)
         });
   }

   const handleError = () => {
      setError(true)
   }
   const handleSuccess = () => {
      setSuccess(true)
   }

   const handleClose = () => {
      setError(false);
      setSuccess(false);
   }
   return (
      <Aux>
         {CardContent ?
            <Card cardType="col-6">
               <h3>{CardContent.fio}</h3>
               <p className={style.deadline}>{translations.createAt[lang]}: {moment(CardContent.created_at).format('DD-MM-YYYY, HH:MM')}</p>
               <div className={style.needs}>
                  <div className={style.icon}>
                     <Tooltip title={translations.medicine[lang]} aria-label="medicine">
                        <svg className={CardContent.type && CardContent.type.includes('medicine') ? style.yellow : ''}
                             width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <g clip-path="url(#clip0)">
                              <path
                                 d="M13.6079 13.6596L6.49141 6.55123C5.04159 5.10141 2.691 5.10141 1.24117 6.55123C-0.208647 8.00105 -0.208647 10.3516 1.24117 11.8014L8.34962 18.9099C9.79944 20.3619 12.1518 20.3637 13.6039 18.9139C15.0559 17.4641 15.0577 15.1117 13.6079 13.6596ZM9.7673 10.9525L5.64641 15.0734L5.36207 15.3617L4.7974 14.789L5.08174 14.5047L9.20263 10.3878L9.48697 10.1035L10.0516 10.6682L9.7673 10.9525Z"
                                 fill="#CCCCCC"/>
                              <path
                                 d="M19.6587 4.1323C18.8657 1.16192 15.815 -0.603224 12.8447 0.189718C9.87436 0.98266 8.10921 4.03338 8.9021 7.00371C9.69499 9.97404 12.7458 11.7392 15.7161 10.9463C15.7234 10.9443 15.7307 10.9424 15.738 10.9404C18.6936 10.1339 20.4446 7.09342 19.6587 4.1323ZM18.9699 4.73301L9.81098 7.20395L9.41051 7.31208L9.20226 6.54316L9.60273 6.43503L18.7656 3.9601L19.1661 3.85197L19.3744 4.62488L18.9699 4.73301Z"
                                 fill="#CCCCCC"/>
                           </g>
                           <defs>
                              <clipPath id="clip0">
                                 <rect width="20" height="20" fill="white"/>
                              </clipPath>
                           </defs>
                        </svg>
                     </Tooltip>
                  </div>
                  <div className={style.icon}>
                     <Tooltip title={translations.food[lang]} aria-label="food">
                        <svg className={CardContent.type && CardContent.type.includes('food') ? style.yellow : ''}
                             width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <g clip-path="url(#clip0)">
                              <path
                                 d="M14.7117 6.01893H14.7116C13.6025 5.8399 12.4943 6.12131 11.5915 6.81111C10.6545 7.52716 9.34538 7.52716 8.40824 6.81111C7.68297 6.25689 6.82512 5.96631 5.94063 5.96631C5.72423 5.96631 5.50622 5.98369 5.28817 6.01889C3.01615 6.38541 1.45889 8.59173 1.81682 10.9371C2.46791 15.2036 3.70189 18.1072 5.38544 19.334C6.1727 19.9075 7.0427 20.1076 8.04539 19.946C8.65988 19.8468 9.14527 19.5965 9.52941 19.1807C9.65066 19.0495 9.8212 18.9748 9.99987 18.9748C10.1785 18.9748 10.3491 19.0494 10.4703 19.1807C10.8544 19.5965 11.3399 19.8468 11.9544 19.946C12.9571 20.1079 13.8271 19.9076 14.6143 19.334C16.2979 18.1072 17.5318 15.2036 18.1829 10.9371C18.5409 8.59177 16.9836 6.38545 14.7117 6.01893Z"
                                 fill="#CCCCCC"/>
                              <path
                                 d="M14.7286 1.92958C14.6011 1.5997 14.2303 1.43552 13.9002 1.56313C13.7993 1.60216 12.2126 2.23305 10.9595 3.7059C10.9125 3.47406 10.8469 3.24067 10.7581 3.00934C10.0125 1.06688 7.96412 0.0995838 7.87729 0.0593106C7.72014 -0.0135017 7.54018 -0.0194782 7.3785 0.0425138C7.21682 0.104584 7.08718 0.229466 7.01909 0.388762C6.98147 0.476809 6.10652 2.56629 6.85214 4.50875C6.91948 4.6841 6.99815 4.85074 7.08429 5.01023C7.83561 5.17656 8.55021 5.50784 9.1865 5.99401C9.66564 6.36022 10.3351 6.36022 10.8143 5.99401C10.927 5.90792 11.0422 5.82671 11.1595 5.75038C11.4927 5.01855 12.0134 4.35644 12.7184 3.77293C13.5585 3.0775 14.3557 2.76051 14.3622 2.75797C14.6921 2.63039 14.8562 2.25954 14.7286 1.92958Z"
                                 fill="#CCCCCC"/>
                           </g>
                           <defs>
                              <clipPath id="clip0">
                                 <rect width="20" height="20" fill="white"/>
                              </clipPath>
                           </defs>
                        </svg>
                     </Tooltip>
                  </div>
                  <div className={style.icon}>
                     <Tooltip title={translations.delivery[lang]} aria-label="delivery">

                        <svg className={CardContent.type && CardContent.type.includes('delivery') ? style.yellow : ''}
                             width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M0 13.7634C0 13.9684 0.143688 14.1293 0.348734 14.1293H0.905523C1.27964 13.3041 2.13143 12.6796 3.12045 12.6796C4.10951 12.6796 4.9611 13.3041 5.33542 14.1293H12.5727V11.1682H0V13.7634Z"
                              fill="#CCCCCC"/>
                           <path
                              d="M3.12025 13.4619C2.2138 13.4619 1.479 14.1967 1.479 15.1032C1.479 16.0096 2.2138 16.7444 3.12025 16.7444C4.02626 16.7434 4.76047 16.0092 4.76149 15.1032C4.76149 14.1968 4.02669 13.4619 3.12025 13.4619Z"
                              fill="#CCCCCC"/>
                           <path
                              d="M19.786 9.96193L18.2229 9.2749H13.3491V14.1292H14.2951C14.6695 13.304 15.521 12.6795 16.5101 12.6795C17.4991 12.6795 18.3509 13.304 18.725 14.1292H19.6508C19.8559 14.1292 19.9995 13.9683 19.9995 13.7632V10.315C20.0047 10.1654 19.9209 10.0268 19.786 9.96193Z"
                              fill="#CCCCCC"/>
                           <path
                              d="M16.6158 6.47607C16.4208 6.10204 16.0313 5.87015 15.6095 5.87685H13.3491V8.49817H17.6653L16.6158 6.47607Z"
                              fill="#CCCCCC"/>
                           <path
                              d="M11.4579 3.25562H1.10892C0.484703 3.25562 0 3.76949 0 4.39371V10.3915H12.5727V4.39371C12.5727 4.39196 12.5727 4.39021 12.5727 4.38847C12.5777 3.76784 12.0786 3.26062 11.4579 3.25562Z"
                              fill="#CCCCCC"/>
                           <path
                              d="M16.5098 13.4619C15.6034 13.462 14.8686 14.1968 14.8687 15.1032C14.8687 16.0096 15.6035 16.7444 16.5099 16.7444C17.416 16.7434 18.1501 16.0092 18.1511 15.1032V15.1031C18.1511 14.1967 17.4163 13.4619 16.5098 13.4619Z"
                              fill="#CCCCCC"/>
                        </svg>

                     </Tooltip>
                  </div>
                  <div className={style.icon}>
                     <Tooltip title={translations.clothes[lang]} aria-label="clothes">
                        <svg className={CardContent.type && CardContent.type.includes('clothes') ? style.yellow : ''}
                             width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <g clip-path="url(#clip0)">
                              <path d="M4.5752 19.9006H10.0003H15.4254V19.1772H4.5752V19.9006Z" fill="#CCCCCC"/>
                              <path
                                 d="M15.8948 1.63315C15.7141 1.49398 15.5085 1.39042 15.2891 1.328L13.1558 0.718373C13.0967 0.701442 13.0428 0.669717 12.9994 0.626203L12.4727 0.0996094C11.7109 0.505156 10.863 0.722091 10 0.732178C9.13707 0.722091 8.2891 0.505156 7.5273 0.0996094L7.00067 0.626203C6.95719 0.669756 6.90335 0.701482 6.84422 0.718412L4.71094 1.328C4.49151 1.39042 4.28597 1.49398 4.10519 1.63315L0 4.79109L2.48684 8.5219L3.17815 7.96877L1.38065 5.27286C1.27222 5.10676 1.31783 4.88429 1.4829 4.77424C1.64798 4.66419 1.87085 4.70766 1.98248 4.87163L3.74506 7.51516L3.98723 7.3214C4.09582 7.23453 4.24459 7.21764 4.36995 7.27789C4.49531 7.33814 4.57498 7.46492 4.57498 7.60397V18.4541H15.4251V7.60393C15.4251 7.46484 15.5048 7.3381 15.6302 7.27785C15.7555 7.2176 15.9043 7.23454 16.0129 7.32136L16.2551 7.51512L18.0176 4.87159C18.1288 4.70647 18.3525 4.66229 18.5182 4.77273C18.6839 4.88318 18.7291 5.10668 18.6195 5.27282L16.822 7.96873L17.5133 8.52187L20.0001 4.79105L15.8948 1.63315Z"
                                 fill="#CCCCCC"/>
                           </g>
                           <defs>
                              <clipPath id="clip0">
                                 <rect width="20" height="20" fill="white"/>
                              </clipPath>
                           </defs>
                        </svg>

                     </Tooltip>
                  </div>
               </div>
               <ShowMore {...props}>
                  <p className={style.info}>
                     {CardContent.description}
                  </p>
               </ShowMore>

               <div className={style.bottomInfo}>
                  <div style={{marginTop: '11px'}}>
                     <p className={style.contacts}><span> {translations.number[lang]}</span> : <a
                        href={`tel: +${CardContent.phone}`}> {CardContent.phone.replace(/\D+/g, '').replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, '+ ($1) $2 $3 $4')}</a>
                     </p>
                  </div>
                  <div>
                     {props.matchParams && props.matchParams.contenttype === 'shared-posts' ?
                        <Button btnType={btn === true ? 'Yellow' : 'Grey'}
                                clicked={handleClicked.bind(this, CardContent.id)}>
                           {translations.helped[lang]}
                        </Button>
                        :
                        <Button btnType={'Grey'} clicked={handleShared}>
                           {translations.postbyme[lang]}
                        </Button>
                     }
                  </div>
               </div>
            </Card> : ' '}

         <Snackbar open={success} handleOpen={handleSuccess} handleClose={handleClose}>
            <Alert elevation={6} variant="filled" onClose={handleClose}
                   severity="success">{translations.shared[lang]}</Alert>
         </Snackbar>
         <Snackbar open={error} handleOpen={handleError} handleClose={handleClose}>
            <Alert elevation={6} variant="filled" onClose={handleClose}
                   severity="error">{translations.error[lang]}</Alert>
         </Snackbar>
      </Aux>
   );
}