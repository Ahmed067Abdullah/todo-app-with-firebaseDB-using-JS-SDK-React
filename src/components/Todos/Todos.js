import React from 'react';
import Todo from './Todo/Todo';
import './Todos.css';

const todos = (props) => {

    const todos = props.todos.map((todoObj,index) => {
            return( 
                <Todo 
                    key = {index}
                    todo = {todoObj.todo}
                    edit = {() => props.editTodo(todoObj.id)}
                    delete = {() => props.deleteTodo(todoObj.id)}
                />)
        })
    return(
        <ol className="list-group todos">
            {todos}
        </ol>
    )
}

export default todos; 