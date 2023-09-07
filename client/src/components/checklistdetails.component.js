import DbChecklist from "./dbchecklist.component"

const ChecklistDetails = (props)=>{

    const {checklists, ServerCategory} = props
   /*  console.log(checklists[0])
    console.log(ServerCategory) */

    if(ServerCategory === 'DBServer'){
        return(
            <DbChecklist checklist = {checklists[0]}  />
        )
    }else{
        return(
            ''
        )
}
}
export default ChecklistDetails;