import * as React from "react";
import {scopedClassMaker} from "../helpers/classes";
import './tree.scss'
import {ChangeEventHandler} from "react";

export interface SourceDataItem {
    text: string,
    value: string,
    children?: SourceDataItem[]
}
type A = {
    selected: string[],
    multiple: true,
    onChange: (selected:string[])=> void
}
type B = {
    selected: string,
    multiple?: false,
    onChange: (selected: string) => void
}
type Props =  {
    sourceData: SourceDataItem[],
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
        const onchange:ChangeEventHandler<HTMLInputElement> = (e) => {
            let boolean = e.target.checked;
            let currentSelected;
            if(prop.multiple){
                if(boolean){
                    currentSelected = [...prop.selected, item.value]
                }else{
                    currentSelected = prop.selected.filter(sub => sub !== item.value)
                }
                prop.onChange(currentSelected)
            }else{
                if(boolean){
                    currentSelected = item.value
                }else{
                    currentSelected = ''
                }
                prop.onChange(currentSelected)
            }

        }
        return <div key={item.value} className={sc(classes)}>
            <div className={sc({'text': true})}>
                <input type="checkbox" onChange={onchange} checked={prop.multiple?prop.selected.includes(item.value):prop.selected === item.value} />
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