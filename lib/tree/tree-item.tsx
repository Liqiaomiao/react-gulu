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
    onItemChange: (values: string[] | string) => void;
}


const collectChildrenValues = (item: SourceDataItem): any => {
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
    // let result = flatten(item.children?.map(i=>[i.value,collectChildrenValues(i)]))
    if (!item.children) {
        return []
    }
    return flatten(item.children.map(i => [i.value, collectChildrenValues(i)]))
}

interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {
}

const flatten = (array: RecursiveArray<string>): string[] => {
    return array?.reduce<string[]>((result, current) =>
        result.concat(current instanceof Array ? flatten(current) : current), [])
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
    const divRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    function intersect<T>(array1: T[], array2: T[]): T[] {
        const result: T[] = []
        for (let i = 0; i < array1.length; i++) {
            if (array2.indexOf(array1[i]) > -1) {
                result.push(array1[i])
            }
        }
        return result
    }

    const onchange: ChangeEventHandler<HTMLInputElement> = (e) => {
        let boolean = e.target.checked;
        let currentSelected: string[] | string;
        const childrenValues = collectChildrenValues(item)
        if (treeProps.multiple) {
            if (boolean) {
                currentSelected = [...treeProps.selected, item.value, ...childrenValues]
            } else {
                currentSelected = treeProps.selected.filter(sub => ![item.value, ...childrenValues].includes(sub)) // 取消选中连着子代一起取消选中
            }
            prop.onItemChange(currentSelected)
        } else {
            if (boolean) {
                currentSelected = item.value
            } else {
                currentSelected = ''
            }
            prop.onItemChange(currentSelected)
        }

    }
    const onItemChange = (values: string[]) => {
        const childrenValues = collectChildrenValues(item)
        const common = intersect(collectChildrenValues(item), values) // item中的子代有被选中
        if (common.length > 0) {
            let last = [...values, item.value]
            last = Array.from(new Set(last))
            prop.onItemChange(last) // 向上层层通知，子代被选中所以自己需要被选中
            if (common.length === childrenValues.length) {
                inputRef.current!.indeterminate = false
            } else {
                inputRef.current!.indeterminate = true
            }
        } else {
            let removed = values.filter(selected => selected != item.value)
            prop.onItemChange(removed)
            inputRef.current!.indeterminate = false
        }
    }

    useUpdate(expand, () => {
        if (!divRef.current) return
        if (expand) { // 展开
            divRef.current.style.height = 'auto'
            let {height} = divRef.current.getBoundingClientRect()
            divRef.current.style.height = '0px'
            divRef.current.getBoundingClientRect() // 起间隔作用
            divRef.current.style.height = `${height}px`
            const transitionendListener = () => {
                if (!divRef.current) return
                divRef.current.style.height = '' // 动画结束后将元素的style 还原
                divRef.current.removeEventListener('transitionend', transitionendListener)
            }
            divRef.current.addEventListener('transitionend', transitionendListener)
        } else { // 关闭
            let {height} = divRef.current.getBoundingClientRect()
            divRef.current.style.height = `${height}px`
            divRef.current.getBoundingClientRect() // 起间隔作用
            divRef.current.style.height = '0px'
            const transitionendListener = () => {
                if (!divRef.current) return
                divRef.current.style.height = '' // 动画结束后将元素的style 还原
                divRef.current.classList.add('g-ui-tree-gone') // 由于style 还原，内容没有收起来，增加class用来控制隐藏
                divRef.current.removeEventListener('transitionend', transitionendListener)
            }
            divRef.current.addEventListener('transitionend', transitionendListener)
        }
    })
    const onCollapse = () => {
        setExpand(false)
    }
    const onExpand = () => {
        setExpand(true)
    }
    return (<div className={sc(classes)} title={`${item.value}`}>
        <div className={sc({'text': true})}>
            <input type="checkbox" onChange={onchange} ref={inputRef}
                   checked={treeProps.multiple ? treeProps.selected.includes(item.value) : treeProps.selected === item.value}/>
            {item.value}
            {
                item.children &&
                (expand ?
                    <span onClick={onCollapse}>-</span> :
                    <span onClick={onExpand}>+</span>)
            }
        </div>
        <div className={sc({'children': true, 'collapse': !expand})} ref={divRef}>
            {item.children?.map(sub => {
                return <TreeItem item={sub} level={level + 1} treeProps={treeProps} onItemChange={onItemChange}
                                 key={`${sub.value}-item`}
                ></TreeItem>
            })}
        </div>
    </div>)

}
export default TreeItem