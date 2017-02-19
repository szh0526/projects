import React,{Component} from 'react';
import config from './../common/config';
import styles from './../../css/index/index';

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
