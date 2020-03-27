import * as React from "react";
import {scopedClassMaker} from "../helpers/classes";
import './tree.scss'

export interface SourceDataItem {
    text: string,
    value: string,
    children?: SourceDataItem[]
}
type A = {
    selected: string[],
    multiple: true
}
type B = {
    selected: string,
    multiple?: false
}
type Props =  {
    sourceData: SourceDataItem[],
    onChange: (item:SourceDataItem,bool:boolean) => void
} & (A|B)

const scopedClassName = scopedClassMaker('g-ui-tree');
const sc = scopedClassName;
const Tree: React.FC<Props> = (prop) => {
    const renderItem = (
        item: SourceDataItem,
        level = 1) => {
        const classes = {
            [`level-${level}`]: true,
            'item': true
        }
        return <div key={item.value} className={sc(classes)}>
            <div className={sc({'text': true})}>
                <input type="checkbox" onChange={(e)=>prop.onChange(item, e.target.checked)} checked={prop.selected.includes(item.value)} />
                {item.text}
            </div>
            {item.children?.map(sub => {
                return renderItem(sub,level + 1)
            })}
        </div>
    }
    return (
        <div>
            {prop.sourceData?.map(sub => {
                return (
                    renderItem(sub,1)
                )
            })}
        </div>
    )
}
export default Tree