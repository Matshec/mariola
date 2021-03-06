import React, {Component} from 'react';
import axios from 'axios';
import "./cssData/ExchangeExtViev.css"


class ExchangeExtViev extends Component {
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.convertDay = this.convertDay.bind(this);
    }


    handleClick(e){
        axios.post("/api/exchanges",{
                forId: this.props.data.id
        }).then((r) => {console.log("this id: ",this.props.data.id);
        this.props.changeParSt(false)})
            .catch(err => {
            console.log('error: ', err.response);
            if(err.response.status === 409){
                alert('intencja wymiany już istnieje!')
            }
        });
        e.preventDefault()
    }
    render(){
       const data = this.props.data;
       console.log(data);
        const baseStartMins = data.start.getMinutes();
        const startMinutes = baseStartMins  < 10 ? baseStartMins + '0' : baseStartMins;
        const baseEndMins = data.end.getMinutes();
        const endMinutes = baseEndMins  < 10 ? baseEndMins + '0' : baseEndMins;
        return(
        <div>
            <p> nazwa: {data.title}<br/>
                grupa bazowa: {data.group}<br/>
                dzień: {this.convertDay(data.dayOfWeek)} <br/>
                od: {data.start.getHours() + ":"  + startMinutes + " "}
                do: {data.end.getHours() + ":"  + endMinutes}
            </p>
            <button className="SubmitBtt" onClick={this.handleClick}>Wymień sie!</button>
        </div>
        );
    }






    convertDay(day){
        switch (day) {
            case 0:
                day = "Niedziela";
                break;
            case 1:
                day = "Poniedziałek";
                break;
            case 2:
                day = "Wtorek";
                break;
            case 3:
                day = "Środa";
                break;
            case 4:
                day = "Czwartek";
                break;
            case 5:
                day = "Piątek";
                break;
            case 6:
                day = "Sobota";
        }
        return day;
    }

}

export  default  ExchangeExtViev;