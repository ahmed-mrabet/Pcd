import React,{useEffect,useState} from 'react'

function backend() {
    const url="http://localhost:3000"
    const[backend,setBackendData]=useState([])
    useEffect(()=>{
        fetch(url +"/doctors")
        .then(res=>res.json())
        .then(data=>setBackendData(data))
    },[])

  return (
    <div>backend</div>
  )
}

export default backend