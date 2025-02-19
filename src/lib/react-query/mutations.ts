import { useMutation } from "@tanstack/react-query"
import { changePassword } from "../../utils/api"

export const useChangePassword = ()=> {
    return useMutation({
        mutationFn: changePassword
    })
}