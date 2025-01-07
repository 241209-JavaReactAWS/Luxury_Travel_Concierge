import onError from "./onErrorInterface"
import onSuccess from "./onSuccessInterface"

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