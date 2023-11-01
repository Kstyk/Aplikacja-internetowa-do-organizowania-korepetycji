import React from 'react'
import useAxios from '../utils/useAxios'
import { useLocation, useNavigate, Link } from 'react-router-dom'

const BuyClassesPageAfterAsk = () => {
  document.title = 'Zakup zajęcia'

  const nav = useNavigate()
  const api = useAxios()
  const location = useLocation()
  const { address } = location?.state || {}
  console.log(address)
  return <div>BuyClassesPageAfterAsk</div>
}

export default BuyClassesPageAfterAsk
