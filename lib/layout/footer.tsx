import React from 'react';
import {scopedClassMaker} from "../../lib/helpers/classes"
const sc = scopedClassMaker('gulu-layout')
interface Props extends React.HTMLAttributes<HTMLElement>{

}
const Footer: React.FunctionComponent<Props> = (props) => {
    let {className,...rest} = props
    return (
        <div className={sc('footer',{extra:className})} {...rest}>footer</div>
    )
};
export default Footer;