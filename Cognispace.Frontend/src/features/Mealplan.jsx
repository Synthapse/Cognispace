import React from 'react'
import '../style/Meatplan.css'

//**React icons */
import {CgSearch} from 'react-icons/cg'

const Mealplan = () => {
  return (
    <>
    <div className='p-4 m-1'>
        <CgSearch size={40}/>
    </div>
    <div className='container'>
        
      
      <div className="head d-flex mb-3">
        <div className='section-1'>Today</div>
        <div className='ms-5 section-2'>Tomorrow</div>
      </div>

        <ul className='list-unstyled mt-5'>
            <li>Breakfast</li>
            <li>Brunch</li>
            <li>Dinner</li>
            <li>Desert</li>
            <li>Supper</li>
            <li>Drinks</li>
        </ul>

    </div>
    </>
  )
}

export default Mealplan
