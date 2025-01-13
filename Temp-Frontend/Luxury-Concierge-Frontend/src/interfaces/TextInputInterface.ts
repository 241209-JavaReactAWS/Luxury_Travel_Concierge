/*
    This interface is for what the TextInput component props
*/

interface TextInputInterface{
    id:string,
    for:string
    onValueChange: any,
    statusChanger ?: any,
    width ?: string
    type ?: string
}

export default TextInputInterface