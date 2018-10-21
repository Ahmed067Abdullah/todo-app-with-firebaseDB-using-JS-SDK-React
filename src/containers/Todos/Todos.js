import React , {Component} from 'react';
import * as firebase from 'firebase';
import {connect} from 'react-redux';

import TodosList from '../../components/TodosList/TodosList';
import Input from '../../components/Input/Input';
import Spinner from '../../components/Spinner/Spinner';
import * as actions from '../../store/actions/index';

class Todos extends Component{
    constructor(){
        super();
        console.log("asds")
        this.state = {
            input : '',
            editing : false,
            loading : true
        }
        this.editingId = null;
        
        this.db = firebase.database();
    }

    componentDidMount(){
        this.db.ref()
        .child('todos')
        .orderByChild('uid')
        .equalTo(this.props.uid)
        .on('value', snapshot => {
            const todosObj = snapshot.val();
            const todos = [];
            for(let todo in todosObj){
                todos.push({id : todo , todo : todosObj[todo].todo})
            }
            this.setState({todos, loading : false })
            this.props.onSetTodos(todos);
        })
    }

    changeInputHandler = (input) => {
        this.setState({ input });
    } 

    saveTodoHandler = () => {
        const input = this.state.input;
        if(input !== ''){
            if(this.editingId !== null){
                let updateObj = {};
                updateObj[`todos/${this.editingId}/todo`] = input;
                this.db.ref().update(updateObj)                
                this.setState({editing : false});
                this.editingId = null;
            }
            else{
                this.db.ref('todos/').push({
                    todo : input,
                    uid : this.props.uid
                });
            }
            this.setState({ input : '' });
        }
    }

    deleteTodoHandler = (id) => {
        this.db.ref(`todos/${id}`).remove();
        if(id === this.editingId){
            this.editingId = null;
            this.setState ({
                input : '',
                editing : false});
        }
    }

    deleteAllTodosHandler = () => {
        this.db.ref('todos/').remove();
        this.setState({ editing : false });
        this.editingId = null
    }

    editTodoHandler = (id) => {
        const todo = this.state.todos.find(todo => {
            return todo.id === id;
        });
        this.setState({
            input : todo.todo,
            editing : true
        });
        this.editingId = todo.id;
    }

    logoutHandler = () => {
        this.props.history.replace('/logout')
    }
    
    render (){
        console.log(this.props)
        let btnValue = "Add";
        let btnClass = "primary";
        if(this.state.editing){
            btnValue = "Update";
            btnClass = "warning";
        }
        btnClass = "btn btn-"+btnClass;
        
        let deleteAllButton = null;
        if(this.state.todos){
            if(this.state.todos.length > 1){
                deleteAllButton = 
                <Input 
                    type= "button" 
                    onClick={this.deleteAllTodosHandler} 
                    value = "Delete All" 
                    className="btn btn-danger"/>
            }
        }
        let todos = null;
        if(this.state.loading)
            todos = <Spinner/>
        else if(this.state.todos && this.state.todos.length > 0){
            todos = (
                <TodosList
                    todos = {this.state.todos}
                    editTodo = {this.editTodoHandler}
                    deleteTodo = {this.deleteTodoHandler}/>
            )
        } 
        else
            todos = <p className = "no-todo-msg">No Recent Todos</p>   

        return (
            <div className = "main-div">
                <h1 className="display-4">Todo App</h1>
                <h5 className = "heading">With Firebase's Real Time DB</h5>
                <Input 
                    type = "text" 
                    value ={this.state.input} 
                    className="form-control input-field"
                    onChange ={(event) => this.changeInputHandler(event.target.value)} />

                <Input 
                    type= "button" 
                    onClick={this.saveTodoHandler} 
                    value = {btnValue} 
                    className={btnClass}/>

                {deleteAllButton}
                
                {this.props.isLoggedIn && !this.state.loading ?                 
                <Input 
                    type= "button" 
                    onClick={this.logoutHandler} 
                    value = "Logout" 
                    className="btn btn-danger"/> : null}

                {todos}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        isLoggedIn : state.auth.isLoggedIn,
        uid : state.auth.uid
    }   
}

const mapDispatchToProps = dispatch => {
    return{
        onSetTodos : (todos) => dispatch(actions.setTodos(todos))
    }   
}

export default connect(mapStateToProps, mapDispatchToProps)(Todos);