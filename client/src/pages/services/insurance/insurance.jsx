import React, { useState, useEffect } from 'react';
import PrescriptionSelector from '../selector';
import './insurance.css'
function Insurance({ userRole,userAddress }) {
  


  return (
    <div className='insuranceBox'>
        <div className='SmallerBox'>
          <PrescriptionSelector userRole={userRole} userAddress={userAddress} />
        </div>
     </div>
  )
}

export default Insurance;
