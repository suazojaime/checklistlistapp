import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
const socket = io("http://localhost:8000");

const DbChecklist = (props) =>{
    const serverid = useParams()
    console.log("serverid: " +serverid.id)
    const {checklist} = props
    const navigate = useNavigate()
    console.log(checklist)

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
        console.log('emiting event');
        /* socket.emit("updateEvent", checklistresults); */
        socket.emit("eventFromClient", checklistresults, (response) => {
            console.log("Server acknowledged the updateEvent with response:", response);
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
    console.log('updagting!!!!')
    console.log(checklistresults)
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
          // Create a new FormData object
          const formData = new FormData();
          formData.append("image", file);
          console.log(file)
          console.log(formData)
        
    
          // Send a POST request to your server to handle the file upload
          // Replace 'your_upload_endpoint' with your server's API endpoint
          /* fetch("http://localhost:8000/api/image/v3/upload", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              // Handle the server's response if needed
              console.log("File uploaded successfully:", data);
            })
            .catch((error) => {
              // Handle errors
              console.error("Error uploading file:", error);
            }); */
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
