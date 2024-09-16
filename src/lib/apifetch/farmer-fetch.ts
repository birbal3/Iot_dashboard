    import axios from "axios";
    import { Farmer } from "@/components/dashboard/overview/crop-initialisation";
    export const fetchfarmer= async(farmer:string)=>{
        const res= await axios.get(`https://fmserver.escorts.co.in/admin/farmer?search=${farmer}`,{headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpdnlhbnNoLnJhc3RvZ2lAZXNjb3J0c2t1Ym90YS5jb20iLCJkZXBhcnRtZW50IjoiQUdSTyIsImlhdCI6MTcyNDE0MDM2Mn0.P_-Bf1xse3zm6UL6HjQgj1bWVzAVETB4MqSJB7EJcis`
          }})
        return res;
    }
    export const fetchfarm= async(farmer_id:string)=>{
      const res= await axios.get(`https://fmserver.escorts.co.in/admin/farmer/getdetails/${farmer_id}`,{headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpdnlhbnNoLnJhc3RvZ2lAZXNjb3J0c2t1Ym90YS5jb20iLCJkZXBhcnRtZW50IjoiQUdSTyIsImlhdCI6MTcyNDE0MDM2Mn0.P_-Bf1xse3zm6UL6HjQgj1bWVzAVETB4MqSJB7EJcis`
      }})
      console.log(res);
    return res;
    }

    export const fetchcrops= async()=>{
      const res= await axios.get(`http://localhost:3302/dropdown/crops`)
      console.log(res);
      return res;
    }

    export const fetchvariety = async(crop:string)=>{
      const res= await axios.get(`http://localhost:3302/dropdown/variety/${crop}`)
      console.log(res);
      return res;
    }