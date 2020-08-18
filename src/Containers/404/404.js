import React, { useEffect, useState } from 'react';
import Aux from '../../hoc/Wrapper';
import style from './nf.module.css';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Button from '../../Components/UI/Buttons/Buttons'
import translations from '../../Translation.json'



function Nopage({ match }) {
  // console.log(match);
  // const [lang, setLang] = useState(match.params.lang ? match.params.lang : 'ru')
  // useEffect(() => {
  //   setLang(match.params.lang ? match.params.lang : 'ru')
  // }, [match.params.lang]);
  return (
    <Aux>
      <div className={style.notFoundContent}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid item xl={3} lg={3} md={4} sm={12} xs={12} >
              <p className={style.nfinfo}>{translations.notFound['ru']}</p>
              <h1>{translations.noPage['ru']}</h1>
              <p className={style.return}>{translations.goMainPage['ru']} <Link to="/">{translations.goMainPage.mainPage['ru']}</Link></p>
              <Link to={"/ru/auth"}><Button btnType="Yellow2" >{translations.getAuth['ru']}</Button></Link>
            </Grid>
          </Grid>
        </Container>
      </div>
    </Aux>
  );
}

export default Nopage;