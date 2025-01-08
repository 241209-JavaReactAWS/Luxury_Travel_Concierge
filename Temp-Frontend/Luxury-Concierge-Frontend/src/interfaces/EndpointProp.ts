import onError from "./onErrorInterface"
import onSuccess from "./onSuccessInterface"

/*
    This is for sending and endpoint as props for a component
    onSuccess is for the axios.then
    onError is for the axios.catch
*/

interface EndpointProp {
    placeholder ?: string,
    endpoint : string,
    statusChanger ?: any,
    type : string,
    data ?: any
    onSuccess : onSuccess,
    onError : onError
}

export default EndpointProp