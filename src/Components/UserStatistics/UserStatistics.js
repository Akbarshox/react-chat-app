import React, {useState, useEffect} from "react";
import Aux from '../../hoc/Wrapper';
import Container from '@material-ui/core/Container';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import style from './UserStatistics.module.css';
import Translations from '../../Translation.json'
import CountUp from 'react-countup';

// const styles = theme => ({});


function UserStatistics(props) {
   //   const { classes } = props;
   const [lang, setLang] = useState('ru');
   const [stat, setStat] = useState(null);
   useEffect(() => {
      setLang(props.match.params ? props.match.params.lang : 'ru');
      setStat(props.statistics);
   }, [props.match.params, props.statistics]);
   console.log(stat);
   return (
       <Aux>
          <div id="stat">
             <Grid container justify="center">
                <Grid item xl={6} lg={6} md={8} sm={12} xs={12}>
                   <div className={style.aboutUs}>
                      <h1>{Translations.statisticsTitle[lang]}</h1>
                   </div>
                </Grid>
             </Grid>
             <Grid container justify="center" spacing={4}>
                <Grid item xl={3} lg={3} md={4} sm={8} xs={12}>
                   <div className={style.block}>
                      
                      <p className={style.number}>
                         <CountUp
                             end={stat ? stat.number_of_volunteers : 0}
                             duration={5}
                         />
                      </p>
                      <p className={style.title}>
                         {Translations.numberOfVolunteer[lang]}
                      </p>
                   </div>
                </Grid>
                <Grid item xl={3} lg={3} md={4} sm={8} xs={12}>
                   <div className={style.block + ' ' + style.media}>
                      
                      <p className={style.number}>
                         <CountUp
                             end={stat ? stat.number_of_groups : 0}
                             duration={5}
                         />
                      
                      </p>
                      <p className={style.title}>
                         {Translations.numberOfGroups[lang]}
                      </p>
                   </div>
                </Grid>
                
                <Grid item xl={3} lg={3} md={4} sm={8} xs={12}>
                   <div className={style.block}>
                      <p className={style.number}>
                         <CountUp
                             end={stat ? stat.number_of_posts_total : 0}
                             duration={5}
                         />
                      </p>
                      <p className={style.title + ' ' + style.last_num}>
                         {Translations.numberOfApplicant[lang]}
                      </p>
                   </div>
                </Grid>
   
                <Grid item xl={3} lg={3} md={4} sm={8} xs={12}>
                   <div className={style.block}>
                      <p className={style.number}>
                         <CountUp
                             end={stat ? stat.number_of_posts_finished : 0}
                             duration={5}
                         />
                      </p>
                      <p className={style.title + ' ' + style.last_num}>
                         {Translations.closedPosts[lang]}
                      </p>
                   </div>
                </Grid>
             </Grid>
          </div>
       </Aux>
   );
}


export default (UserStatistics);