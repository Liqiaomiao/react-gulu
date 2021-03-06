import * as React from "react";
import Tree from './tree';
import {useState} from "react";


const TreeExample: React.FC = () => {
    const [array] = useState([
        {
            text: '1',
            value: '1',
            children: [
                {
                    text: '1.1', value: '1.1',
                    children: [{
                        text: '1.1.1',
                        value: '1.1.1'
                    },
                        {
                            text: '1.1.2',
                            value: '1.1.2'
                        }
                    ]
                }
            ]
        },
        {
            text: '2',
            value: '2',
            children: [{
                text: '2.1', value: '2.1',
                children: [{
                    text: '2.1.1',
                    value: '2.1.1'
                }]
            }]
        }
    ])
    // const [selected,setSelected] = useState('1')
    const [selected, setSelected] = useState<string[]>([])
    return (
        <div>
            Tree show
            <span>{selected}</span>
            <Tree sourceData={array} onChange={(value) => {setSelected(value)}} selected={selected} multiple={true}/>
        </div>
    )
}
export default TreeExample