import * as React from "react";
import {scopedClassMaker} from "../helpers/classes";
import './tree.scss'

interface SourceDataItem {
    text: string,
    value: string,
    children?: SourceDataItem[]
}

interface Props {
    sourceData: SourceDataItem[],
    onChange: () => void
}

const scopedClassName = scopedClassMaker('g-ui-tree');
const sc = scopedClassName;
const renderItem = (item: SourceDataItem,onChange: ()=>void,level = 1) => {
    const classes = {
        [`level-${level}`]: true,
        'item': true
    }
    return <div key={item.value} className={sc(classes)}>
        <div className={sc({'text': true})}>
            <input type="checkbox" onChange={onChange}/>
            {item.text}
        </div>
        {item.children?.map(sub => {
            return renderItem(sub, onChange,level + 1)
        })}
    </div>
}
const Tree: React.FC<Props> = (prop) => {
    return (
        <div>
            {prop.sourceData?.map(sub => {
                return (
                    renderItem(sub,prop.onChange,1)
                )
            })}
        </div>
    )
}
export default Tree