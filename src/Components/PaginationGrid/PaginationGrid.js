import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import style from './PaginationGrid.module.css';
import Aux from '../../hoc/Wrapper';
import LeftSidebar from '../LeftSideBar/LeftSidebar'
// import RightContent from '../RightContentInfo/ImgInfo';
import PaginationContent from '../PaginationContent/PaginationContent';
import {sidebarJson} from '../LeftSideBar/LeftSidebarJson';
import translations from '../../Translation.json'
import axios from '../../API/api';

export default function FeedContent(props) {
   const [add, setAdd] = useState(null)
   const [paginateContent, setFeedContent] = useState(props.content);
   const [matchParams, setMatchParams] = useState(props.match.params);
   const matches = useMediaQuery('(max-width:959px)');
   useEffect(() => {
      setFeedContent(props.content);
      setMatchParams(props.match.params);
      if (!add) {
         axios.get('misc/advertisement/')
             .then(res => {
                setAdd(res.data.results[0])
             })
             .catch(err => {
             
             })
      }
   }, [props.content, props.match]);
   
   return (
       <Aux>
          {matchParams.contenttype === 'progress' ? <Grid row xl={12} lg={12} md={12} sm={12} xs={12}>
             <h2 className={style.header}>{translations.myProfile[matchParams.lang]}</h2>
          </Grid> : ''}
          {sidebarJson.map(e => matchParams.user && matchParams.contenttype ? matchParams.user === e.userType && e.contentType.includes(matchParams.contenttype) ?
              <LeftSidebar matchParams={matchParams} sidebarData={e.data} {...props}/> : '' : '')}
          <PaginationContent {...props} content={paginateContent} matchParams={matchParams}/>
          {matches === false ?
              <Grid row xl={3} lg={3} md={3} sm={12} xs={12}>
                 {add ? <div className={style.ads}>
                    <a href={add.link} target="_blank">
                       <img src={add.image}/>
                    </a>
                 </div> : ''}
              </Grid>
              : ''}
          {/*<RightContent matchParams={matchParams}/>*/}
       </Aux>
   );
}