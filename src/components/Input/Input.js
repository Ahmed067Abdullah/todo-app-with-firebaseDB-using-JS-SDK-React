import React from 'react';

const input = (props) => <input type={props.type} className={props.className} value = {props.value} onClick={props.onClick} onChange = {props.onChange}/> 

export default input;