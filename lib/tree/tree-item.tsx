import * as React from "react";
import {useRef, useState} from "react";
import {ChangeEventHandler} from "react";
import {scopedClassMaker} from "../helpers/classes";
import useUpdate from "./useUpdate";

const scopedClassName = scopedClassMaker('g-ui-tree');
const sc = scopedClassName;

interface Props {
    item: SourceDataItem;
    level: number;
    treeProps: TreeProps;
}



const collectChildrenValues = (item: SourceDataItem):any => {
    // let result:string[] = [] // 递归+ 拍平
    // if(item.children){
    //     item.children.forEach((list)=>{
    //         result.push(list.value)
    //         if(list.children){
    //             result.push(...collectChildrenValues(list))
    //         }
    //     })
    // }
    // return result
    return flatten(item.children?.map(i=>[i.value,collectChildrenValues(i)]))
}
interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}

const flatten = (array?: RecursiveArray<string>): string[] => {
    if(!array){return  []}
    return array.reduce<string[]>((result, current) =>
        result.concat(typeof current === 'string' ? current : flatten(current)), [])
    // let result: string[] = []  // 拍平的for循环写法
    // array.forEach(i => {
    //     if (i instanceof Array) {
    //         result.push(...flatten(i))
    //     } else {
    //         result.push(i)
    //     }
    // })
    // return result
}

const TreeItem: React.FC<Props> = (prop) => {
    let {item, level, treeProps} = prop
    const [expand, setExpand] = useState(true)
    const classes = {
        [`level-${level}`]: true,
        'item': true
    }

    const onchange: ChangeEventHandler<HTMLInputElement> = (e) => {
        let boolean = e.target.checked;
        let currentSelected;
        const childrenValues = collectChildrenValues(item)
        if (treeProps.multiple) {
            if (boolean) {
                currentSelected = [...treeProps.selected, item.value, ...childrenValues]
            } else {
                currentSelected = treeProps.selected.filter(sub => ![...childrenValues, item.value].includes(sub)) // 取消选中连着子代一起取消选中
            }
            treeProps.onChange(currentSelected)
        } else {
            if (boolean) {
                currentSelected = item.value
            } else {
                currentSelected = ''
            }
            treeProps.onChange(currentSelected)
        }

    }
    const divRef = useRef<HTMLDivElement>(null)
    useUpdate(expand, () => {
        if(!divRef.current) return
        if (expand) { // 展开
            divRef.current.style.height = 'auto'
            let {height} = divRef.current.getBoundingClientRect()
            divRef.current.style.height = '0px'
            divRef.current.getBoundingClientRect() // 起间隔作用
            divRef.current.style.height = `${height}px`
            const transitionendListener = ()=>{
                if(!divRef.current)return
                divRef.current.style.height='' // 动画结束后将元素的style 还原
                divRef.current.removeEventListener('transitionend',transitionendListener)
            }
            divRef.current.addEventListener('transitionend',transitionendListener)
        } else { // 关闭
            let {height} = divRef.current.getBoundingClientRect()
            divRef.current.style.height = `${height}px`
            divRef.current.getBoundingClientRect() // 起间隔作用
            divRef.current.style.height = '0px'
            const transitionendListener = ()=>{
                if(!divRef.current)return
                divRef.current.style.height='' // 动画结束后将元素的style 还原
                divRef.current.classList.add('g-ui-tree-gone') // 由于style 还原，内容没有收起来，增加class用来控制隐藏
                divRef.current.removeEventListener('transitionend',transitionendListener)
            }
            divRef.current.addEventListener('transitionend',transitionendListener)
        }
    })
    const onCollapse = () => {
        setExpand(false)
    }
    const onExpand = () => {
        setExpand(true)
    }
    return (<div key={item.value} className={sc(classes)}>
        <div className={sc({'text': true})}>
            <input type="checkbox" onChange={onchange}
                   checked={treeProps.multiple ? treeProps.selected.includes(item.value) : treeProps.selected === item.value}/>
            {item.text}
            {
                item.children &&
                (expand ?
                    <span onClick={onCollapse}>-</span> :
                    <span onClick={onExpand}>+</span>)
            }
        </div>
        <div className={sc({'children': true, 'collapse': !expand})} ref={divRef}>
            {item.children?.map(sub => {
                return <TreeItem item={sub} level={level + 1} treeProps={treeProps} key={item.value}></TreeItem>
            })}
        </div>
    </div>)

}
export default TreeItem