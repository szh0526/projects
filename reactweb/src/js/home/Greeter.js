import React,{Component} from 'react';
import config from './../common/config.json';
import styles from './../../css/home/index.css';

class Greetr extends Component{
    render(){
        return(
          <div className={styles.root}>
            {config.greetText}
          </div>
        );
    }
}
export default Greetr;
