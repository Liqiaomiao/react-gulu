import * as React from "react";
import Tree,{SourceDataItem} from './tree';
import {useState} from "react";


const TreeExample: React.FC = () => {
    const [array] = useState([
        {
            text: '1',
            value: '1',
            children: [{
                text: '1.1', value: '1.1',
                children: [{
                    text:'1.1.1',
                    value: '1.1.1'
                }]
            }]
        },
        {
            text: '2',
            value: '2',
            children: [{
                text: '2.1', value: '2.1',
                children: [{
                    text:'2.1.1',
                    value: '2.1.1.3'
                }]
            }]
        }
    ])
    const [selected,setSelected] = useState(['1','1.1'])
    const onChange = (item:SourceDataItem,bool:boolean)=>{
        if(bool){
            setSelected([...selected,item.value])
        }else{
            setSelected(selected.filter(sub => sub !== item.value))
        }
    }
    return (
        <div>
            Tree show
            <Tree sourceData={array} onChange={onChange} selected={selected} multiple={true}/>
        </div>
    )
}
export default TreeExample