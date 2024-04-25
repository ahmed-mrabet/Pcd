import React, { useState, useEffect } from 'react';
import PrescriptionSelector from '../selector';
import "./pharmacist.css"
function pharmacist({ userRole,userAddress }) {
  


  return (
      <div className='PharmacistBox'>
        <div className='SmallerBox'>
                  <PrescriptionSelector userRole={userRole} userAddress={userAddress} />
        </div>
      </div>
  )
}

export default pharmacist;
    