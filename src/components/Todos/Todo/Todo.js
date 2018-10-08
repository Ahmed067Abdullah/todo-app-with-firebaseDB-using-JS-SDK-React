import React from 'react';
import Input from '../../Input/Input';

const todo = (props) => {
    return( 
        <li className="list-group-item" style = {{backgroundColor : 'rgb(177, 203, 200)'}}>
            <span className = "todo-text">{props.todo}</span>
            <span className = "todo-controls">
                <Input className="btn btn-warning" value="Edit" type="button" onClick = {props.edit}/>
                <Input className="btn btn-danger" value="Delete" type="button" onClick = {props.delete}/>
            </span>
        </li>
    )
}

export default todo; 