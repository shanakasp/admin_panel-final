import React,{useState} from 'react'

import Template from '../components/Template/Template'
import Mainbody from '../components/MainBody/Mainbody'
import Header from '../components/Header/Header'
const Homepage = () => {
  const [search,setSearch] = useState("");

  return (
    <div > 
      <Header search={search} setSearch={setSearch}/>
      {/* <Template search={search}/> */}
      <Mainbody/>
    </div>
  )
}

export default Homepage