import React , {Component} from 'react';
import Todos from '../../components/Todos/Todos';
import Input from '../../components/Input/Input';
import Spinner from '../../components/Spinner/Spinner';
import * as firebase from 'firebase';
import './Layout.css';

class Layout extends Component{
    constructor(){
        super();
        this.state = {
            input : '',
            todos : [],
            editing : false,
            loading : true
        }
        this.editingId = null;

        const config = {
            apiKey: "AIzaSyBbYLdLgS-QDx68vUc1PnENNvrcfstMuJw",
            authDomain: "todo-app-with-firebasedb.firebaseapp.com",
            databaseURL: "https://todo-app-with-firebasedb.firebaseio.com",
            projectId: "todo-app-with-firebasedb",
            storageBucket: "todo-app-with-firebasedb.appspot.com",
            messagingSenderId: "960398132063"
        };
        firebase.initializeApp(config);
        
        this.db = firebase.database();

        this.db.ref().child('todos').on('value', snapshot => {
            const todosObj = snapshot.val();
            const todos = [];
            for(let todo in todosObj){
                todos.push({id : todo , todo : todosObj[todo].todo})
            }
            this.setState({todos, loading : false })
        })
    }

    changeInputHandler = (input) => {
        this.setState({ input });
    } 

    saveTodoHandler = () => {
        const input = this.state.input;
        if(input !== ''){
            if(this.editingId !== null){
                this.db.ref(`todos/${this.editingId}/`).set({
                    todo : input
                })                
                this.setState({editing : false});
                this.editingId = null;
            }
            else{
                this.db.ref('todos/').push({
                    todo : input
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
    
    render (){
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
                <Todos
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
                
                {todos}
            </div>
        )
    }
}

export default Layout;