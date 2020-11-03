import React from 'react';
import { useSelector } from 'react-redux';

import {
    selectSpeech,
} from './experienceSlice';


export default function Speech() {
  const speech = useSelector(selectSpeech);
  console.log("rendering speech", speech)
  return (
    <div>{speech}</div>
  );
  
}
