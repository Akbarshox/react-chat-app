import React, {useEffect} from 'react';
import Button from '../UI/Buttons/Buttons';
import Dialog from '@material-ui/core/Dialog';
import {YMaps, Map, Placemark, GeolocationControl, TypeSelector} from "react-yandex-maps";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import translations from "../../Translation";

export default function Maps(lang) {
   const [open, setOpen] = React.useState(false);
   const [lan, setLang] = React.useState(lang.lang);
   
   useEffect(() => {
      setLang(lang.lang)
   }, [lang.lang])
   const handleClickOpen = () => {
      setOpen(true);
   };
   
   const handleClose = () => {
      setOpen(false);
   };
   
   return (
       <div style={{width: '100%'}}>
          <Button btnType='passiveButton' clicked={handleClickOpen}>
             Открыть карту
          </Button>
          <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
             <YMaps query={{apikey: 'a611d201-19b9-4184-98c3-e7d6c4de6c1d'}}>
                <Map
                    defaultState={{
                       center: [	41.311081, 69.240562],
                       zoom: 10,
                       controls: [],
                    }}
                    width={600}
                    height={400}
                >
                   <GeolocationControl options={{float: 'right'}} onLoad={(data) => console.log(data)} />
                </Map>
             </YMaps>
          </Dialog>
       </div>
   );
}