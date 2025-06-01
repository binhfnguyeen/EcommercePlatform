export default async (current,action)=>{
    switch(action.type){
        case "isshopowner":
            return action.payload;
        case "notshopowner":
            return null
    }
    return current
}