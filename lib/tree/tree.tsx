import * as React from "react";
import './tree.scss'
import TreeItem from "./tree-item";

const Tree: React.FC<TreeProps> = (prop) => {
    const onItemChange = (selected:string[]|string)=>{
        console.log('parent == ',selected )
        if(prop.multiple){
            prop.onChange(selected as string[])
        }else{
            prop.onChange(selected as string)
        }

    }
    return (
        <div>
            {prop.sourceData?.map(sub => {
                return (
                    <TreeItem item={sub} level={1} treeProps = {prop} key={sub.value} onItemChange={onItemChange}></TreeItem>
                )
            })}
        </div>
    )
}
export default Tree