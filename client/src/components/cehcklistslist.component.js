import { useEffect, useState } from "react"

const CheckilistList = (props)=>{
    const {checklists} = props

    const DBchek = checklists[0]

    /* const [DriveSpace, setDriveSpace] = useState(DBchek ? DBchek.DriveSpace : "");
    const [DisableIPV6, setDisableIPV6] = useState(DBchek ? DBchek.DisableIPV6 : "");
    const [bestperformance, setbestperformance] = useState(DBchek ? DBchek.BestPerformance : "");
   
 */
    

    const filterData = (arr) => {
        const filteredData = {};
    
        for (const key in arr) {
          if (!key.startsWith('_') && key !== 'createdAt' && key !== 'updatedAt') {
            filteredData[key] = arr[key];
          }
        }
    
        return(filteredData)
      };

    const filteredData =  filterData(DBchek)


  const [checkboxValues, setCheckboxValues] = useState(filteredData);


    const handleCheckboxChange = (item) => {
        setCheckboxValues((prevValues) => ({
          ...prevValues,
          [item]: !prevValues[item], // Toggle the checkbox value
        }));
        console.log(checkboxValues)
      };

    
    return(
        <div className="container m-5 text-center">
            <div className="checklistcontainer">
           {
            DBchek?
            Object.keys(filteredData).map((item, idx) => { 
                return(
                    <div key={`div0 ${idx}`} className="d-flex bg-warning m-3 p-3 border border-3 border-dark rounded-3"  >
                    <label key={`div1 ${idx}`} className="col-3"> {item}</label>
                    <input type="checkbox" className="col-3" checked={checkboxValues[item]} onChange={() => handleCheckboxChange(item)}/>     
                    <input type="file" accept="image/*" className="col-3"/>               
                    </div>

                )
            })
            :''
           }

           </div>


        </div>
    )

} 

export default CheckilistList;