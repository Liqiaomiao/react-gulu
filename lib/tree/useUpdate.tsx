import {useEffect, useRef} from "react";
// import {useEffect, useState} from 'react';
const useUpdate = (dep:boolean,fn:()=>void)=>{
    const isFirst = useRef(true)
    useEffect(()=>{
        if(isFirst.current){
            isFirst.current = false
            return;
        }
        fn()

    },[dep]) // 仅在dep更改时更新
}
// const useUpdate = (dep:boolean,fn:()=>void)=>{
//     const [count,setCount] = useState(0)
//     useEffect(() => {
//         setCount(x=>x+1)
//     }, [dep])
//     useEffect(() => {
//         if (count >1) {
//             fn() // created的时候不执行，updated的时候执行
//         }
//     }, [count])
// }
export default useUpdate