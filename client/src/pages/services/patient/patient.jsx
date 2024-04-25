import React, { useState, useEffect } from 'react';
import PrescriptionSelector from '../selector';
import "./patient.css"
function Patient({ userRole,userAddress }) {
  


  return (
    <div className='PatientBox'>
        <div className='SmallerBox'>
          <PrescriptionSelector userRole={userRole} userAddress={userAddress} />
        </div>
     </div>
  )
}

export default Patient;
