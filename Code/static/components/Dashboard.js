import AdminDash from "./AdminDash.js"
import CreatorDash from "./CreatorDash.js"
import ListenerDash from "./ListenerDash.js"

export default{
    template : `<div>
    <AdminDash v-if="userRole=='admin'"/>
    <CreatorDash v-if="userRole=='creator'"/>
    <ListenerDash v-if="userRole=='listener'"/>
    </div>`,

    data(){
        return{
            userRole : localStorage.getItem('role'),
            userid : localStorage.getItem('id')
        }
    },
    components:{
        AdminDash,
        CreatorDash,
        ListenerDash,
    }
}