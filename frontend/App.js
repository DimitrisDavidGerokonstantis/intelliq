import React, {Component} from "react"
import data from "./data"
import Finished from "./Finished"

class App extends Component{
  constructor(){
    super()
    this.state = {
      id : 1,
      count : 1,
      question : data[0].text ,
      option1 : data[0].option1,
      option2 : data[0].option2,
      letter : "",
      answer : "",
      completed: false
    }
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)

  }

  handleChange(event){
    const {name, value} = event.target
    this.setState({
      [name] : value
    })
  }

  handleSubmit(event){
    event.preventDefault()
    this.state.id === 2 ?
    this.setState({completed : true})
    :
  (this.state.answer === "a"  || this.state.answer === "b") ?
  this.state.answer === "a" ?
    this.setState ({
      id : this.state.id + 1,
      question : data[1].text,
      option1 : data[1].option1,
      option2 : data[1].option2
    })
   :
    this.setState({
      id : 2,
      question : data[2].text,
      option1 : data[2].option1,
      option2 : data[2].option2
    })
  : event.preventDefault()
}


  render(){
    return(
      this.state.completed === false ?
      <div className = "begin">
      <h1 className = "title">Question  {this.state.id} : {this.state.question}</h1>
      <br />
      <form className = "form" onSubmit = {this.handleSubmit}>
      <label className = "option">
        <input type = "radio" name = "answer" value = "a" onChange = {this.handleChange} /> {this.state.option1}
      </label>
      <br />

      <label className = "option">
        <input type = "radio" name = "answer" value = "b" onChange = {this.handleChange} /> {this.state.option2}
      </label>
      <br/>
      <button className = "submit">Submit</button>
      </form>
      </div>

   :
   <Finished />

    )
  }
}
export default App
