import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";

import { jsPDF } from "jspdf";

const socket = io("http://localhost:8000");

const DbChecklist = (props) =>{
    const serverid = useParams()
   /*  console.log("serverid: " +serverid.id) */
    const {checklist} = props
    const navigate = useNavigate()
    /* console.log(checklist) */
    const [imageFile, setImageFile] = useState(null);

    const [checklistresults , setchecklistresults] = useState({
        DriveSpace:false,
        DisableIPV6:false,
        BestPerformace:{
            VisualEffects:false,
            BackgroundServices:false
        },
        owner:serverid.id
   });

    useEffect(() => {
        // Only set the initial state if the checklist prop is available
        if (checklist) {
          setchecklistresults(checklist);
        }
      }, [checklist]);

    useEffect(() => {
        const updateEventListener = (data) => {
          // Check if the data is different from the current state before updating
          if (JSON.stringify(data) !== JSON.stringify(checklistresults)) {
            setchecklistresults(data);
          }
        };
      
        socket.on("updateEvent", updateEventListener);
      
        return () => {
          // Clean up the event listener when the component unmounts
          socket.off("updateEvent", updateEventListener);
        };
      }, [checklistresults]);

      
 
      const handleDriveSpaceChange = (e) => {
        const updatedValue = e.target.checked;
        setchecklistresults((prevChecklist) => ({
          ...prevChecklist,
          DriveSpace: updatedValue,
        }));
        
       /*  // Emit the updateEvent to the server with the updated value
        socket.emit("eventFromClient", { DriveSpace: updatedValue }); */
      };

      const handleDisableIPV6Change = (e) => {
        const updatedValue = e.target.checked;
        setchecklistresults((prevChecklist) => ({
          ...prevChecklist,
          DisableIPV6: updatedValue,
        }));
    
        /* // Emit the updateEvent to the server with the updated value
        socket.emit("eventFromClient", { DisableIPV6: updatedValue }); */
      };

      useEffect(() => {
        // Emit the updateEvent whenever checklistresults changes
        /* console.log('emiting event'); */
        /* socket.emit("updateEvent", checklistresults); */
        socket.emit("eventFromClient", checklistresults, (response) => {
            /* console.log("Server acknowledged the updateEvent with response:", response); */
          });
      }, [checklistresults]);
      
      // Repeat the same pattern for handleVisualEffectsChange and handleBackgroundServicesChange
      

      
      // Repeat the same pattern for handleVisualEffectsChange and handleBackgroundServicesChange
      

    const handleVisualEffectsChange = (e) => {
        const { name, checked } = e.target;
      
        setchecklistresults((prevChecklist) => {
          // Create a shallow copy of the checklistresults
          const updatedChecklist = { ...prevChecklist };
      
          // Create a shallow copy of BestPerformance
          const updatedBestPerformance = { ...updatedChecklist.BestPerformace };
      
          // Update the VisualEffects property
          updatedBestPerformance.VisualEffects = checked;
      
          // Update the BestPerformance property in the checklistresults
          updatedChecklist.BestPerformace = updatedBestPerformance;
      
          return updatedChecklist;
        });
      };
      
      
  const handleBackgroundServicesChange = (e) => {
    const { name, checked } = e.target;

    setchecklistresults((prevChecklist) => {
      // Create a shallow copy of the checklistresults
      const updatedChecklist = { ...prevChecklist };

      // Create a shallow copy of BestPerformance
      const updatedBestPerformance = { ...updatedChecklist.BestPerformace };

      // Update the BackgroundServices property
      updatedBestPerformance.BackgroundServices = checked;

      // Update the BestPerformance property in the checklistresults
      updatedChecklist.BestPerformace = updatedBestPerformance;

      return updatedChecklist;
    });
  };

const submitchanges = ()=>{
    const instance = axios.create({baseURL: 'http://localhost:8000', withCredentials: true})
    
    try{
    instance.post('/api/v2/servercheck/'+checklist._id,
        {
            DriveSpace:checklistresults.DriveSpace,
            DisableIPV6:checklistresults.DisableIPV6,
            BestPerformace:{
                VisualEffects:checklistresults.BestPerformace.VisualEffects,
                BackgroundServices:checklistresults.BestPerformace.BackgroundServices
            }
        }
        /* {DriveSpace:false} */
    ).then((result) =>{
        console.log(result)

        const doc = new jsPDF();
        doc.text(`

        Super Nuevo PDF
      ---------------------------------
          DriveSpace:${checklistresults.DriveSpace},
          DisableIPV6:${checklistresults.DisableIPV6},
          BestPerformace:{
              VisualEffects:${checklistresults.BestPerformace.VisualEffects},
              BackgroundServices:${checklistresults.BestPerformace.BackgroundServices}
          }
          ----------------------------
              `, 10, 10);
        doc.save("a4.pdf"); // will save the file in the current working directory
        
        navigate(-1)
    }).catch(error => console.log(error))}
    catch(error){console.log(error)
        instance.post('/api/v2/servercheck/',
        {
            DriveSpace:checklistresults.DriveSpace,
            DisableIPV6:checklistresults.DisableIPV6,
            BestPerformace:{
                VisualEffects:checklistresults.BestPerformace.VisualEffects,
                BackgroundServices:checklistresults.BestPerformace.BackgroundServices
            },
            owner:serverid.id
        })
        navigate('/clients')
    }
}

const deleteserver = ()=>{
    const instance = axios.create({baseURL: 'http://localhost:8000', withCredentials: true})
    
    try{
        instance.delete('/api/v2/servercheck/'+checklist._id)
        instance.delete('/api/v2/server/'+serverid.id)
        navigate('/clients')
    }
    catch{
        instance.delete('/api/v2/server/'+serverid.id)
        navigate('/clients')
    }
}

const handleImageUpload = (e) => {
  const file = e.target.files[0];  
  if (file) {
    // You can perform any additional checks/validation here if needed
    setImageFile(file);
  }
};


 // Function to submit the uploaded image to the server
 const submitImageToServer = (e) => {
  const imageName=e.target.name
  if (imageFile) {

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 to month (0-based) and pad with '0' if needed
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
    
    
    const fileExtension = imageFile.name.split('.').pop(); // Get the file extension
    const newImageName = `${serverid.id}_${formattedDate}_${imageName}.${fileExtension}`;

    const formData = new FormData();
    formData.append('image', imageFile, newImageName);
    const instance = axios.create({baseURL: 'http://localhost:8000', withCredentials: true})
    instance.post('/api/image/v3/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    )
      .then((response) => {
        // Handle the server response here
        console.log(response.statusText)
        if (response.statusText === 'OK') {
          // Image upload successful
          console.log('Image uploaded successfully');
          // You can reset the imageFile state if needed
          setImageFile(null);
          alert("Image uploaded successfully");

        } else {
          // Handle the error case
          console.error('Image upload failed');
        }
      })
      .catch((error) => {
        console.error('Image upload error:', error);
      });
  }
};
    
    return(
        checklistresults?
        <div className="bigdiv">

            <div className="checklistwrapper"  >
            <label  className="checklistlabel"> DriveSpace</label>
            <input type="checkbox" className="checklistcheckbox" 
            checked={checklistresults.DriveSpace}
            name='DriveSpace'
            onChange={(e)=>handleDriveSpaceChange(e)}/>     
            <input type="file" accept="image/*" className="checklistfile" onChange={(e) => handleImageUpload(e)}/>  
             {/* Add a button to trigger image upload */}
              <button name='DriveSpace'  onClick={(e) => submitImageToServer(e)}>Upload Image</button>
              {/* ... rest of your JSX code ... */}             
            </div>

            <div className="checklistwrapper"  >
            <label  className="checklistlabel"> DisableIPV6</label>
            <input type="checkbox" className="checklistcheckbox" 
            checked={checklistresults.DisableIPV6}
            name='DisableIPV6'
            onChange={(e)=>handleDisableIPV6Change(e)}/> 
            <div className="checklistfile" ></div>           
            </div>

            <div className="checklistwrapper"  >
            <label  className="checklistlabel">VisualEffects</label>
            <input type="checkbox" className="checklistcheckbox" 
            checked={checklistresults?.BestPerformace?.VisualEffects}
            name='BestPerformace.VisualEffects'
            onChange={(e)=>handleVisualEffectsChange(e)}/>
            <div className="checklistfile" ></div>        
            </div>

            <div className="checklistwrapper"  >
            <label  className="checklistlabel">BackgroundServices</label>
            <input type="checkbox" className="checklistcheckbox" 
            checked={checklistresults?.BestPerformace?.BackgroundServices}
            name='BestPerformace.BackgroundServices'
            onChange={(e)=>handleBackgroundServicesChange(e)}/>
            <div className="checklistfile" ></div>        
            </div>

            <div className="ServerButtonsWrapper">
                <div className="Addclientwrapper">
                    <div className="addclienbutton" onClick={()=>submitchanges()}>+</div>
                    <div>Update Cheklist</div>
                </div>
                <div className="Addclientwrapper">
                    <div className="removeclientbutton" onClick={()=>deleteserver()}>+</div>
                    <div>Delete Server</div>
                </div>
            </div>

        </div>
        :''
    )

}

export default DbChecklist
