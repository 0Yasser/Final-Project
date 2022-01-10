const initialState = {mainTrigger:null}

const trigger = (state=initialState,{type,payload})=>{
    switch(type){
        case 'TOGGLE_TRIGGER':
            return{mainTrigger:payload}
        default:
            return state;
    }
}

export default trigger;

export const toggleTrigger = (t)=>{
    return{
        type:"TOGGLE_TRIGGER",
        payload:t
    }
}
