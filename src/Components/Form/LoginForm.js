import React, { useState, useEffect } from 'react';
import Form from "./Form";
import translations from '../../Translation.json';

export default function LoginForm(props) {
  const [lang, setLang] = useState(props.match.params.lang ? props.match.params.lang : 'ru')
  useEffect(() => {
    setLang(props.match.params.lang ? props.match.params.lang : 'ru')
 }, [props.match.params.lang]);
  
   return (
       <div>
         
       </div>
   );
}