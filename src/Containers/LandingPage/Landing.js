import React, {useEffect, useState} from "react";
import Aux from '../../hoc/Wrapper';
import Container from '@material-ui/core/Container';
import Appbar from '../../Components/Appbar/Appbar'
import BeHero from '../../Components/BeHero/BeHero'
import About from '../../Components/AboutProject/About'
import ForSponsors from '../../Components/ForSponsors/ForSponsors'
import OurVolunters from '../../Components/OurVolunters/OurVolunters'
import ForVolunteers from '../../Components/ForVolunteers/ForVolunteers'
import Statistics from '../../Components/UserStatistics/UserStatistics'
import Footer from '../../Components/Footer/Footer'
import translations from '../../Translation.json';
import axios from '../../API/api'
import userImg from '../../assets/icons/user.svg'
import Snackbar from '../../Components/UI/Snackbar/Snackbar';
import Alert from '@material-ui/lab/Alert';

function Landing(props) {
   const [lang, setLang] = useState(props.match.params.lang ? props.match.params.lang : 'ru')
   const [volunteers, setList] = useState(null);
   const [statistics, setStat] = useState(null);
   const [error, setError] = useState(false);
   
   useEffect(() => {
      if (!volunteers || !statistics) {
         axios.get(`/misc/landing/`)
             .then(res => {
                let data = res.data.volunteers ? res.data.volunteers : [];
                for (let i = 0; i < data.length; i++) {
                   if (data[i].avatar) {
                      if (!(data[i].avatar).includes('https://api.birdamlik.uz'))
                         data[i].avatar = `https://api.birdamlik.uz${data[i].avatar}`
                   } else
                      data[i].avatar = userImg
                }
                setList(data);
                setStat(res.data.statistics);
             })
             .catch(err => {
                setError(true)
             })
      }
      setLang(props.match.params.lang)
   }, [props.match.params]);
   const handleError = () => {
      setError(true)
   }
   const handleClose = () => {
      
      setError(false)
   };
   const appbarData = [
      {
         css: "Simple",
         link: '',
         scroll: '#top',
         name: {
            en: "Main",
            ru: "Главная",
            uz: "Asosiy sahifa"
         },
         icon1: null,
         icon2: null,
      },
      {
         css: "Simple",
         link: '',
         scroll: '#stat',
         name: {
            en: "Statistics",
            ru: "Статистика",
            uz: "Statistika"
         },
         icon1: null,
         icon2: null,
      },
      {
         css: "Simple",
         link: '',
         scroll: '#about',
         name: {
            en: "About project",
            ru: "О проекте",
            uz: "Loyiha haqida"
         },
         icon1: null,
         icon2: null,
      },
      {
         css: "Simple",
         link: '',
         scroll: '#for_sponsors',
         name: {
            en: "",
            ru: "Спонсорам",
            uz: "Homiylar uchun"
         },
         icon1: null,
         icon2: null,
      },
      {
         css: "Yellow",
         link: `newReq`,
         scroll: '',
         name: {
            en: "",
            ru: "+ Нужна помощь",
            uz: "+ Yordam kerak"
         },
         icon1: null,
         icon2: null,
      },
      {
         css: "Outlined",
         link: `auth`,
         scroll: '',
         name: {
            en: "",
            ru: "Авторизация",
            uz: "Ro'yxatdan o'tish"
         },
         icon1: null,
         icon2: null,
      },
   ];
   return (
       <Aux>
          <Appbar json={appbarData} {...props}/>
          <Container maxWidth="lg" id='top'>
             <BeHero  {...props}/>
             <Statistics  {...props} statistics={statistics}/>
             <About {...props}/>
             <ForSponsors {...props}/>
             {/*<ForVolunteers {...props}/>*/}
          </Container>
          {/* <OurVolunters {...props} volunteers={volunteers}/> */}
          <Footer {...props}/>
          <Snackbar open={error} handleOpen={handleError} handleClose={handleClose}>
             <Alert elevation={6} variant="filled" onClose={handleClose}
                    severity="error">{translations.error[lang]}</Alert>
          </Snackbar>
       </Aux>
   );
   
}

export default Landing;