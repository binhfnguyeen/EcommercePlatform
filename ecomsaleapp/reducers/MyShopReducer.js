export default async (current,action)=>{
    switch(action.type){
        case "getshop":
            return action.payload;
        case "notshopowner":
            return null
    }
    return current
}